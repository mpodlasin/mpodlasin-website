import ResourceTracker from "@/utils/ResourceTracker";
import * as THREE from "three";
import { HDRLoader } from "three/addons/loaders/HDRLoader.js";

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

  const track = resourceTracker.track.bind(resourceTracker);

  const hdrLoader = new HDRLoader(loadingManager);
  const environmentMap = track(
    await hdrLoader.loadAsync("/textures/blob/blender-2k-2.hdr"),
  );
  return { environmentMap };
}
