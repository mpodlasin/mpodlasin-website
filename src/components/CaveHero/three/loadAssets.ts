import * as THREE from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export default async function loadAssets() {
  const textureLoader = new THREE.TextureLoader();

  const textures = {
    plane: {
      color: await textureLoader.loadAsync(
        "/textures/cave_hero/moon_03_1k/moon_03_diff_1k.png",
      ),
      normal: await textureLoader.loadAsync(
        "/textures/cave_hero/moon_03_1k/moon_03_nor_gl_1k.png",
      ),
      arm: await textureLoader.loadAsync(
        "/textures/cave_hero/moon_03_1k/moon_03_arm_1k.png",
      ),
    },
    text: {
      color: await textureLoader.loadAsync(
        "/textures/cave_hero/rusty_metal_04_1k/rusty_metal_04_diff_1k.png",
      ),
      normal: await textureLoader.loadAsync(
        "/textures/cave_hero/rusty_metal_04_1k/rusty_metal_04_nor_gl_1k.png",
      ),
      arm: await textureLoader.loadAsync(
        "/textures/cave_hero/rusty_metal_04_1k/rusty_metal_04_arm_1k.png",
      ),
    },
  };

  const fontLoader = new FontLoader();
  const fonts = {
    hero: await fontLoader.loadAsync("/fonts/helvetiker_regular.typeface.json"),
  };

  const gltfLoader = new GLTFLoader();
  const models = {
    lamp: await gltfLoader.loadAsync(
      "/models/industrial_wall_lamp_1k.gltf/industrial_wall_lamp_1k.gltf",
    ),
  };

  return { textures, fonts, models };
}
