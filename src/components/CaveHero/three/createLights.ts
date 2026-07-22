import ResourceTracker from "@/utils/ResourceTracker";
import * as THREE from "three";

type CreateLightsArguments = {
  lampA: THREE.Object3D;
  lampB: THREE.Object3D;
  resourceTracker: ResourceTracker;
};

export default function createLights({
  lampA,
  lampB,
  resourceTracker,
}: CreateLightsArguments) {
  const colors = {
    ambientLightColor: "#f2f9ff",
    directionalLightColor: "#c8d9ff",
    pointLightColor: "#ffffff",
    spotlightColor: "#ffffff",
  };

  const ambientLight = new THREE.AmbientLight(colors.ambientLightColor, 0);

  const intensity = {
    directionalLight: 0.2,
    stopLight: 25,
    pointLight: 6,
  };

  const directionalLight = new THREE.DirectionalLight(
    colors.directionalLightColor,
    intensity.directionalLight,
  );
  directionalLight.position.z = 4;
  directionalLight.position.y = 0;
  directionalLight.position.x = 0;

  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;

  const directionalLightHelper = new THREE.DirectionalLightHelper(
    directionalLight,
  );
  directionalLightHelper.visible = false;

  const pointLightA = new THREE.PointLight(
    colors.pointLightColor,
    intensity.pointLight,
  );
  pointLightA.castShadow = false;

  pointLightA.position.x = lampA.position.x;
  pointLightA.position.z = 0.5;

  const pointLightB = new THREE.PointLight(
    colors.pointLightColor,
    intensity.pointLight,
  );
  pointLightB.castShadow = false;

  pointLightB.position.x = lampB.position.x;
  pointLightB.position.z = 0.5;

  const spotLight = new THREE.SpotLight(
    colors.spotlightColor,
    intensity.stopLight,
  );
  spotLight.position.set(0, 0, 1.2);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024 * 2;
  spotLight.shadow.mapSize.height = 1024 * 2;
  spotLight.penumbra = 0.1;
  spotLight.angle = 1.2;

  resourceTracker.track(ambientLight);
  resourceTracker.track(directionalLight);
  resourceTracker.track(pointLightA);
  resourceTracker.track(pointLightB);
  resourceTracker.track(spotLight);

  return {
    ambientLight,
    directionalLight,
    pointLightA,
    pointLightB,
    spotLight,
    colors,
    intensity,
  };
}
