import * as THREE from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export default async function loadAssets(
  onLoadingProgress: (progress: number) => void,
) {
  const loadingManager = new THREE.LoadingManager(
    () => {
      onLoadingProgress(1);
    },
    (_, loaded) => {
      onLoadingProgress(loaded / 17);
    },
  );

  const textureLoader = new THREE.TextureLoader(loadingManager);

  const textures = {
    plane: {
      color: await textureLoader.loadAsync(
        "/textures/cave_hero/moon_03_1k/moon_03_diff_1k.jpg",
      ),
      normal: await textureLoader.loadAsync(
        "/textures/cave_hero/moon_03_1k/moon_03_nor_gl_1k.jpg",
      ),
      arm: await textureLoader.loadAsync(
        "/textures/cave_hero/moon_03_1k/moon_03_arm_1k.jpg",
      ),
    },
    text: {
      color: await textureLoader.loadAsync(
        "/textures/cave_hero/rusty_metal_04_1k/rusty_metal_04_diff_1k.jpg",
      ),
      normal: await textureLoader.loadAsync(
        "/textures/cave_hero/rusty_metal_04_1k/rusty_metal_04_nor_gl_1k.jpg",
      ),
      arm: await textureLoader.loadAsync(
        "/textures/cave_hero/rusty_metal_04_1k/rusty_metal_04_arm_1k.jpg",
      ),
    },
  };

  const fontLoader = new FontLoader(loadingManager);
  const fonts = {
    hero: await fontLoader.loadAsync("/fonts/helvetiker_regular.typeface.json"),
  };

  const gltfLoader = new GLTFLoader(loadingManager);
  const models = {
    lamp: await gltfLoader.loadAsync(
      "/models/industrial_wall_lamp_1k.gltf/industrial_wall_lamp_1k.gltf",
    ),
  };

  return { textures, fonts, models };
}
