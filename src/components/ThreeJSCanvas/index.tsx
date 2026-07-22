"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import css from './index.module.css';

type CaveHeroProps = {
  threeJSFunction: (
    canvas: HTMLCanvasElement,
    onUnmount: (fn: () => void) => void,
    onLoadedProgress: (progress: number) => void,
  ) => void;
};

const ThreeJSCanvas = ({ threeJSFunction }: CaveHeroProps) => {
  const canvas = useRef(null);
  const handlers = useRef<(() => void)[]>([]);

  const [loadingProgress, setLoadingProgress] = useState(0);

  const addHandler = (handler: () => void) => {
    handlers.current.push(handler);
  };

  useEffect(() => {
    if (!canvas.current) return;

    threeJSFunction(canvas.current, addHandler, setLoadingProgress);

    const cleanupFunctions = handlers.current;
    return () => {
      cleanupFunctions.forEach((handler) => handler());
    };
  }, [threeJSFunction]);

  return <div className={css.container}>
    <canvas style={{ position: "relative" }} ref={canvas} />
    <div className={css.mask} style={{opacity: loadingProgress < 1 ? 1 : 0}}>
      <div className={css.loadingBarWrapper}>
        <div className={css.loadingBar} style={{transform: `scaleX(${loadingProgress})`}} />
      </div>
    </div>
    </div>;
};

export default ThreeJSCanvas;
