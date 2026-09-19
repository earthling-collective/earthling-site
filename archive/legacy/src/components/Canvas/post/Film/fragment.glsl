
uniform float time;

uniform float nIntensity;
uniform float sIntensity;
uniform float sCount;

uniform sampler2D tDiffuse;

varying vec2 vUv;

float rand(vec2 co){
  return fract(sin(dot(co.xy,vec2(12.9898,78.233)))*43758.5453);
}

void main(){
  // sample the source
  vec4 cTextureScreen=texture2D(tDiffuse,vUv);
  
  // make some noise
  float dx=rand(vUv+mod(time,1000.));
  // add noise
  vec3 cResult=cTextureScreen.rgb+cTextureScreen.rgb*clamp(.1+dx,0.,1.);
  // get us a sine and cosine
  vec2 sc=vec2(sin(vUv.y*sCount),cos(vUv.y*sCount));
  // add scanlines
  cResult+=cTextureScreen.rgb*vec3(sc.x,sc.y,sc.x)*sIntensity;
  // interpolate between source and result by intensity
  cResult=cTextureScreen.rgb+clamp(nIntensity,0.,1.)*(cResult-cTextureScreen.rgb);
  
  gl_FragColor=vec4(cResult,cTextureScreen.a);
  
}