import ResourceTracker from "@/utils/ResourceTracker";
import * as THREE from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

type LoadAssetsArgs = {
  onLoadingProgress: (progress: number) => void;
  resourceTracker: ResourceTracker;
};

export default async function loadAssets({
  resourceTracker,
  onLoadingProgress,
}: LoadAssetsArgs) {
  const loadingManager = new THREE.LoadingManager(
    () => {
      onLoadingProgress(1);
    },
    (_, loaded) => {
      onLoadingProgress(loaded / 3);
    },
  );
  const textureLoader = new THREE.TextureLoader(loadingManager);

  const track = resourceTracker.track.bind(resourceTracker);

  const textures = {
    velvet: {
      normal: track(
        await textureLoader.loadAsync(
          "/textures/orthogonal_hero/velour_velvet_1k/velour_velvet_nor_gl_1k.jpg",
        ),
      ),
      arm: track(
        await textureLoader.loadAsync(
          "/textures/orthogonal_hero/velour_velvet_1k/velour_velvet_arm_1k.jpg",
        ),
      ),
    },
  };

  const fontLoader = new FontLoader(loadingManager);
  const fonts = {
    hero: await fontLoader.loadAsync("/fonts/helvetiker_regular.typeface.json"),
  };

  return { textures, fonts };
}
