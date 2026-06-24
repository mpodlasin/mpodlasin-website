import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

function setupScene(canvas: HTMLCanvasElement) {
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
    console.log(window.innerWidth / varrr);

    const controls = new OrbitControls(camera, canvas);
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
    });

    gui.hide();

    return { scene, camera, renderer, gui, controls };
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
    const { scene, camera, renderer, gui, controls } = setupScene(canvas);

    const { textures, fonts, models } = await loadAssets();

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10),
        new THREE.MeshStandardMaterial({ color: 'yellow' })
    )
    scene.add(plane);
    plane.receiveShadow = true;

    const text = new THREE.Mesh(
        new TextGeometry("Mateusz\nPodlasin", {
            font: fonts.hero,
            size: 1,
	        depth: 0.2,
	        curveSegments: 12,
            bevelEnabled: true,
            bevelSegments: 24,
            bevelSize: 0.03,
            bevelThickness: 0.05,
        }),
        new THREE.MeshStandardMaterial({ color: 'teal' })
    )
    text.geometry.center();
    text.rotation.z = Math.PI * 0.25;
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

    const timer = new THREE.Timer();

    let requestAnimationFrameId: number | null = null;

    function tick() {
        timer.update();
        const elapsedTime = timer.getElapsed();

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