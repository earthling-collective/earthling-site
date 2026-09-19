import * as THREE from "three";
import React, { useRef, useMemo, useEffect } from "react";
import { extend, useThree, useFrame } from "react-three-fiber";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { FilmPass } from "./post/Film";
import { GlitchPass } from "./post/Glitch";
import { BulgePass } from "./post/Bulge";

extend({
  EffectComposer,
  ShaderPass,
  RenderPass,
  BulgePass,
  UnrealBloomPass,
  FilmPass,
  GlitchPass,
});

export default function Effects({ bloom = true }) {
  const composer = useRef();
  const { scene, gl, size, camera } = useThree();
  const aspect = useMemo(() => new THREE.Vector2(size.width, size.height), [
    size,
  ]);
  useEffect(() => void composer.current.setSize(size.width, size.height), [
    size,
  ]);
  useFrame(() => composer.current.render(), 1);
  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      {bloom !== false && (
        <unrealBloomPass attachArray="passes" args={[aspect, 0.5, 0, 0]} />
      )}
      <filmPass attachArray="passes" args={[0.7, 0.1, 5000]} />
      <glitchPass attachArray="passes" factor={0.1} />
      <bulgePass attachArray="passes" factor={0.1} />
    </effectComposer>
  );
}
