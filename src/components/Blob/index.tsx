"use client";

import blobThree from "./three";
import ThreeJSCanvas from "../ThreeJSCanvas";

const Blob = () => {
  return <ThreeJSCanvas showLoader={false} threeJSFunction={blobThree} />;
};

export default Blob;
