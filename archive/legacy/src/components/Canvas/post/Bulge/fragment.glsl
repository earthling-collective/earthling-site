uniform float factor;
uniform vec2 resolution;
uniform sampler2D texture;

varying vec2 vUv;

void main(){
  vec2 uv1=vUv;
  vec2 uv=gl_FragCoord.xy/resolution.xy;
  
  float edgeDistX=pow(distance(uv1.x,.5),2.);
  float edgeDistY=pow(distance(uv1.y,.5),2.);
  float dist=(edgeDistX+edgeDistY)*factor;
  
  uv1+=(uv1*2.-vec2(1.))*dist;
  
  vec4 rgba=texture2D(texture,uv1);
  
  rgba*=1.-smoothstep(.95,1.,uv1.y);
  rgba*=smoothstep(0.,.05,uv1.y);
  rgba*=1.-smoothstep(.95,1.,uv1.x);
  rgba*=smoothstep(0.,.05,uv1.x);
  
  gl_FragColor=rgba;
}