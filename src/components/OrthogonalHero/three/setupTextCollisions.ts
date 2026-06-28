import { World } from '@dimforge/rapier3d';
import * as THREE from 'three';

type SetupCollisionArguments = {
    RAPIER: typeof import('@dimforge/rapier3d');
    world: World;
    name: THREE.Mesh;
    surname: THREE.Mesh;
}

export default function setupTextCollision({ RAPIER, name, surname, world }: SetupCollisionArguments) {
    const nameColliderDesc = RAPIER.ColliderDesc.trimesh(
        new Float32Array(name.geometry.attributes.position.array),
        new Uint32Array(name.geometry.index?.array ?? []),
        RAPIER.TriMeshFlags.FIX_INTERNAL_EDGES,
    );
    nameColliderDesc
        .setTranslation(name.position.x, name.position.y, name.position.z);
    world.createCollider(nameColliderDesc);

    const surnameColliderDesc = RAPIER.ColliderDesc.trimesh(
        new Float32Array(surname.geometry.attributes.position.array),
        new Uint32Array(surname.geometry.index?.array ?? []),
        RAPIER.TriMeshFlags.FIX_INTERNAL_EDGES,
    );
    surnameColliderDesc
        .setTranslation(surname.position.x, surname.position.y, surname.position.z);
    world.createCollider(surnameColliderDesc);
}