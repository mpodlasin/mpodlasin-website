import GUI from "lil-gui";
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/Addons.js";

type SetupGuiArguments = {
    gui: GUI
    controls: OrbitControls;
    name: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>;
    cubeMaterial: THREE.MeshStandardMaterial;
    directionalLight: THREE.DirectionalLight;
}

export default function setupGui({ gui, name, cubeMaterial, directionalLight, controls }: SetupGuiArguments) {
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

    gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.0001).name('directional - x');
    gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.0001).name('directional - y');
    gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.0001).name('directional - z');

    gui.add(controls, 'enabled').name('controls enabled')
}