import * as THREE from "three";
import setupScene from "./setupScene";
import loadAssets from "./loadAssets";
import createWall from "./createWall";
import createText from "./createText";
import createLamps from "./createLamps";
import createLights from "./createLights";
import setupGui from "./setupGui";

export default async function heroThree(
  canvas: HTMLCanvasElement,
  onUnmount: (fn: () => void) => void,
  onLoadingProgress: (progress: number) => void,
) {
  const { scene, camera, renderer, gui, resourceTracker } = setupScene(canvas);

  const { textures, fonts, models } = await loadAssets({
    onLoadingProgress,
    resourceTracker,
  });

  const { plane } = createWall({ textures, resourceTracker });
  scene.add(plane);

  const { text } = createText({ textures, fonts, resourceTracker });
  scene.add(text);

  const { lampA, lampB } = createLamps({ models, resourceTracker });
  scene.add(lampA, lampB);

  const {
    ambientLight,
    directionalLight,
    spotLight,
    pointLightA,
    pointLightB,
    colors,
    intensity,
  } = createLights({ lampA, lampB, resourceTracker });
  scene.add(
    ambientLight,
    directionalLight,
    pointLightA,
    pointLightB,
    spotLight,
    spotLight.target,
  );

  camera.position.z = 8;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const { options } = setupGui({
    gui,
    colors,
    ambientLight,
    directionalLight,
    spotLight,
    pointLightA,
    pointLightB,
  });

  /* MOUSE */

  const mousePosition = {
    x: 0,
    y: 0,
  };
  const handleMouseMove = (e: MouseEvent) => {
    e.preventDefault();

    mousePosition.x = e.clientX / window.innerWidth;
    mousePosition.y = e.clientY / window.innerHeight;
  };
  window.addEventListener("pointermove", handleMouseMove);
  onUnmount(() => {
    window.removeEventListener("pointermove", handleMouseMove);
  });

  let flashLightOn = false;
  let flashLightMoment = 0;
  const handleClick = (e: MouseEvent) => {
    handleMouseMove(e);

    flashLightOn = !flashLightOn;
    timer.update();
    flashLightMoment = timer.getElapsed();
  };
  window.addEventListener("click", handleClick);
  onUnmount(() => {
    window.removeEventListener("click", handleClick);
  });

  const setSize = () => {
    if (window.innerWidth > 700) {
      renderer.setSize(window.innerWidth, window.innerHeight);

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    } else {
      const aspectRatio = 1.6 / 1;

      renderer.setSize(window.innerWidth, window.innerWidth / aspectRatio);

      camera.aspect = aspectRatio;
      camera.updateProjectionMatrix();
    }
  };
  setSize();
  window.addEventListener("resize", setSize);
  onUnmount(() => window.removeEventListener("resize", setSize));

  const animations = {
    flashlightFadeInLength: 0.1,
    flashLightFadeOutLength: 0.01,

    flickerAnimationLength: 1,
    flickerARepeat: 10,
    flickerBRepeat: 14,
  };

  const timer = new THREE.Timer();

  let requestAnimationFrameId: number | null = null;

  function tick() {
    timer.update();
    const elapsedTime = timer.getElapsed();

    const initialIntensityAnimation = Math.min(elapsedTime, 1) / 1;

    const flickerAGate =
      animations.flickerBRepeat - animations.flickerAnimationLength <
      elapsedTime % animations.flickerBRepeat
        ? 1
        : 0;
    const flickerBGate =
      animations.flickerARepeat - animations.flickerAnimationLength <
      elapsedTime % animations.flickerARepeat
        ? 1
        : 0;

    const frequencyA =
      ((Math.sin(elapsedTime * 35) + Math.sin(elapsedTime * 40)) / 2) *
      flickerAGate;
    pointLightA.intensity =
      ((frequencyA + 1) / 2.0) *
      intensity.pointLight *
      initialIntensityAnimation;

    const frequencyB =
      ((Math.sin(elapsedTime * 35) + Math.sin(elapsedTime * 30)) / 2) *
      flickerBGate;
    pointLightB.intensity =
      ((frequencyB + 1) / 2.0) *
      intensity.pointLight *
      initialIntensityAnimation;

    const normalizedPositionX = (mousePosition.x - 0.5) * 2;
    const normalizedPositionY = -(mousePosition.y - 0.5) * 2;

    const directionalLightMultiplier = 7;

    directionalLight.position.x +=
      (normalizedPositionX * directionalLightMultiplier -
        directionalLight.position.x) /
      options.easing;
    directionalLight.position.y +=
      (normalizedPositionY * directionalLightMultiplier -
        directionalLight.position.y) /
      options.easing;

    spotLight.position.x +=
      (normalizedPositionX * 7 - spotLight.position.x) / options.easing;
    spotLight.target.position.x +=
      (normalizedPositionX * 6.8 - spotLight.target.position.x) /
      options.easing;

    spotLight.position.y +=
      (normalizedPositionY * 5 - spotLight.position.y) / options.easing;
    spotLight.target.position.y +=
      (normalizedPositionY * 4.8 - spotLight.target.position.y) /
      options.easing;

    if (flashLightOn) {
      if (elapsedTime - flashLightMoment < animations.flashlightFadeInLength) {
        directionalLight.intensity =
          (elapsedTime - flashLightMoment) *
          (1 / animations.flashlightFadeInLength) *
          intensity.directionalLight;
        spotLight.intensity =
          (elapsedTime - flashLightMoment) *
          (1 / animations.flashlightFadeInLength) *
          intensity.stopLight;
      } else {
        directionalLight.intensity = intensity.directionalLight;
        spotLight.intensity = intensity.stopLight;
      }
    } else {
      if (elapsedTime - flashLightMoment < animations.flashLightFadeOutLength) {
        directionalLight.intensity =
          (1 -
            (elapsedTime - flashLightMoment) *
              (1 / animations.flashLightFadeOutLength)) *
          intensity.directionalLight;
        spotLight.intensity =
          (1 -
            (elapsedTime - flashLightMoment) *
              (1 / animations.flashLightFadeOutLength)) *
          intensity.stopLight;
      } else {
        directionalLight.intensity = 0;
        spotLight.intensity = 0;
      }
    }

    renderer.render(scene, camera);
    requestAnimationFrameId = requestAnimationFrame(tick);
  }

  onUnmount(() => {
    if (requestAnimationFrameId !== null) {
      cancelAnimationFrame(requestAnimationFrameId);
    }

    resourceTracker.disposeAll();
  });

  tick();
}
