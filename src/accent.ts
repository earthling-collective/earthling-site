// The accent cycle, mirrored from the --accent keyframes in styles.css so the shader stays in step

export const accentStops: [number, number, number][] = [
  [0.94, 0.65, 0.42], // ember
  [0.6, 0.83, 0.56], // flora
  [0.62, 0.77, 0.9], // arctic
];

export const accentPeriod = 24_000;

const smooth = (t: number) => t * t * (3 - 2 * t);

// Color at a moment on the same clock CSS animations use (ms since time origin)
export function accentAt(now: number): [number, number, number] {
  const phase = ((now % accentPeriod) + accentPeriod) / accentPeriod;
  const segment = phase * accentStops.length;
  const from = accentStops[Math.floor(segment) % accentStops.length];
  const to = accentStops[(Math.floor(segment) + 1) % accentStops.length];
  const t = smooth(segment - Math.floor(segment));
  return [0, 1, 2].map((i) => from[i] + (to[i] - from[i]) * t) as [number, number, number];
}
