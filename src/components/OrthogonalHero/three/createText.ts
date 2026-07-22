import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import loadAssets from "./loadAssets";
import ResourceTracker from "@/utils/ResourceTracker";

type CreateTextArgs = {
  textures: Awaited<ReturnType<typeof loadAssets>>["textures"];
  fonts: Awaited<ReturnType<typeof loadAssets>>["fonts"];
  resourceTracker: ResourceTracker;
};

export default function createText({
  textures,
  fonts,
  resourceTracker,
}: CreateTextArgs) {
  const velvetRepeats = 0.5;
  textures.velvet.normal.repeat.setScalar(velvetRepeats);
  textures.velvet.normal.wrapS = THREE.RepeatWrapping;
  textures.velvet.normal.wrapT = THREE.RepeatWrapping;
  textures.velvet.arm.repeat.setScalar(velvetRepeats);
  textures.velvet.arm.wrapS = THREE.RepeatWrapping;
  textures.velvet.arm.wrapT = THREE.RepeatWrapping;

  const nameGeometry = new TextGeometry("Hello", {
    font: fonts.hero,
    size: 1,
    depth: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelSegments: 24,
    bevelSize: 0.03,
    bevelThickness: 0.05,
  });

  const surnameGeometry = new TextGeometry("World", {
    font: fonts.hero,
    size: 1,
    depth: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelSegments: 24,
    bevelSize: 0.03,
    bevelThickness: 0.05,
  });

  const nameGeometryMerged = BufferGeometryUtils.mergeVertices(
    nameGeometry,
    0.0001,
  );
  const surnameGeometryMerged = BufferGeometryUtils.mergeVertices(
    surnameGeometry,
    0.0001,
  );

  const textMaterial = new THREE.MeshStandardMaterial({
    color: "teal",
    normalMap: textures.velvet.normal,
    aoMap: textures.velvet.arm,
    metalnessMap: textures.velvet.arm,
    roughnessMap: textures.velvet.arm,
  });

  const text = new THREE.Group();

  const name = new THREE.Mesh(nameGeometryMerged, textMaterial);
  name.position.y = 0.7;
  name.geometry.center();
  text.add(name);
  name.castShadow = true;
  name.receiveShadow = true;

  const surname = new THREE.Mesh(surnameGeometryMerged, textMaterial);
  surname.geometry.center();
  text.add(surname);
  surname.position.y = -0.7;
  surname.position.z = 0.5;
  surname.castShadow = true;
  surname.receiveShadow = true;
  surname.geometry.computeBoundingBox();

  resourceTracker.track(textMaterial);
  resourceTracker.track(nameGeometry);
  resourceTracker.track(surnameGeometry);
  resourceTracker.track(nameGeometryMerged);
  resourceTracker.track(surnameGeometryMerged);

  return {
    text,
    name,
    surname,
  };
}
