import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import loadAssets from "./loadAssets";

type CreateTextArguments = {
  textures: Awaited<ReturnType<typeof loadAssets>>["textures"];
  fonts: Awaited<ReturnType<typeof loadAssets>>["fonts"];
};

export default function createText({ textures, fonts }: CreateTextArguments) {
  textures.text.color.colorSpace = THREE.SRGBColorSpace;

  const textTextureRepeat = 0.2;
  textures.text.color.repeat.setScalar(textTextureRepeat);
  textures.text.normal.repeat.setScalar(textTextureRepeat);

  textures.text.color.wrapS = THREE.RepeatWrapping;
  textures.text.color.wrapT = THREE.RepeatWrapping;
  textures.text.normal.wrapS = THREE.RepeatWrapping;
  textures.text.normal.wrapT = THREE.RepeatWrapping;

  const text = new THREE.Group();

  const title = new THREE.Mesh(
    new TextGeometry("React\nTypeScript\nThree.js", {
      font: fonts.hero,
      size: 0.7,
      depth: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelSegments: 24,
      bevelSize: 0.03,
      bevelThickness: 0.05,
    }),
    new THREE.MeshStandardMaterial({
      map: textures.text.color,
      normalMap: textures.text.normal,
      aoMap: textures.text.arm,
      roughnessMap: textures.text.arm,
      metalnessMap: textures.text.arm,
    }),
  );
  title.geometry.center();
  title.castShadow = true;
  title.receiveShadow = true;
  text.add(title);

  return { text };
}
