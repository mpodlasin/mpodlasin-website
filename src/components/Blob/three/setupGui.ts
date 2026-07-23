import GUI from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

type SetupGuiArguments = {
  gui: GUI;
  controls: OrbitControls;
  directionalLight: THREE.DirectionalLight;
};

export default function setupGui({
  gui,
  directionalLight,
  controls,
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

  gui.add(controls, "enabled").name("controls enabled");
}
