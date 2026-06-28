import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

export default async function setupScene(canvas: HTMLCanvasElement) {
    const gui = new GUI();
    const scene = new THREE.Scene();

    const ratio = 300;
    const camera = new THREE.OrthographicCamera( 
        window.innerWidth / - ratio, 
        window.innerWidth / ratio, 
        window.innerHeight / ratio, 
        window.innerHeight / - ratio, 
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

    const gravity = { x: 0.0, y: -9.81, z: 0.0 };
    const world = new RAPIER.World(gravity);

    return { scene, camera, renderer, gui, controls, RAPIER, world };
}
