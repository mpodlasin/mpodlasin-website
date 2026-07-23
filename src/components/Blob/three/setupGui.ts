import GUI from "lil-gui";
import * as THREE from "three";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import { OrbitControls } from "three/examples/jsm/Addons.js";

type SetupGuiArguments = {
  gui: GUI;
  controls: OrbitControls;
  directionalLight: THREE.DirectionalLight;
  sphere: THREE.Mesh<
    THREE.SphereGeometry,
    CustomShaderMaterial<typeof THREE.MeshPhysicalMaterial>
  >;
};

export default function setupGui({
  gui,
  directionalLight,
  controls,
  sphere,
}: SetupGuiArguments) {
  gui
    .add(directionalLight.position, "x")
    .min(-5)
    .max(5)
    .step(0.0001)
    .name("directional - x");
  gui
    .add(directionalLight.position, "y")
    .min(-5)
    .max(5)
    .step(0.0001)
    .name("directional - y");
  gui
    .add(directionalLight.position, "z")
    .min(-5)
    .max(5)
    .step(0.0001)
    .name("directional - z");

  gui
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .add(sphere.material as any, "metalness")
    .min(0)
    .max(1)
    .step(0.001);
  gui
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .add(sphere.material as any, "roughness")
    .min(0)
    .max(1)
    .step(0.001);
  gui
    .add(sphere.material.uniforms.uFrequency, "value")
    .min(0)
    .max(10)
    .step(0.001)
    .name("uFrequency");
  gui
    .add(sphere.material.uniforms.uAmplitude, "value")
    .min(0)
    .max(3)
    .step(0.001)
    .name("uAmplitude");

  gui
    .add(sphere.material.uniforms.uShift, "value")
    .min(0)
    .max(1)
    .step(0.0001)
    .name("uShift");

  gui.add(controls, "enabled").name("controls enabled");
}
