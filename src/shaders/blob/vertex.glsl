#pragma glslify: simplexNoise4d = require('../includes/simplexNoise4d.glsl');

uniform float uShift;
uniform float uTime;
uniform float uFrequency;
uniform float uAmplitude;
attribute vec4 tangent;
varying float vDeformation;

float deform(vec3 position) {
    return simplexNoise4d(vec4(position * uFrequency, uTime * 0.2)) * uAmplitude;
}

void main() {
    float deformationStrength = deform(csm_Position);
    vec3 tangentA = tangent.xyz;
    vec3 tangentB = cross(csm_Normal, tangentA);

    vec3 neighboorA = csm_Position + tangentA * uShift;
    vec3 neighboorB = csm_Position + tangentB * uShift;

    vec3 deformedA = neighboorA + csm_Normal * deform(neighboorA);
    vec3 deformedB = neighboorB + csm_Normal * deform(neighboorB);

    vec3 newPosition = csm_Position + csm_Normal * deformationStrength;

    vec3 toA = normalize(deformedA - newPosition);
    vec3 toB = normalize(deformedB - newPosition);
    
    vec3 newNormal = normalize(cross(toA, toB));
    
    csm_Position = newPosition;
    csm_Normal = newNormal;
    vDeformation = deformationStrength / uAmplitude;
}