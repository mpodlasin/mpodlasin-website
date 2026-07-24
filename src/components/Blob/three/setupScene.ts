import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
import ResourceTracker from "@/utils/ResourceTracker";

export default async function setupScene(canvas: HTMLCanvasElement) {
  const gui = new GUI();
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / 2 / window.innerHeight,
    0.01,
    1000,
  );

  const controls = new OrbitControls(camera, canvas);
  controls.enabled = false;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });

  gui.hide();

  const resourceTracker = new ResourceTracker();

  return {
    scene,
    camera,
    renderer,
    gui,
    controls,
    resourceTracker,
  };
}
