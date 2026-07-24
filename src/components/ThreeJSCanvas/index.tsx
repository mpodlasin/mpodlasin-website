"use client";

import { useEffect, useRef, useState } from "react";
import css from './index.module.css';

type CaveHeroProps<R> = {
  showLoader?: boolean;
  threeJSFunction: (
    canvas: HTMLCanvasElement,
    onUnmount: (fn: () => void) => void,
    onLoadedProgress: (progress: number) => void,
  ) => Promise<R>;
  onGetReturnValues?: (returnValues: R) => void;
};

function ThreeJSCanvas<R>({ threeJSFunction, onGetReturnValues, showLoader = true }: CaveHeroProps<R>) {
  const canvas = useRef(null);
  const handlers = useRef<(() => void)[]>([]);

  const [loadingProgress, setLoadingProgress] = useState(0);

  const addHandler = (handler: () => void) => {
    handlers.current.push(handler);
  };

  useEffect(() => {
    if (!canvas.current) return;

    threeJSFunction(canvas.current, addHandler, setLoadingProgress)
      .then(onGetReturnValues);

    const cleanupFunctions = handlers.current;
    return () => {
      cleanupFunctions.forEach((handler) => handler());
    };
  }, [threeJSFunction, onGetReturnValues]);

  return <div className={css.container}>
    <canvas style={{ position: "relative" }} ref={canvas} />
    {showLoader && <div className={css.mask} style={{opacity: loadingProgress < 1 ? 1 : 0}}>
      <div className={css.loadingBarWrapper}>
        <div className={css.loadingBar} style={{transform: `scaleX(${loadingProgress})`}} />
      </div>
    </div>}
    </div>;
};

export default ThreeJSCanvas;
