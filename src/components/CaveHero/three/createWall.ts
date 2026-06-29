import * as THREE from "three";
import loadAssets from "./loadAssets";

type CreateWallArguments = {
  textures: Awaited<ReturnType<typeof loadAssets>>["textures"];
};

export default function createWall({ textures }: CreateWallArguments) {
  textures.plane.color.colorSpace = THREE.SRGBColorSpace;

  textures.plane.color.repeat.set(2, 1);
  textures.plane.normal.repeat.set(2, 1);

  textures.plane.color.wrapS = THREE.RepeatWrapping;
  textures.plane.color.wrapT = THREE.RepeatWrapping;
  textures.plane.normal.wrapS = THREE.RepeatWrapping;
  textures.plane.normal.wrapT = THREE.RepeatWrapping;

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 8),
    new THREE.MeshStandardMaterial({
      map: textures.plane.color,
      normalMap: textures.plane.normal,
      aoMap: textures.plane.arm,
      roughnessMap: textures.plane.arm,
      metalnessMap: textures.plane.arm,
    }),
  );
  plane.receiveShadow = true;

  return { plane };
}
