// -- MSDF SHADERS-- //
const MSDFvertexShader = `

attribute float line;
varying vec2 vUv;
varying float vLine;
varying vec3 vPos;

void main() {
  vLine = line;
  vUv = uv; 
  vPos = position;

  vec4 modelViewPosition = modelViewMatrix * vec4(vPos, 1.0);
  gl_Position = projectionMatrix * modelViewPosition; 
}
`;

const MSDFfragmentShader = `
#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif

varying vec2 vUv;
varying vec3 vPos;
varying float vLine;

uniform sampler2D uTexture;
uniform vec3 color;
uniform float iGlobalTime;
uniform float animate;

float median(float r, float g, float b) {
  return max(min(r, g), min(max(r, g), b));
}

void main() {
  vec3 text = texture2D(uTexture, vUv).rgb;
  float sigDist = median(text.r, text.g, text.b) - 0.5;
  float alpha = clamp(sigDist/fwidth(sigDist) + 0.5, 0.0, 1.0);
  float opacity = 1.0;
  gl_FragColor = vec4(color.xyz, alpha * opacity);
}
`;

//----------------- TORUS KNOT SHADERS -----------------//

const torusVertex = `
  varying vec2 vUv;
  varying vec3 vPos;

  void main() {
    vUv = uv;
    vPos = position;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
  }
`;

const torusFragment = `
  varying vec2 vUv;
  varying vec3 vPos;

  uniform sampler2D uTexture;
  uniform float uTime;

  void main() {
    float time = uTime * 0.75;
    vec2 repeat = vec2(12.,3.);
    vec2 uv = fract(vUv * repeat - vec2(time, 0.));

    vec3 texture = texture2D(uTexture, uv).rgb;

    float shadow = clamp(vPos.z / 5., 0., 1.);

    gl_FragColor = vec4(texture * shadow, 1.);
  }
`;

//----------------- BOX SHADERS -----------------//

const boxVertex = /* glsl */ `
  varying vec2 vUv;

  uniform float uTime;

  mat4 rotation3d(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;

    return mat4(
      oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
      oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
      oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
      0.0,                                0.0,                                0.0,                                1.0
    );
  }

  vec3 rotate(vec3 v, vec3 axis, float angle) {
    return (rotation3d(axis, angle) * vec4(v, 1.0)).xyz;
  }

  void main() {
    vUv = uv;

    vec3 pos = position;

    vec3 axis = vec3(1., 0., 0.);
    float twist = 0.1;
    float angle = pos.x * twist;

    vec3 transformed = rotate(pos, axis, angle);

    // float freq = 0.75;
    // float amp = 1.;
    // transformed.y += cos(transformed.x * freq + 0.) * amp;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.);
  }
`;

const boxFragment = /* glsl */ `
  varying vec2 vUv;

  uniform float uTime;
  uniform sampler2D uTexture;

  void main() {
    float time = uTime * 0.25;
    vec2 uv = fract(vUv * 3. - vec2(time, 0.));
    vec3 texture = texture2D(uTexture, uv).rgb;

    gl_FragColor = vec4(texture, 1.);
  }
`;

//----------------- PLANE SHADERS -----------------//

const planeVertex = /* glsl */ `
  varying vec2 vUv;
  varying float vWave;

  uniform float uTime;

  void main() {
    vUv = uv;

    vec3 pos = position;
    float freq = 2.;
    float amp = 2.;
    float time = uTime * 3.5;
    pos.z += sin(sqrt((pos.x * pos.x) + (pos.y * pos.y) ) * freq) * amp;
    // pos.z += sin((pos.x - pos.y) * freq - time) * amp;
    vWave = pos.z;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
  }
`;

const planeFragment = /* glsl */ `
  varying vec2 vUv;
  varying float vWave;

  uniform float uTime;
  uniform sampler2D uTexture;

  float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
  }

  void main() {
    float time = uTime * 0.25;
    vec2 repeat = vec2(4., 12.);
    vec2 uv = fract(vUv * repeat);
    vec3 texture = texture2D(uTexture, uv).rgb;
    // texture *= vec3(uv.x, uv.y, 0.);

    float wave = vWave;
    wave = map(wave, -1., 1., 0., 0.1);
    float shadow = 1. - wave;

    vec3 fragColor = texture * shadow;

    gl_FragColor = vec4(fragColor, 1.);
  }
`;

//----------------- PLANE SHADERS -----------------//

const crazyVertex = /* glsl */ `
  varying vec2 vUv;
  varying float vWave;

  uniform float uTime;
  uniform float mousePositionX;
  uniform float mousePositionY;

  void main() {
    vUv = uv;

    vec3 pos = position;
    float freq = 1.;
    float amp = 2.;
    float time = uTime * 2.;

    pos.z += sin(sqrt(pow(pos.x - (mousePositionX*0.018),2.) + pow(pos.y + (mousePositionY*0.03), 2.) ) * freq - time  ) * amp;
    // pos.z += sin((pos.x - pos.y) * freq - time) * amp;
    vWave = pos.z;
  
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
  }
`;

const crazyFragment = /* glsl */ `
  varying vec2 vUv;
  varying float vWave;

  uniform float uTime;
  uniform float mousePositionX;
  uniform float mousePositionY;
  uniform sampler2D uTexture;

  float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
  }

  void main() {
    float time = uTime * 0.25;
    vec2 repeat = vec2(4., 8.);
    vec2 uv = fract(vUv * repeat);
    vec3 texture = texture2D(uTexture, uv).rgb;
    // texture *= vec3(uv.x, uv.y, 0.);

    float wave = vWave;
    wave = map(wave, -1., 1., 0., 0.1);
    float shadow = 1. - wave;

    vec3 fragColor = texture * shadow;

    gl_FragColor = vec4(fragColor, 1.);
  }
`;

module.exports = {
  vertex: {
    msdf : MSDFvertexShader,
    torus : torusVertex,
    box : boxVertex,
    plane : planeVertex,
    crazy : crazyVertex,
  },
  fragment:{
    msdf : MSDFfragmentShader,
    torus : torusFragment,
    box : boxFragment,
    plane : planeFragment,
    crazy : crazyFragment,
  }
};
