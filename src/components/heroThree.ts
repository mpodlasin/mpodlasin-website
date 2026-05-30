import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { Font, FontLoader } from 'three/addons/loaders/FontLoader.js';
import GUI from 'lil-gui';

function setupScene(canvas: HTMLCanvasElement) {
    const gui = new GUI();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
    });

    return { scene, camera, renderer, controls, gui };
}

async function loadAssets() {
    const textureLoader = new THREE.TextureLoader();
    const texture = await textureLoader.loadAsync('textures/2.png')

    const fontLoader = new FontLoader();
    const font = await fontLoader.loadAsync('fonts/helvetiker_regular.typeface.json');

    return { texture, font }
}

function makeNameMesh(font: Font, materials: THREE.Material | THREE.Material[], curveSegments = 1) {
    const createLetterMesh = (letter: string, index: number) => {
        const geometry = new TextGeometry(letter, {
            font: font,
            size: 1,
            depth: 0.1,
            curveSegments,
        } );
        const material = Array.isArray(materials) ? materials[index] : materials
        const mesh = new THREE.Mesh( geometry, material );

        geometry.computeBoundingBox();

        const width = (geometry.boundingBox?.max.x ?? 0) - (geometry.boundingBox?.min.x ?? 0);

        return { geometry, mesh, material, width }
    };

    const letters = "MateuszPodlasin".split("").map(createLetterMesh);
    const firstNameLetters = letters.slice(0, "Mateusz".length)
    const lastNameLetters = letters.slice("Mateusz".length)

    const spaceInFirstName = 0.1;
    const firstNameWidth = firstNameLetters.reduce((sentenceWidth, { width, mesh }) => {
        mesh.position.x = sentenceWidth;

        return sentenceWidth + width + spaceInFirstName;
    }, 0);

    const lastNameLettersWidth = lastNameLetters.reduce((total, { width }) => {
        return total + width;
    }, 0)

    const spaceInLastName = (firstNameWidth - lastNameLettersWidth) / "Podlasin".split("").length
    
    lastNameLetters.reduce((sentenceWidth, { width, mesh }) => {
        mesh.position.x = sentenceWidth;

        return sentenceWidth + width + spaceInLastName;
    }, 0);

    const firstName = new THREE.Group();
    const lastName = new THREE.Group();

    firstName.add(...firstNameLetters.map(letter => letter.mesh))
    lastName.add(...lastNameLetters.map(letter => letter.mesh));

    return { firstName, lastName, firstNameLetters, lastNameLetters, letters };
}

export default async function heroThree(canvas: HTMLCanvasElement, setRequestAnimationFrameId: (id: number) => void) {
    const { scene, camera, renderer, controls, gui } = setupScene(canvas);

    const { texture, font } = await loadAssets();

    const wireframeMaterial = new THREE.MeshBasicMaterial({ wireframe: true, color: 'white', transparent: true, opacity: 0.1 })

    const { firstName: firstNameWireframe, lastName: lastNameWireframe, letters: lettersWireframe } = makeNameMesh(font, wireframeMaterial);

    const { firstName: firstNameVisible, lastName: lastNameVisible, letters: lettersVisible } = makeNameMesh(
        font, 
        "MateuszPodlasin".split("").map(() => new THREE.MeshMatcapMaterial({ matcap: texture, transparent: true, opacity: 0 })),
        8
    );

    scene.add(firstNameWireframe);
    scene.add(lastNameWireframe);

    scene.add(firstNameVisible);
    scene.add(lastNameVisible);

    firstNameWireframe.position.x = -2.5
    lastNameWireframe.position.x = -2.5;
    firstNameVisible.position.x = -2.5;
    lastNameVisible.position.x = -2.5;

    lastNameWireframe.position.y = -1.2;
    lastNameVisible.position.y = -1.2;

    camera.position.z = 5;

    renderer.setSize(window.innerWidth, window.innerHeight);

    const timer = new THREE.Timer();

    timer.connect(document);

    const animateLetters: { 
        materialVisible: THREE.Material, 
        visibleMesh: THREE.Mesh, 
        wireframeMesh: THREE.Mesh, 
        start: number 
    }[] = []

    const animations = {
        letterAppear() {
        const index = Math.floor(Math.random() * lettersVisible.length)

        animateLetters[index] = {
            visibleMesh: lettersVisible[index].mesh,
            wireframeMesh: lettersWireframe[index].mesh,
            materialVisible: lettersVisible[index].material,
            start: timer.getElapsed(),
        }
        }
    }

    gui.add(animations, 'letterAppear').name('letter appear');

    function tick() {
        timer.update();
        const elapsedTime = timer.getElapsed();

        animateLetters.forEach(animateLetter => {
            const envelope = Math.max(1 - (elapsedTime - animateLetter.start), 0);

            animateLetter.materialVisible.opacity = envelope
            animateLetter.wireframeMesh.position.x = (Math.random() - 0.5) * 0.5 * envelope + animateLetter.visibleMesh.position.x
            animateLetter.wireframeMesh.position.y = (Math.random() - 0.5) * 0.5 * envelope + animateLetter.visibleMesh.position.y
        });

        controls.update();
        renderer.render(scene, camera);
        setRequestAnimationFrameId(requestAnimationFrame(tick));
    }

    tick();
}