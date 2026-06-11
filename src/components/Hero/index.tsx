'use client'

import { useEffect, useRef } from 'react';
import heroThree from './three';

const Hero = () => {
    const canvas = useRef(null);
    const requestAnimationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        if (!canvas.current) return;

        heroThree(canvas.current, id => requestAnimationFrameRef.current = id);

        return () => {
            if (requestAnimationFrameRef.current) {
                cancelAnimationFrame(requestAnimationFrameRef.current);
            }
        }
    }, []);

    return <canvas ref={canvas} />;
}

export default Hero;
