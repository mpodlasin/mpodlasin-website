import * as THREE from "three";
import GUI from "lil-gui";
import ResourceTracker from "@/utils/ResourceTracker";

export default function setupScene(canvas: HTMLCanvasElement) {
  const gui = new GUI();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.01,
    1000,
  );
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  const resourceTracker = new ResourceTracker();

  gui.hide();

  return { scene, camera, renderer, gui, resourceTracker };
}
