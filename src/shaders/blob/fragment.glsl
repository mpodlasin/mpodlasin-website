#pragma glslify: simplexNoise4d = require('../includes/simplexNoise4d.glsl');

uniform float uTime;
varying float vDeformation;

void main() {
    csm_DiffuseColor = vec4(1.0, 1.0, 1.0, 1.0);
    csm_Roughness = simplexNoise4d(vec4(uTime * 0.001)) / 2.0 + 0.5;
}