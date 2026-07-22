import * as THREE from "three";

export default function isMesh(object: unknown): object is THREE.Mesh {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (object as any).isMesh;
}
