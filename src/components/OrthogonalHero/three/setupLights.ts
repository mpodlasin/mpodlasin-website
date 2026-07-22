import ResourceTracker from "@/utils/ResourceTracker";
import * as THREE from "three";

type SetupLightsArgs = {
  resourceTracker: ResourceTracker;
};

export default function setupLights({ resourceTracker }: SetupLightsArgs) {
  const ambientLight = new THREE.AmbientLight("white", 0.2);

  const directionalLight = new THREE.DirectionalLight("white", 8);
  directionalLight.position.z = 5;
  directionalLight.position.x = 5;
  directionalLight.position.y = 8;
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;

  resourceTracker.track(ambientLight);
  resourceTracker.track(directionalLight);

  return { ambientLight, directionalLight };
}
