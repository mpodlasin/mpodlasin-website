import isMesh from "@/utils/isMesh";
import loadAssets from "./loadAssets";
import ResourceTracker from "@/utils/ResourceTracker";

type CreateLampsArguments = {
  models: Awaited<ReturnType<typeof loadAssets>>["models"];
  resourceTracker: ResourceTracker;
};

export default function createLamps({
  models,
  resourceTracker,
}: CreateLampsArguments) {
  const lampA = models.lamp.scene;
  lampA.scale.setScalar(6);
  lampA.position.x = -4.5;
  lampA.position.y = 0.2;
  lampA.traverse((child) => {
    child.castShadow = true;
    child.receiveShadow = true;
    if (isMesh(child)) {
      if (Array.isArray(child.material)) {
        child.material.forEach((material) => resourceTracker.track(material));
      } else {
        resourceTracker.track(child.material);
      }
      resourceTracker.track(child.geometry);
    }
  });

  const lampB = lampA.clone();
  lampB.scale.setScalar(6);
  lampB.position.x = 4.5;
  lampB.position.y = 0.2;
  lampB.traverse((child) => {
    child.castShadow = true;
    child.receiveShadow = true;
    if (isMesh(child)) {
      if (Array.isArray(child.material)) {
        child.material.forEach((material) => resourceTracker.track(material));
      } else {
        resourceTracker.track(child.material);
      }
      resourceTracker.track(child.geometry);
    }
  });

  return { lampA, lampB };
}
