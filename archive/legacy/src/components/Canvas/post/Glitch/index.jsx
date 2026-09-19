import {
  DataTexture,
  FloatType,
  Math as _Math,
  Mesh,
  OrthographicCamera,
  PlaneBufferGeometry,
  RGBFormat,
  Scene,
  ShaderMaterial,
  UniformsUtils,
} from "three";
import { Pass } from "three/examples/jsm/postprocessing/Pass";
import vertex from "!raw-loader!./vertex.glsl";
import fragment from "!raw-loader!./fragment.glsl";

var DigitalGlitch = {
  uniforms: {
    tDiffuse: { value: null }, //diffuse texture
    tDisp: { value: null }, //displacement texture for digital glitch squares
    amount: { value: 0.08 },
    angle: { value: 0.02 },
    seed: { value: 0.02 },
    seed_x: { value: 0.02 }, //-1,1
    seed_y: { value: 0.02 }, //-1,1
    col_s: { value: 0.05 },
  },

  vertexShader: vertex,
  fragmentShader: fragment,
};

var GlitchPass = function (dt_size) {
  Pass.call(this);
  if (DigitalGlitch === undefined)
    console.error("THREE.GlitchPass relies on THREE.DigitalGlitch");
  var shader = DigitalGlitch;
  this.uniforms = UniformsUtils.clone(shader.uniforms);
  if (dt_size === undefined) dt_size = 64;
  this.uniforms["tDisp"].value = this.generateHeightmap(dt_size);
  this.material = new ShaderMaterial({
    uniforms: this.uniforms,
    vertexShader: shader.vertexShader,
    fragmentShader: shader.fragmentShader,
  });
  this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  this.scene = new Scene();
  this.quad = new Mesh(new PlaneBufferGeometry(2, 2), null);
  this.quad.frustumCulled = false; // Avoid getting clipped
  this.scene.add(this.quad);
  this.factor = 0;
  this.time = 0;
};

GlitchPass.prototype = Object.assign(Object.create(Pass.prototype), {
  constructor: GlitchPass,

  render: function (renderer, writeBuffer, readBuffer, deltaTime, maskActive) {
    this.time += deltaTime;
    const factor = Math.max(0, this.factor);
    this.uniforms["tDiffuse"].value = readBuffer.texture;
    this.uniforms["seed"].value = Math.random() * factor; //default seeding
    this.uniforms["amount"].value =
      (0.015 + Math.sin(this.time * 2) * 0.001) * factor;
    this.uniforms["angle"].value = Math.sin(this.time * 0.2) * Math.PI * factor;
    this.uniforms["seed_x"].value =
      Math.pow(Math.random(), 1000) * Math.sin(Math.random()) * 5;
    this.uniforms["seed_y"].value =
      Math.pow(Math.random(), 1000) * Math.sin(Math.random()) * 5;
    this.quad.material = this.material;
    if (this.renderToScreen) {
      renderer.setRenderTarget(null);
      renderer.render(this.scene, this.camera);
    } else {
      renderer.setRenderTarget(writeBuffer);
      if (this.clear) renderer.clear();
      renderer.render(this.scene, this.camera);
    }
  },

  generateHeightmap: function (dt_size) {
    var data_arr = new Float32Array(dt_size * dt_size * 3);
    var length = dt_size * dt_size;

    for (var i = 0; i < length; i++) {
      var val = _Math.randFloat(0, 1);
      data_arr[i * 3 + 0] = val;
      data_arr[i * 3 + 1] = val;
      data_arr[i * 3 + 2] = val;
    }

    var texture = new DataTexture(
      data_arr,
      dt_size,
      dt_size,
      RGBFormat,
      FloatType
    );
    texture.needsUpdate = true;
    return texture;
  },
});

export { GlitchPass };
