import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import GUI from 'lil-gui';
import { Collider, RigidBody } from '@dimforge/rapier3d';

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
    controls.enabled = false;
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
    });

    gui.hide();

    const RAPIER = await import('@dimforge/rapier3d');

    return { scene, camera, renderer, gui, controls, RAPIER };
}

async function loadAssets() {
    const textureLoader = new THREE.TextureLoader();

    const textures = {
        velvet: {
            normal: await textureLoader.loadAsync('/textures/orthogonal_hero/velour_velvet_1k/velour_velvet_nor_gl_1k.png'),
            color: await textureLoader.loadAsync('/textures/orthogonal_hero/velour_velvet_1k/velour_velvet_diff_1k.png'),
            arm: await textureLoader.loadAsync('/textures/orthogonal_hero/velour_velvet_1k/velour_velvet_arm_1k.png'), 
        }
    }

    const fontLoader = new FontLoader();
    const fonts = {
        hero: await fontLoader.loadAsync('fonts/helvetiker_regular.typeface.json'),
    };

    return { textures, fonts }
}

export default async function heroThree(canvas: HTMLCanvasElement, onUnmount: (fn: () => void) => void) {
    const { scene, camera, renderer, gui, controls, RAPIER } = await setupScene(canvas);

    const { textures, fonts } = await loadAssets();

    const textureColors = {
        plane: 'yellow',
        text: 'teal',
        cubes: 'deeppink',
    }

    gui.addColor(textureColors, 'plane').onChange((color: string) => {
        plane.material.color = new THREE.Color(color);
    });
    gui.addColor(textureColors, 'text').onChange((color: string) => {
        text.material.color = new THREE.Color(color);
    });
    gui.addColor(textureColors, 'cubes').onChange((color: string) => {
        cubeMaterial.color = new THREE.Color(color);
    });

    textures.velvet.color.colorSpace = THREE.SRGBColorSpace;
    const velvetRepeats = 0.5;
    textures.velvet.color.repeat.setScalar(velvetRepeats);
    textures.velvet.color.wrapS = THREE.RepeatWrapping;
    textures.velvet.color.wrapT = THREE.RepeatWrapping;

    textures.velvet.normal.repeat.setScalar(velvetRepeats);
    textures.velvet.normal.wrapS = THREE.RepeatWrapping;
    textures.velvet.normal.wrapT = THREE.RepeatWrapping;

    textures.velvet.arm.repeat.setScalar(velvetRepeats);
    textures.velvet.arm.wrapS = THREE.RepeatWrapping;
    textures.velvet.arm.wrapT = THREE.RepeatWrapping;

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20),
        new THREE.MeshStandardMaterial({
            color: 'yellow',
        })
    )
    plane.rotation.x = - Math.PI / 2;
    plane.position.y = 0.1;
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
        new THREE.MeshStandardMaterial({ 
            color: 'teal',
            // map: textures.velvet.color,
            normalMap: textures.velvet.normal,
            aoMap: textures.velvet.arm,
            metalnessMap: textures.velvet.arm,
            roughnessMap: textures.velvet.arm,
        })
    )
    text.geometry.center();
    // text.quaternion.x = Math.sin(- Math.PI / 8);
    // text.quaternion.w = Math.cos(- Math.PI / 8);
    scene.add(text);
    text.castShadow = true;
    text.receiveShadow = true;

    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 'deeppink' });

    const directionalLight = new THREE.DirectionalLight('white', 8)
    directionalLight.position.z = 5;
    directionalLight.position.x = 5;
    directionalLight.position.y = 8;
    scene.add(directionalLight);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;

    gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.0001).name('directional - x');
    gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.0001).name('directional - y');
    gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.0001).name('directional - z');

    gui.add(controls, 'enabled').name('controls enabled')
    
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
                cubeMaterial,
            )
            cube.castShadow = true;
            scene.add(cube);
            shapes.push(cube);

            const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
                .setTranslation((Math.random() * 2 - 1) * 3, 5, 0);
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
    }

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

    let scrollPosition = 0;

    window.addEventListener('scroll', () => {
        scrollPosition = window.scrollY / window.innerHeight;

        console.log(window.scrollY / window.innerHeight);

        if(scrollPosition < 2) {
            canvas.style.setProperty('top', `${window.scrollY}px`);
        }
    })

    let requestAnimationFrameId: number | null = null;
    function tick() {
        timer.update();
        const elapsedTime = timer.getElapsed()

        const scrollAnimation = Math.min(scrollPosition, 2);

        camera.position.x = - scrollAnimation * 3;
        camera.position.y = scrollAnimation * 2

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