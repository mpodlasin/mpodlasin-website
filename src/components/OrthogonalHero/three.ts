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
        text: 'teal',
        cubes: 'deeppink',
    }

    gui.addColor(textureColors, 'text').onChange((color: string) => {
        name.material.color = new THREE.Color(color);
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

    const nameGeometry = new TextGeometry("Mateusz", {
            font: fonts.hero,
            size: 1,
	        depth: 0.2,
	        curveSegments: 12, 
            bevelEnabled: true,
            bevelSegments: 24,
            bevelSize: 0.03,
            bevelThickness: 0.05,
        });

    const surnameGeometry = new TextGeometry("Podlasin", {
            font: fonts.hero,
            size: 1,
	        depth: 0.2,
	        curveSegments: 12, 
            bevelEnabled: true,
            bevelSegments: 24,
            bevelSize: 0.03,
            bevelThickness: 0.05,
        });

    const nameGeometryMerged = BufferGeometryUtils.mergeVertices(nameGeometry, 0.0001);
    const surnameGeometryMerged = BufferGeometryUtils.mergeVertices(surnameGeometry, 0.0001);

    const textMaterial = new THREE.MeshStandardMaterial({ 
            color: 'teal',
            normalMap: textures.velvet.normal,
            aoMap: textures.velvet.arm,
            metalnessMap: textures.velvet.arm,
            roughnessMap: textures.velvet.arm,
        });

    const text = new THREE.Group();
    scene.add(text);

    const name = new THREE.Mesh(
        nameGeometryMerged,
        textMaterial,
    )
    name.position.y = 0.7;
    name.geometry.center();
    text.add(name);
    name.castShadow = true;
    name.receiveShadow = true;

    const surname = new THREE.Mesh(
        surnameGeometryMerged,
        textMaterial,
    )
    surname.geometry.center();
    text.add(surname);
    surname.position.y = - 0.7;
    surname.position.z = 0.5;
    surname.castShadow = true;
    surname.receiveShadow = true;

    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 'orange' });

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
    }

    setInterval(animations.createCube, 500);

    const gravity = { x: 0.0, y: -9.81, z: 0.0 };
    const world = new RAPIER.World(gravity);

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