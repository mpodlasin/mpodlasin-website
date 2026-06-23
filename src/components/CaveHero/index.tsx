'use client'

import heroThree from './three';
import ThreeJSCanvas from '../ThreeJSCanvas';

const CaveHero = () => {
    return <ThreeJSCanvas threeJSFunction={heroThree} />
}

export default CaveHero;
