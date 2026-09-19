export const signalVertex = /* glsl */ `
attribute vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

export const signalFragment = /* glsl */ `
precision highp float;

uniform vec2 uResolution;
uniform vec2 uPointer;
uniform float uTime;

#define STRANDS 88

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution.xy) / min(uResolution.x, uResolution.y);
  float aspect = uResolution.x / uResolution.y;
  float portrait = 1.0 - smoothstep(0.72, 1.08, aspect);
  uv *= mix(1.0, 1.22, portrait);
  uv.x += mix(0.03, 0.0, portrait);

  float t = uTime * 0.115;
  float x = uv.x;
  float pointerInfluence = exp(-1.7 * pow(x - uPointer.x * 0.48, 2.0));
  float center = -0.055 * x
               + 0.075 * sin(x * 1.18 - t)
               + 0.025 * sin(x * 3.35 + t * 0.7)
               + uPointer.y * 0.075 * pointerInfluence;
  float aperture = exp(-pow(abs(x) * 0.57, 4.0));
  float span = (0.12 + 0.49 * aperture) * mix(1.0, 0.86, portrait);
  float twist = x * 1.47
              + 0.31 * sin(x * 1.72 + t)
              + uPointer.x * 0.16 * pointerInfluence;

  float pointerSlope = -3.4 * (x - uPointer.x * 0.48) * pointerInfluence;
  float centerSlope = -0.055 + 0.0885 * cos(x * 1.18 - t)
                    + 0.08375 * cos(x * 3.35 + t * 0.7)
                    + uPointer.y * 0.075 * pointerSlope;
  float apertureSlope = -0.42224 * x * x * x * aperture;
  float spanSlope = 0.49 * apertureSlope * mix(1.0, 0.86, portrait);
  float twistSlope = 1.47 + 0.5332 * cos(x * 1.72 + t)
                   + uPointer.x * 0.16 * pointerSlope;

  vec3 color = vec3(0.035, 0.039, 0.043);
  float body = exp(-pow(abs(uv.y - center) / (span + 0.08), 2.25));
  color += vec3(0.018, 0.025, 0.031) * body * aperture;

  float pixel = 1.0 / min(uResolution.x, uResolution.y);
  float lineWidth = max(pixel * 0.38, 0.00042);
  float edgeFade = 1.0 - smoothstep(1.64, 2.02, abs(x));

  for (int i = 0; i < STRANDS; i++) {
    float fi = (float(i) + 0.5) / float(STRANDS);
    float s = fi * 2.0 - 1.0;
    float depth = s * sin(twist);
    float projection = s * cos(twist);
    float fold = 0.062 * sin(x * 2.36 + s * 3.1 - t * 0.8) * (1.0 - s * s);
    float micro = 0.010 * sin(x * 6.2 - s * 8.0 + t) * aperture;
    float strandY = center + span * projection + fold + micro;
    float distanceToStrand = abs(uv.y - strandY);
    float front = 0.38 + 0.62 * smoothstep(-1.0, 0.92, depth);
    float antialias = pixel * (0.92 + 0.68 * abs(sin(twist)));
    float width = lineWidth * mix(0.78, 1.24, front);
    float core = 1.0 - smoothstep(width, width + antialias, distanceToStrand);
    float glow = exp(-distanceToStrand * 260.0) * 0.0045;
    float cadence = 0.80 + 0.20 * sin(fi * 37.7);

    vec3 cold = mix(vec3(0.23, 0.42, 0.56), vec3(0.88, 0.94, 0.97), front);
    color += cold * (core * (0.31 + front * 0.42) + glow) * cadence * edgeFade;

    float goldBand = exp(-abs(s - 0.31) * 62.0) + exp(-abs(s + 0.67) * 76.0);
    float dispersion = smoothstep(0.05, 0.82, sin(x * 1.55 - s * 2.0 + 0.8));
    color += vec3(1.0, 0.39, 0.075) * core * goldBand * dispersion * 0.72 * edgeFade;
  }

  float caustic = exp(-abs(cos(twist)) * 34.0) * aperture * edgeFade;
  float verticalFalloff = exp(-abs(uv.y - center) * 4.0);
  color += vec3(0.56, 0.72, 0.82) * caustic * verticalFalloff * 0.12;

  float vignette = 1.0 - smoothstep(0.62, 1.9, length(uv * vec2(0.82, 1.0)));
  color *= 0.84 + vignette * 0.16;
  color += (hash21(gl_FragCoord.xy) - 0.5) * 0.0032;
  gl_FragColor = vec4(color, 1.0);
}
`;
