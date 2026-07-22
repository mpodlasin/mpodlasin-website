import ResourceTracker from "@/utils/ResourceTracker";
import * as THREE from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

type LoadAssetsArgs = {
  resourceTracker: ResourceTracker;
  onLoadingProgress: (progress: number) => void;
};

export default async function loadAssets({
  onLoadingProgress,
  resourceTracker,
}: LoadAssetsArgs) {
  const loadingManager = new THREE.LoadingManager(
    () => {
      onLoadingProgress(1);
    },
    (_, loaded) => {
      onLoadingProgress(loaded / 17);
    },
  );

  const textureLoader = new THREE.TextureLoader(loadingManager);

  const track = resourceTracker.track.bind(resourceTracker);

  const textures = {
    plane: {
      color: track(
        await textureLoader.loadAsync(
          "/textures/cave_hero/moon_03_1k/moon_03_diff_1k.jpg",
        ),
      ),
      normal: track(
        await textureLoader.loadAsync(
          "/textures/cave_hero/moon_03_1k/moon_03_nor_gl_1k.jpg",
        ),
      ),
      arm: track(
        await textureLoader.loadAsync(
          "/textures/cave_hero/moon_03_1k/moon_03_arm_1k.jpg",
        ),
      ),
    },
    text: {
      color: track(
        await textureLoader.loadAsync(
          "/textures/cave_hero/rusty_metal_04_1k/rusty_metal_04_diff_1k.jpg",
        ),
      ),
      normal: track(
        await textureLoader.loadAsync(
          "/textures/cave_hero/rusty_metal_04_1k/rusty_metal_04_nor_gl_1k.jpg",
        ),
      ),
      arm: track(
        await textureLoader.loadAsync(
          "/textures/cave_hero/rusty_metal_04_1k/rusty_metal_04_arm_1k.jpg",
        ),
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
