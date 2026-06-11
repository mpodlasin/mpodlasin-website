import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import GUI from 'lil-gui';

function setupScene(canvas: HTMLCanvasElement) {
    const gui = new GUI();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
    });

    gui.hide();

    return { scene, camera, renderer, gui };
}

async function loadAssets() {
    const textureLoader = new THREE.TextureLoader();

    const textures = {
        plane: {
            color: await textureLoader.loadAsync('textures/hero/moon_03_1k/moon_03_diff_1k.png'),
            normal: await textureLoader.loadAsync('textures/hero/moon_03_1k/moon_03_nor_gl_1k.png'),
            arm: await textureLoader.loadAsync('textures/hero/moon_03_1k/moon_03_arm_1k.png'),
        },
        text: {
            color: await textureLoader.loadAsync('textures/hero/moon_03_1k/moon_03_diff_1k.png'),
            normal: await textureLoader.loadAsync('textures/hero/moon_03_1k/moon_03_nor_gl_1k.png'),
            arm: await textureLoader.loadAsync('textures/hero/moon_03_1k/moon_03_arm_1k.png'),
        }
    }

    const fontLoader = new FontLoader();
    const fonts = {
        hero: await fontLoader.loadAsync('fonts/helvetiker_regular.typeface.json'),
    };

    return { textures, fonts }
}

export default async function heroThree(canvas: HTMLCanvasElement, setRequestAnimationFrameId: (id: number) => void) {
    const { scene, camera, renderer } = setupScene(canvas);

    const { textures, fonts } = await loadAssets();

    /* PLANE */

    textures.plane.color.colorSpace = THREE.SRGBColorSpace;

    textures.plane.color.repeat.set(2, 1)
    textures.plane.normal.repeat.set(2, 1)

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
        })
    )
    plane.receiveShadow = true;
    scene.add(plane);

    /* TEXT */

    textures.text.color.colorSpace = THREE.SRGBColorSpace;

    const textTextureRepeat = 0.2;
    textures.text.color.repeat.setScalar(textTextureRepeat);
    textures.text.normal.repeat.setScalar(textTextureRepeat);

    textures.text.color.wrapS = THREE.RepeatWrapping;
    textures.text.color.wrapT = THREE.RepeatWrapping;
    textures.text.normal.wrapS = THREE.RepeatWrapping;
    textures.text.normal.wrapT = THREE.RepeatWrapping;

    const text = new THREE.Group();
    scene.add(text);
    text.position.y = 0.5;

    const title = new THREE.Mesh(
        new TextGeometry("Mateusz\nPodlasin", {
            font: fonts.hero,
            size: 1,
	        depth: 0.2,
	        curveSegments: 12,
            bevelEnabled: true,
            bevelSegments: 24,
            bevelSize: 0.05,
            bevelThickness: 0.05,
        }),
        new THREE.MeshStandardMaterial({
            map: textures.text.color,
            normalMap: textures.text.normal,
            aoMap: textures.text.arm,
            roughnessMap: textures.text.arm,
            metalnessMap: textures.text.arm,
        })
    );
    title.geometry.center();
    title.castShadow = true;
    title.receiveShadow = true;
    text.add(title);

    const subtitle = new THREE.Mesh(
        new TextGeometry("React / TypeScript / Three.js", {
            font: fonts.hero,
            size: 0.29,
	        depth: 0.2,
	        curveSegments: 12,
            bevelEnabled: true,
            bevelSegments: 24,
            bevelSize: 0.01,
            bevelThickness: 0.01,
        }),
        new THREE.MeshStandardMaterial({
            map: textures.text.color,
            normalMap: textures.text.normal,
            aoMap: textures.text.arm,
            roughnessMap: textures.text.arm,
            metalnessMap: textures.text.arm,
        })
    );
    subtitle.geometry.center();
    subtitle.castShadow = true;
    subtitle.receiveShadow = true;
    subtitle.position.y = -1.9;
    text.add(subtitle);

    /* LIGHTS */

    const directionalLight = new THREE.DirectionalLight('white', 8);
    scene.add(directionalLight);
    directionalLight.position.z = 0.5;
    directionalLight.position.y = 0;
    directionalLight.position.x = 0;

    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024 * 2;
    directionalLight.shadow.mapSize.height = 1024 * 2;

    const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
    directionalLightHelper.visible = false;
    scene.add(directionalLightHelper);

    camera.position.z = 5;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    const mousePosition = {
        x: 0,
        y: 0,
    }
    window.addEventListener('mousemove', e => {
        mousePosition.x = e.clientX / window.innerWidth;
        mousePosition.y = e.clientY / window.innerHeight;
    });

    function tick() {
        const normalizedPositionX = (mousePosition.x - 0.5) * 2;
        const normalizedPositionY = (mousePosition.y - 0.5) * 2;


        directionalLight.position.x = normalizedPositionX * 7;
        directionalLight.position.y = - normalizedPositionY * 7;

        renderer.render(scene, camera);
        setRequestAnimationFrameId(requestAnimationFrame(tick));
    }

    tick();
}