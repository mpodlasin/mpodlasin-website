import * as THREE from "three";
import GUI from "lil-gui";

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

  gui.hide();

  return { scene, camera, renderer, gui };
}
