import setupScene from "./setupScene";
import loadAssets from "./loadAssets";
import createText from "./createText";
import createCubeFactory from "./createCube";
import setupTextCollision from "./setupTextCollisions";
import setupLights from "./setupLights";
import setupGui from "./setupGui";

export default async function heroThree(
  canvas: HTMLCanvasElement,
  onUnmount: (fn: () => void) => void,
  onLoadingProgress: (progress: number) => void,
) {
  const { scene, camera, renderer, gui, controls, RAPIER, world } =
    await setupScene(canvas);

  const { textures, fonts } = await loadAssets(onLoadingProgress);

  const { ambientLight, directionalLight } = setupLights();
  scene.add(ambientLight, directionalLight);

  const { text, name, surname } = createText({ textures, fonts });
  scene.add(text);

  const { createCube, cubeMaterial, updateCubes } = createCubeFactory({
    world,
    scene,
    RAPIER,
    surname,
  });
  const intervalId = setInterval(createCube, 100);
  onUnmount(() => clearInterval(intervalId));

  setupTextCollision({ RAPIER, world, name, surname });

  setupGui({ gui, name, cubeMaterial, directionalLight, controls });

  camera.position.z = 10;
  camera.position.y = 1;

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  let scrollPosition = 0;
  const updateScrollPosition = () => {
    scrollPosition = window.scrollY / window.innerHeight;

    if (scrollPosition < 2) {
      canvas.style.setProperty("top", `${window.scrollY}px`);
    }
  };
  window.addEventListener("scroll", updateScrollPosition);
  onUnmount(() => window.removeEventListener("scroll", updateScrollPosition));

  let requestAnimationFrameId: number | null = null;
  function tick() {
    camera.position.x = Math.sin(scrollPosition * Math.PI) * 5;
    camera.position.z = Math.cos(scrollPosition * Math.PI) * 5;

    directionalLight.position.x = Math.sin(scrollPosition * Math.PI) * 5;
    directionalLight.position.z = Math.cos(scrollPosition * Math.PI) * 5;

    world.step();

    updateCubes();

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
