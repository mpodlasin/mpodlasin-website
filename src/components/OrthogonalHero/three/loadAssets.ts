import * as THREE from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

export default async function loadAssets(
  onLoadingProgress: (progress: number) => void,
) {
  const loadingManager = new THREE.LoadingManager(
    () => {
      onLoadingProgress(1);
    },
    (_, loaded) => {
      onLoadingProgress(loaded / 3);
    },
  );
  const textureLoader = new THREE.TextureLoader(loadingManager);

  const textures = {
    velvet: {
      normal: await textureLoader.loadAsync(
        "/textures/orthogonal_hero/velour_velvet_1k/velour_velvet_nor_gl_1k.jpg",
      ),
      arm: await textureLoader.loadAsync(
        "/textures/orthogonal_hero/velour_velvet_1k/velour_velvet_arm_1k.jpg",
      ),
    },
  };

  const fontLoader = new FontLoader(loadingManager);
  const fonts = {
    hero: await fontLoader.loadAsync("/fonts/helvetiker_regular.typeface.json"),
  };

  return { textures, fonts };
}
