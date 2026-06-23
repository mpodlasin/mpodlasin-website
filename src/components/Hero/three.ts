import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import GUI from 'lil-gui';

function setupScene(canvas: HTMLCanvasElement) {
    const gui = new GUI();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 1000);
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
            color: await textureLoader.loadAsync('textures/hero/rusty_metal_04_1k/rusty_metal_04_diff_1k.png'),
            normal: await textureLoader.loadAsync('textures/hero/rusty_metal_04_1k/rusty_metal_04_nor_gl_1k.png'),
            arm: await textureLoader.loadAsync('textures/hero/rusty_metal_04_1k/rusty_metal_04_arm_1k.png'),
        }
    }

    const fontLoader = new FontLoader();
    const fonts = {
        hero: await fontLoader.loadAsync('fonts/helvetiker_regular.typeface.json'),
    };

    const gltfLoader = new GLTFLoader();
    const models = {
        lamp: await gltfLoader.loadAsync('models/industrial_wall_lamp_1k.gltf/industrial_wall_lamp_1k.gltf')
    }

    return { textures, fonts, models }
}

export default async function heroThree(canvas: HTMLCanvasElement, setRequestAnimationFrameId: (id: number) => void) {
    const { scene, camera, renderer, gui } = setupScene(canvas);

    const { textures, fonts, models } = await loadAssets();

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
            bevelSize: 0.03,
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
    
    /* LAMPS */

    const lampA = models.lamp.scene;
    lampA.scale.setScalar(6);
    lampA.position.x = -4.5;
    lampA.position.y = 0.2;
    lampA.traverse(child => {
        child.castShadow = true;
    })
    scene.add(lampA);

    const lampB = lampA.clone();
    lampB.scale.setScalar(6);
    lampB.position.x = 4.5;
    lampB.position.y = 0.2;
    lampB.traverse(child => {
        child.castShadow = true;
        child.receiveShadow = true;
    })
    scene.add(lampB);

    /* LIGHTS */
    const colors = {
        ambientLightColor: '#f2f9ff',
        directionalLightColor: '#c8d9ff',
        pointLightColor: '#ffffff',
        spotlightColor: '#ffffff',
    };

    const ambientLight = new THREE.AmbientLight(colors.ambientLightColor, 0);
    scene.add(ambientLight);

    const intensity = {
        directionalLight: 0.2,
        stopLight: 25,
        pointLight: 6,
    }

    const directionalLight = new THREE.DirectionalLight(colors.directionalLightColor, intensity.directionalLight);
    scene.add(directionalLight);
    directionalLight.position.z = 4;
    directionalLight.position.y = 0;
    directionalLight.position.x = 0;

    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;

    const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
    directionalLightHelper.visible = false;
    scene.add(directionalLightHelper);

    const pointLightA = new THREE.PointLight(colors.pointLightColor, intensity.pointLight);
    scene.add(pointLightA);
    pointLightA.castShadow = false;

    pointLightA.position.x = lampA.position.x;
    pointLightA.position.z = 0.5;

    const pointLightB = new THREE.PointLight(colors.pointLightColor, intensity.pointLight);
    scene.add(pointLightB);
    pointLightB.castShadow = false;

    pointLightB.position.x = lampB.position.x;
    pointLightB.position.z = 0.5;

    const spotLight = new THREE.SpotLight(colors.spotlightColor, intensity.stopLight);
    spotLight.position.set(0, 0, 1.2);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024 * 2;
    spotLight.shadow.mapSize.height = 1024 * 2;
    spotLight.penumbra = 0.1
    spotLight.angle = 1.2;
    scene.add(spotLight);
    scene.add(spotLight.target);


    /* MISC */

    camera.position.z = 8;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    /* GUI */

    const options = {
        easing: 10,
    }

    gui.add(options, 'easing').min(1).max(100).step(0.1);

    const ambientLightFolder = gui.addFolder('Ambient Light');
    ambientLightFolder.add(ambientLight, 'intensity').min(0).max(1).step(0.0001);
    ambientLightFolder.addColor(colors, 'ambientLightColor').name('color').onChange((color: unknown) => {
        ambientLight.color = new THREE.Color(color as string);
    })

    const direcitonalLightFolder = gui.addFolder('Directional Light');
    direcitonalLightFolder.add(directionalLight, 'intensity').min(0).max(10).step(0.001);
    direcitonalLightFolder.add(directionalLight.position, 'z').min(0).max(5).step(0.001).name('position - z')
    direcitonalLightFolder.addColor(colors, 'directionalLightColor').name('color').onChange((color: unknown) => {
        directionalLight.color = new THREE.Color(color as string);
    });

    const pointLightFolderA = gui.addFolder('Point Light A');
    pointLightFolderA.add(pointLightA, 'intensity').min(0).max(10).step(0.001);
    pointLightFolderA.add(pointLightA.position, 'z').min(0).max(10).step(0.001);
    pointLightFolderA.add(pointLightA, 'castShadow');

    const pointLightFolderB = gui.addFolder('Point Light B');
    pointLightFolderB.add(pointLightB, 'intensity').min(0).max(10).step(0.001);
    pointLightFolderB.add(pointLightB.position, 'z').min(0).max(10).step(0.001);
    pointLightFolderA.add(pointLightA, 'castShadow');

    const spotLightFolder = gui.addFolder('Spot Light');
    spotLightFolder.add(spotLight, 'intensity').min(0).max(100).step(0.001);
    spotLightFolder.add(spotLight.position, 'x').min(-10).max(10).step(0.001);
    spotLightFolder.add(spotLight.position, 'y').min(-10).max(10).step(0.001);
    spotLightFolder.add(spotLight.position, 'z').min(0).max(10).step(0.001);
    spotLightFolder.add(spotLight, 'penumbra').min(0).max(1).step(0.001);
    spotLightFolder.add(spotLight, 'angle').min(0).max(Math.PI / 2).step(0.001);

    spotLightFolder.add(spotLight.target.position, 'x').min(-10).max(10).step(0.001).name('target - x');
    spotLightFolder.add(spotLight.target.position, 'y').min(-10).max(10).step(0.001).name('target - y');
    spotLightFolder.add(spotLight.target.position, 'z').min(0).max(10).step(0.001).name('target - z');

    /* MOUSE */

    const mousePosition = {
        x: 0,
        y: 0,
    }
    window.addEventListener('mousemove', e => {
        mousePosition.x = e.clientX / window.innerWidth;
        mousePosition.y = e.clientY / window.innerHeight;
    });

    let flashLightOn = false;
    let flashLightMoment = 0;
    window.addEventListener('click', () => {
        flashLightOn = !flashLightOn;
        timer.update();
        flashLightMoment = timer.getElapsed();
    });

    const animations = {
        flashlightFadeInLength: 0.1,
        flashLightFadeOutLength: 0.01,

        flickerAnimationLength: 1,
        flickerARepeat: 10,
        flickerBRepeat: 14,
    }

    const timer = new THREE.Timer();

    function tick() {
        timer.update();
        const elapsedTime = timer.getElapsed();

        const initialIntensityAnimation = Math.min(elapsedTime, 1) / 1;

        const flickerAGate = (animations.flickerBRepeat - animations.flickerAnimationLength) < elapsedTime % animations.flickerBRepeat ? 1 : 0;
        const flickerBGate = (animations.flickerARepeat - animations.flickerAnimationLength) < elapsedTime % animations.flickerARepeat ? 1 : 0;

        const frequencyA = (Math.sin(elapsedTime * 35) + Math.sin(elapsedTime * 40)) / 2 * flickerAGate;
        pointLightA.intensity = (frequencyA + 1) / 2.0 * intensity.pointLight * initialIntensityAnimation;

        const frequencyB = (Math.sin(elapsedTime * 35) + Math.sin(elapsedTime * 30)) / 2 * flickerBGate;
        pointLightB.intensity = (frequencyB + 1) / 2.0 * intensity.pointLight * initialIntensityAnimation;

        const normalizedPositionX = (mousePosition.x - 0.5) * 2;
        const normalizedPositionY = - (mousePosition.y - 0.5) * 2;

        const directionalLightMultiplier = 7;

        directionalLight.position.x += (normalizedPositionX * directionalLightMultiplier - directionalLight.position.x) / options.easing;
        directionalLight.position.y += (normalizedPositionY * directionalLightMultiplier - directionalLight.position.y) / options.easing;

        spotLight.position.x += (normalizedPositionX * 7 - spotLight.position.x) / options.easing
        spotLight.target.position.x += (normalizedPositionX * 6.8 - spotLight.target.position.x) / options.easing

        spotLight.position.y += (normalizedPositionY * 5 - spotLight.position.y) / options.easing
        spotLight.target.position.y += (normalizedPositionY * 4.8 - spotLight.target.position.y) / options.easing

        if (flashLightOn) {
            if (elapsedTime - flashLightMoment < animations.flashlightFadeInLength) {
                directionalLight.intensity = (elapsedTime - flashLightMoment) * (1 / animations.flashlightFadeInLength) * intensity.directionalLight;
                spotLight.intensity = (elapsedTime - flashLightMoment) * (1 / animations.flashlightFadeInLength) * intensity.stopLight;
            } else {
                directionalLight.intensity = intensity.directionalLight;
                spotLight.intensity = intensity.stopLight;
            }
        } else {
            if (elapsedTime - flashLightMoment < animations.flashLightFadeOutLength) {
                directionalLight.intensity = (1 - ((elapsedTime - flashLightMoment) * (1 / animations.flashLightFadeOutLength))) * intensity.directionalLight;
                spotLight.intensity = (1 - ((elapsedTime - flashLightMoment) * (1 / animations.flashLightFadeOutLength))) * intensity.stopLight;
            } else {
                directionalLight.intensity = 0;
                spotLight.intensity = 0;
            }
        }

        renderer.render(scene, camera);
        setRequestAnimationFrameId(requestAnimationFrame(tick));
    }

    tick();
}