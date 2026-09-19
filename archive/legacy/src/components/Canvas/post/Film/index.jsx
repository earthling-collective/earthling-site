import { ShaderMaterial, UniformsUtils } from "three";
import { Pass } from "three/examples/jsm/postprocessing/Pass";
import vertex from "!raw-loader!./vertex.glsl";
import fragment from "!raw-loader!./fragment.glsl";

var FilmPass = function (noiseIntensity, scanlinesIntensity, scanlinesCount) {
  Pass.call(this);

  this.uniforms = UniformsUtils.clone({
    tDiffuse: { value: null },
    time: { value: 0.0 },
    nIntensity: { value: 0.5 },
    sIntensity: { value: 0.05 },
    sCount: { value: 4096 },
  });

  this.material = new ShaderMaterial({
    uniforms: this.uniforms,
    vertexShader: vertex,
    fragmentShader: fragment,
  });

  if (noiseIntensity !== undefined)
    this.uniforms.nIntensity.value = noiseIntensity;
  if (scanlinesIntensity !== undefined)
    this.uniforms.sIntensity.value = scanlinesIntensity;
  if (scanlinesCount !== undefined) this.uniforms.sCount.value = scanlinesCount;

  this.fsQuad = new Pass.FullScreenQuad(this.material);
};

FilmPass.prototype = Object.assign(Object.create(Pass.prototype), {
  constructor: FilmPass,

  render: function (
    renderer,
    writeBuffer,
    readBuffer,
    deltaTime /*, maskActive */
  ) {
    this.uniforms["tDiffuse"].value = readBuffer.texture;
    this.uniforms["time"].value += deltaTime;

    if (this.renderToScreen) {
      renderer.setRenderTarget(null);
      this.fsQuad.render(renderer);
    } else {
      renderer.setRenderTarget(writeBuffer);
      if (this.clear) renderer.clear();
      this.fsQuad.render(renderer);
    }
  },
});

export { FilmPass };
