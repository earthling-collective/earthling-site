import { useEffect, useRef, useState } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";
import { signalFragment, signalVertex } from "./signal-shaders";
import { accentAt } from "../accent";

type SignalFieldStatus = "ready" | "unavailable";

export interface SignalFieldProps {
  paused?: boolean;
  onStatusChange?: (status: SignalFieldStatus) => void;
  className?: string;
}

const MAX_RENDER_PIXELS = 1_350_000;
const MAX_DPR = 1.5;

export function SignalField({
  paused = false,
  onStatusChange,
  className,
}: SignalFieldProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  const statusCallbackRef = useRef(onStatusChange);
  const reconcileRef = useRef<() => void>(() => undefined);
  const lastReportedStatusRef = useRef<SignalFieldStatus | null>(null);
  const [status, setStatus] = useState<SignalFieldStatus>("unavailable");

  useEffect(() => {
    pausedRef.current = paused;
    reconcileRef.current();
  }, [paused]);

  useEffect(() => {
    statusCallbackRef.current = onStatusChange;
  }, [onStatusChange]);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    let renderer: Renderer | null = null;
    let geometry: Triangle | null = null;
    let program: Program | null = null;
    let mesh: Mesh | null = null;
    let frame = 0;
    let destroyed = false;
    let contextLost = false;
    let inViewport = true;
    let pageVisible = document.visibilityState !== "hidden";
    let elapsed = 0;
    let lastFrameTime = performance.now();
    const pointerTarget = { x: 0, y: 0 };
    const pointerCurrent = { x: 0, y: 0 };

    const report = (nextStatus: SignalFieldStatus) => {
      if (lastReportedStatusRef.current === nextStatus || destroyed) return;
      lastReportedStatusRef.current = nextStatus;
      setStatus(nextStatus);
      statusCallbackRef.current?.(nextStatus);
    };

    const disposeGPU = () => {
      geometry?.remove();
      program?.remove();
      geometry = null;
      program = null;
      mesh = null;
      renderer = null;
    };

    const resize = () => {
      if (!renderer || !program || destroyed) return;
      const bounds = host.getBoundingClientRect();
      const width = Math.max(1, Math.round(bounds.width));
      const height = Math.max(1, Math.round(bounds.height));
      const pixelBudgetDpr = Math.sqrt(MAX_RENDER_PIXELS / (width * height));
      renderer.dpr = Math.max(
        0.35,
        Math.min(window.devicePixelRatio || 1, MAX_DPR, pixelBudgetDpr),
      );
      renderer.setSize(width, height);
      program.uniforms.uResolution.value[0] = canvas.width;
      program.uniforms.uResolution.value[1] = canvas.height;
    };

    const render = (now: number) => {
      if (!renderer || !program || !mesh || destroyed || contextLost) return;
      const delta = shouldAnimate()
        ? Math.min(50, Math.max(0, now - lastFrameTime))
        : 0;
      lastFrameTime = now;
      elapsed += delta;
      pointerCurrent.x += (pointerTarget.x - pointerCurrent.x) * 0.055;
      pointerCurrent.y += (pointerTarget.y - pointerCurrent.y) * 0.055;
      program.uniforms.uTime.value = elapsed * 0.001;
      program.uniforms.uAccent.value.set(accentAt(now));
      program.uniforms.uPointer.value[0] = pointerCurrent.x;
      program.uniforms.uPointer.value[1] = pointerCurrent.y;
      renderer.render({ scene: mesh });
    };

    const shouldAnimate = () =>
      Boolean(renderer && program && mesh) &&
      !pausedRef.current &&
      pageVisible &&
      inViewport &&
      !contextLost;

    const animate = (now: number) => {
      frame = 0;
      render(now);
      if (shouldAnimate()) frame = requestAnimationFrame(animate);
    };

    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    const reconcileAnimation = () => {
      stop();
      lastFrameTime = performance.now();
      if (shouldAnimate()) frame = requestAnimationFrame(animate);
    };
    reconcileRef.current = reconcileAnimation;

    const createGPU = () => {
      disposeGPU();
      try {
        renderer = new Renderer({
          canvas,
          alpha: false,
          antialias: false,
          depth: false,
          stencil: false,
          dpr: 1,
        });
        const gl = renderer.gl;
        gl.clearColor(0.038, 0.038, 0.034, 1);
        geometry = new Triangle(gl);
        program = new Program(gl, {
          vertex: signalVertex,
          fragment: signalFragment,
          depthTest: false,
          depthWrite: false,
          cullFace: null,
          uniforms: {
            uResolution: { value: new Float32Array([1, 1]) },
            uPointer: { value: new Float32Array([0, 0]) },
            uTime: { value: 0 },
            uAccent: { value: new Float32Array([0.94, 0.65, 0.42]) },
          },
        });
        if (!gl.getProgramParameter(program.program, gl.LINK_STATUS)) {
          throw new Error(
            gl.getProgramInfoLog(program.program) ||
              "Signal field shader failed to link.",
          );
        }
        mesh = new Mesh(gl, { geometry, program });
        contextLost = false;
        resize();
        render(performance.now());
        report("ready");
        reconcileAnimation();
      } catch (error) {
        console.warn("Signal field renderer unavailable.", error);
        disposeGPU();
        report("unavailable");
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!inViewport || !pageVisible || pausedRef.current) return;
      const bounds = host.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      if (x < 0 || x > 1 || y < 0 || y > 1) {
        pointerTarget.x = 0;
        pointerTarget.y = 0;
        return;
      }
      pointerTarget.x = x * 2 - 1;
      pointerTarget.y = -(y * 2 - 1);
    };

    const onVisibilityChange = () => {
      pageVisible = document.visibilityState !== "hidden";
      reconcileAnimation();
      if (pageVisible && !shouldAnimate()) render(performance.now());
    };

    const onContextLost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      stop();
      disposeGPU();
      report("unavailable");
    };

    const onContextRestored = () => {
      if (!destroyed) createGPU();
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      render(performance.now());
    });
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        inViewport = entry?.isIntersecting ?? false;
        reconcileAnimation();
        if (inViewport && !shouldAnimate()) render(performance.now());
      },
      { rootMargin: "80px 0px" },
    );

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);
    resizeObserver.observe(host);
    intersectionObserver.observe(host);
    createGPU();

    return () => {
      destroyed = true;
      reconcileRef.current = () => undefined;
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      disposeGPU();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className={className ? `signal-field ${className}` : "signal-field"}
      data-renderer={status === "ready" ? "ogl" : "fallback"}
      style={{ position: "relative", overflow: "hidden" }}
    >
      <img
        src="/media/field-fallback.svg"
        alt=""
        aria-hidden="true"
        draggable={false}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          opacity: status === "ready" ? 1 : 0,
        }}
      />
    </div>
  );
}

export default SignalField;
