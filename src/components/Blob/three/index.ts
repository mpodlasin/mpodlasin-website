import setupScene from "./setupScene";
import loadAssets from "./loadAssets";
import * as THREE from "three";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import setupLights from "./setupLights";
import setupGui from "./setupGui";
import blobVertexShader from "../../../shaders/blob/vertex.glsl";
import blobFragmentShader from "../../../shaders/blob/fragment.glsl";
import { gsap } from "gsap";

export default async function blobThree(
  canvas: HTMLCanvasElement,
  onUnmount: (fn: () => void) => void,
  onLoadingProgress: (progress: number) => void,
) {
  const { scene, camera, renderer, gui, controls, resourceTracker } =
    await setupScene(canvas);

  const { environmentMap } = await loadAssets({
    onLoadingProgress,
    resourceTracker,
  });

  scene.environmentIntensity = 0.6;

  environmentMap.mapping = THREE.EquirectangularReflectionMapping;
  environmentMap.colorSpace = THREE.SRGBColorSpace;
  scene.environment = environmentMap;

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
        uShift: new THREE.Uniform(0.01),
        uFrequency: new THREE.Uniform(2),
        uAmplitude: new THREE.Uniform(0.15),
      },

      metalness: 0.99,
      roughness: 0.5,
    }),
  );
  scene.add(sphere);

  const { ambientLight, directionalLight } = setupLights({ resourceTracker });
  scene.add(ambientLight, directionalLight);

  directionalLight.intensity = 0.3;

  const functions = {
    triggerAnimation() {
      gsap.to(sphere.material.uniforms.uFrequency, {
        value: Math.random() * 5,
        duration: 1,
      });

      gsap.to(sphere.material.uniforms.uAmplitude, {
        value: Math.random(),
        duration: 1,
      });
    },
  };
  gui.add(functions, "triggerAnimation");
  setupGui({ gui, directionalLight, controls, sphere, scene });

  camera.position.z = 7;

  const setSize = () => {
    renderer.setSize(window.innerWidth / 2, window.innerHeight);

    camera.aspect = window.innerWidth / 2 / window.innerHeight;
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

    scene.environmentRotation.y = elapsedTime;

    sphere.material.uniforms.uTime.value = elapsedTime;
    sphere.rotation.y = elapsedTime * 0.1;

    // controls.update();
    renderer.render(scene, camera);
    requestAnimationFrameId = requestAnimationFrame(tick);
  }

  onUnmount(() => {
    if (requestAnimationFrameId !== null) {
      cancelAnimationFrame(requestAnimationFrameId);
    }
  });

  tick();

  return functions;
}
