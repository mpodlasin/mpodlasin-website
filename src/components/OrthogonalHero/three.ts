import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import GUI from 'lil-gui';
import { Collider, ColliderDesc, RigidBody } from '@dimforge/rapier3d';

async function setupScene(canvas: HTMLCanvasElement) {
    const gui = new GUI();
    const scene = new THREE.Scene();
    // const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 1000);

    const varrr = 300;
    const camera = new THREE.OrthographicCamera( 
        window.innerWidth / - varrr, 
        window.innerWidth / varrr, 
        window.innerHeight / varrr, 
        window.innerHeight / - varrr, 
        1, 
        1000 
    );

    const controls = new OrbitControls(camera, canvas);
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
    });

    // gui.hide();

    const RAPIER = await import('@dimforge/rapier3d');

    return { scene, camera, renderer, gui, controls, RAPIER };
}

async function loadAssets() {
    // const textureLoader = new THREE.TextureLoader();
    const textures = {}

    const fontLoader = new FontLoader();
    const fonts = {
        hero: await fontLoader.loadAsync('fonts/helvetiker_regular.typeface.json'),
    };

    // const gltfLoader = new GLTFLoader();
    const models = {}

    return { textures, fonts, models }
}

export default async function heroThree(canvas: HTMLCanvasElement, onUnmount: (fn: () => void) => void) {
    const { scene, camera, renderer, gui, controls, RAPIER } = await setupScene(canvas);

    const { textures, fonts, models } = await loadAssets();

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20),
        new THREE.MeshStandardMaterial({ color: 'yellow' })
    )
    plane.rotation.x = - Math.PI / 2;
    scene.add(plane);
    plane.receiveShadow = true;

    const textGeometry = new TextGeometry("Mateusz\nPodlasin", {
            font: fonts.hero,
            size: 1,
	        depth: 0.2,
	        curveSegments: 12, 
            bevelEnabled: true,
            bevelSegments: 24,
            bevelSize: 0.03,
            bevelThickness: 0.05,
        });

    const textGeometryMerged = BufferGeometryUtils.mergeVertices(textGeometry, 0.0001);

    const text = new THREE.Mesh(
        textGeometryMerged,
        new THREE.MeshStandardMaterial({ color: 'teal' })
    )
    text.geometry.center();
    // text.quaternion.x = Math.sin(- Math.PI / 8);
    // text.quaternion.w = Math.cos(- Math.PI / 8);
    scene.add(text);
    text.castShadow = true;
    text.receiveShadow = true;

    const directionalLight = new THREE.DirectionalLight('white', 8)
    directionalLight.position.z = 5;
    directionalLight.position.x = 5;
    directionalLight.position.y = 8;
    scene.add(directionalLight);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;

    
    camera.position.z = 10;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    const shapes: THREE.Mesh[] = [];
    const bodies: RigidBody[] = [];
    const colliders: Collider[] = [];

    const animations = {
        createCube() {
            const size = 0.1;

            const cube = new THREE.Mesh(
                new THREE.BoxGeometry(size, size, size),
                new THREE.MeshStandardMaterial({ color: 'deeppink' }),
            )
            cube.castShadow = true;
            scene.add(cube);
            shapes.push(cube);

            const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
                .setTranslation((Math.random() * 2 - 1) * 3, 5, 0);
            const rigidBody = world.createRigidBody(rigidBodyDesc);

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
    }

    gui.add(animations, 'createCube');

    setInterval(animations.createCube, 500);

    const gravity = { x: 0.0, y: -9.81, z: 0.0 };
    const world = new RAPIER.World(gravity);

    const groundColliderDesc = RAPIER.ColliderDesc.cuboid(10.0, 0.1, 10.0);
    world.createCollider(groundColliderDesc);


    const positions = text.geometry.attributes.position.array;
    const indices = text.geometry.index?.array ?? [];

    const colliderDesc = RAPIER.ColliderDesc.trimesh(
        new Float32Array(positions),
        new Uint32Array(indices),
        RAPIER.TriMeshFlags.FIX_INTERNAL_EDGES,
    );
    colliderDesc.setRotation(text.quaternion);
    world.createCollider(colliderDesc);

    const timer = new THREE.Timer();

    let requestAnimationFrameId: number | null = null;
    function tick() {
        timer.update();
        const elapsedTime = timer.getElapsed();

        world.step();

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

        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrameId = requestAnimationFrame(tick);
    }

    onUnmount(() => {
        if (requestAnimationFrameId !== null) {
            cancelAnimationFrame(requestAnimationFrameId);
        }
    })

    tick();
}