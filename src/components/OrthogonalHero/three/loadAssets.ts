import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

export default async function loadAssets() {
    const textureLoader = new THREE.TextureLoader();

    const textures = {
        velvet: {
            normal: await textureLoader.loadAsync('/textures/orthogonal_hero/velour_velvet_1k/velour_velvet_nor_gl_1k.png'),
            arm: await textureLoader.loadAsync('/textures/orthogonal_hero/velour_velvet_1k/velour_velvet_arm_1k.png'), 
        }
    }

    const fontLoader = new FontLoader();
    const fonts = {
        hero: await fontLoader.loadAsync('/fonts/helvetiker_regular.typeface.json'),
    };

    return { textures, fonts }
}