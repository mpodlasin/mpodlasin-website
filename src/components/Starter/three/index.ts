import setupScene from "./setupScene";
import loadAssets from "./loadAssets";
import * as THREE from "three";
import setupLights from "./setupLights";
import setupGui from "./setupGui";

export default async function starterThree(
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

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 100, 100),
    new THREE.MeshStandardMaterial({
      color: "teal",
      normalMap: textures.velvet.normal,
      roughnessMap: textures.velvet.arm,
      metalnessMap: textures.velvet.arm,
      aoMap: textures.velvet.arm,
    }),
  );
  scene.add(sphere);

  const { ambientLight, directionalLight } = setupLights({ resourceTracker });
  scene.add(ambientLight, directionalLight);

  setupGui({ gui, directionalLight, controls });

  camera.position.z = 5;

  const setSize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  };
  setSize();
  window.addEventListener("resize", setSize);
  onUnmount(() => window.removeEventListener("resize", setSize));

  let requestAnimationFrameId: number | null = null;
  function tick() {
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
