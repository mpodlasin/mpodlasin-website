import setupScene from "./setupScene";
import loadAssets from "./loadAssets";
import * as THREE from "three";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import setupLights from "./setupLights";
import setupGui from "./setupGui";
import blobVertexShader from "../../../shaders/blob/vertex.glsl";
import blobFragmentShader from "../../../shaders/blob/fragment.glsl";

export default async function blobThree(
  canvas: HTMLCanvasElement,
  onUnmount: (fn: () => void) => void,
  onLoadingProgress: (progress: number) => void,
) {
  const { scene, camera, renderer, gui, controls, resourceTracker } =
    await setupScene(canvas);

  const { textures } = await loadAssets({
    onLoadingProgress,
    resourceTracker,
  });

  const geometry = new THREE.SphereGeometry(1, 200, 200);
  geometry.computeTangents();
  const sphere = new THREE.Mesh(
    geometry,
    new CustomShaderMaterial({
      baseMaterial: THREE.MeshPhysicalMaterial,
      vertexShader: blobVertexShader,
      fragmentShader: blobFragmentShader,

      uniforms: {
        uTime: new THREE.Uniform(0),
        uShift: new THREE.Uniform(0.5),
        uFrequency: new THREE.Uniform(2),
        uAmplitude: new THREE.Uniform(0.2),
      },

      metalness: 0.3,
      roughness: 0.5,
    }),
  );
  scene.add(sphere);

  const { ambientLight, directionalLight } = setupLights({ resourceTracker });
  scene.add(ambientLight, directionalLight);

  setupGui({ gui, directionalLight, controls, sphere });

  camera.position.z = 5;

  const setSize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  };
  setSize();
  window.addEventListener("resize", setSize);
  onUnmount(() => window.removeEventListener("resize", setSize));

  const timer = new THREE.Timer();
  let requestAnimationFrameId: number | null = null;
  function tick() {
    timer.update();
    const elapsedTime = timer.getElapsed();

    sphere.material.uniforms.uTime.value = elapsedTime;

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrameId = requestAnimationFrame(tick);
  }

  onUnmount(() => {
    if (requestAnimationFrameId !== null) {
      cancelAnimationFrame(requestAnimationFrameId);
    }
  });

  tick();
}
