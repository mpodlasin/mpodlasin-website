'use client'

import { useEffect, useRef } from 'react';

type CaveHeroProps = {
    threeJSFunction: (canvas: HTMLCanvasElement, onUnmount: (fn: () => void) => void) => void;
}

const ThreeJSCanvas = ({ threeJSFunction }: CaveHeroProps) => {
    const canvas = useRef(null);
    const handlers = useRef<(() => void)[]>([]);

    const addHandler = (handler: () => void) => {
        handlers.current.push(handler);
    }

    useEffect(() => {
        if (!canvas.current) return;

        threeJSFunction(canvas.current, addHandler);

        const cleanupFunctions = handlers.current;
        return () => {
            console.log(cleanupFunctions.length);
            cleanupFunctions.forEach(handler => handler());
        }
    }, [threeJSFunction]);

    return <canvas style={{position: 'relative'}} ref={canvas} />;
}

export default ThreeJSCanvas;
