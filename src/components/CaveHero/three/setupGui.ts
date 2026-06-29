import * as THREE from "three";
import setupScene from "./setupScene";
import createLights from "./createLights";

type SetupGuiArguments = {
  gui: Awaited<ReturnType<typeof setupScene>>["gui"];
  colors: ReturnType<typeof createLights>["colors"];
  ambientLight: THREE.AmbientLight;
  directionalLight: THREE.DirectionalLight;
  pointLightA: THREE.PointLight;
  pointLightB: THREE.PointLight;
  spotLight: THREE.SpotLight;
};

export default function setupGui({
  gui,
  colors,
  ambientLight,
  directionalLight,
  spotLight,
  pointLightA,
  pointLightB,
}: SetupGuiArguments) {
  const options = {
    easing: 10,
  };

  gui.add(options, "easing").min(1).max(100).step(0.1);

  const ambientLightFolder = gui.addFolder("Ambient Light");
  ambientLightFolder.add(ambientLight, "intensity").min(0).max(1).step(0.0001);
  ambientLightFolder
    .addColor(colors, "ambientLightColor")
    .name("color")
    .onChange((color: unknown) => {
      ambientLight.color = new THREE.Color(color as string);
    });

  const direcitonalLightFolder = gui.addFolder("Directional Light");
  direcitonalLightFolder
    .add(directionalLight, "intensity")
    .min(0)
    .max(10)
    .step(0.001);
  direcitonalLightFolder
    .add(directionalLight.position, "z")
    .min(0)
    .max(5)
    .step(0.001)
    .name("position - z");
  direcitonalLightFolder
    .addColor(colors, "directionalLightColor")
    .name("color")
    .onChange((color: unknown) => {
      directionalLight.color = new THREE.Color(color as string);
    });

  const pointLightFolderA = gui.addFolder("Point Light A");
  pointLightFolderA.add(pointLightA, "intensity").min(0).max(10).step(0.001);
  pointLightFolderA.add(pointLightA.position, "z").min(0).max(10).step(0.001);
  pointLightFolderA.add(pointLightA, "castShadow");

  const pointLightFolderB = gui.addFolder("Point Light B");
  pointLightFolderB.add(pointLightB, "intensity").min(0).max(10).step(0.001);
  pointLightFolderB.add(pointLightB.position, "z").min(0).max(10).step(0.001);
  pointLightFolderA.add(pointLightA, "castShadow");

  const spotLightFolder = gui.addFolder("Spot Light");
  spotLightFolder.add(spotLight, "intensity").min(0).max(100).step(0.001);
  spotLightFolder.add(spotLight.position, "x").min(-10).max(10).step(0.001);
  spotLightFolder.add(spotLight.position, "y").min(-10).max(10).step(0.001);
  spotLightFolder.add(spotLight.position, "z").min(0).max(10).step(0.001);
  spotLightFolder.add(spotLight, "penumbra").min(0).max(1).step(0.001);
  spotLightFolder
    .add(spotLight, "angle")
    .min(0)
    .max(Math.PI / 2)
    .step(0.001);

  spotLightFolder
    .add(spotLight.target.position, "x")
    .min(-10)
    .max(10)
    .step(0.001)
    .name("target - x");
  spotLightFolder
    .add(spotLight.target.position, "y")
    .min(-10)
    .max(10)
    .step(0.001)
    .name("target - y");
  spotLightFolder
    .add(spotLight.target.position, "z")
    .min(0)
    .max(10)
    .step(0.001)
    .name("target - z");

  return { options };
}
