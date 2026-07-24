"use client";

import blobThree from "./three";
import ThreeJSCanvas from "../ThreeJSCanvas";
import { atom, useSetAtom } from 'jotai';

export const triggerAnimationAtom = atom({
  triggerAnimation() {}
});

const Blob = () => {
  const setAtom = useSetAtom(triggerAnimationAtom);

  return <ThreeJSCanvas showLoader={false} threeJSFunction={blobThree} onGetReturnValues={setAtom} />;
};

export default Blob;
