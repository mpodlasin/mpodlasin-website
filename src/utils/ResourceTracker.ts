import * as THREE from "three";

interface Disposable {
  dispose(): void;
}

export default class ResourceTracker {
  private resources: Set<Disposable>;
  constructor() {
    this.resources = new Set();
  }
  track<A extends Disposable>(resource: A): A {
    this.resources.add(resource);
    return resource;
  }
  untrack(resource: Disposable) {
    this.resources.delete(resource);
  }
  disposeAll() {
    for (const resource of this.resources) {
      resource.dispose();
      if (resource instanceof THREE.Object3D) {
        if (resource.parent) {
          resource.parent.remove(resource);
        }
      }
    }
    this.resources.clear();
  }
}
