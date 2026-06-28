import { Collider, RigidBody, World } from '@dimforge/rapier3d';
import * as THREE from 'three';

type CreateCubeArguments = {
    scene: THREE.Scene;
    surname: THREE.Mesh;
    world: World;
    RAPIER: typeof import('@dimforge/rapier3d')
}

export default function createCubeFactory({ world, scene, RAPIER, surname }: CreateCubeArguments) {
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 'orange' });

    const shapes: THREE.Mesh[] = [];
    const bodies: RigidBody[] = [];
    const colliders: Collider[] = [];

    async function createCube() {
        const size = 0.1;

        const cube = new THREE.Mesh(
            new THREE.BoxGeometry(size, size, size),
            cubeMaterial,
        )
        cube.castShadow = true;
        scene.add(cube);
        shapes.push(cube);

        const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation((Math.random() * 2 - 1) * 2.5, 5, Math.random() > 0.5 ? 0 : surname.position.z);
        const rigidBody = world.createRigidBody(rigidBodyDesc);
        rigidBody.enableCcd(true);

        const colliderDesc = RAPIER.ColliderDesc.cuboid(size / 2, size / 2, size / 2);
        const collider = world.createCollider(colliderDesc, rigidBody);
        colliders.push(collider);

        bodies.push(rigidBody);

        if (bodies.length > 100) {
            const body = bodies.shift()
            const shape = shapes.shift()
            const collider = colliders.shift();

            if (collider) {
                world.removeCollider(collider, false);
            }

            if (body) {
                world.removeRigidBody(body);
            }

            if (shape) {
                scene.remove(shape);
            }
        }
    }

    function updateCubes() {
        bodies.forEach((body, index) => {
            const position = body.translation();
            shapes[index].position.set(position.x, position.y, position.z);

            const rotation = body.rotation();

            shapes[index].quaternion.set(
                rotation.x,
                rotation.y,
                rotation.z,
                rotation.w
            )
        })
    }

    return {
        createCube,
        updateCubes,
        bodies,
        shapes,
        cubeMaterial,
    }
}