uniform sampler2D tDiffuse;
uniform sampler2D tDisp;
uniform float amount;
uniform float angle;
uniform float seed;
uniform float seed_x;
uniform float seed_y;
uniform float col_s;
varying vec2 vUv;

float rand(vec2 co){
  return fract(sin(dot(co.xy,vec2(12.9898,78.233)))*43758.5453);
}

void main(){
  vec2 p=vUv;
  float xs=floor(gl_FragCoord.x/.5);
  float ys=floor(gl_FragCoord.y/.5);
  //based on staffantans glitch shader for unity https://github.com/staffantan/unityglitch
  vec4 normal=texture2D(tDisp,p*seed*seed);
  p.x+=normal.x*seed_x*(seed/5.);
  p.y+=normal.y*seed_y*(seed/5.);
  //base from RGB shift shader
  vec2 offset=amount*vec2(cos(angle),sin(angle));
  vec4 cr=texture2D(tDiffuse,p);
  vec4 cga=texture2D(tDiffuse,p+offset);
  vec4 cb=texture2D(tDiffuse,p-offset);
  gl_FragColor=vec4(cr.r,cga.g,cb.b,cr.a);
}