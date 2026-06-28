"use client";

import heroThree from "./three";
import ThreeJSCanvas from "../ThreeJSCanvas";

const OrthogonalHero = () => {
  return <ThreeJSCanvas threeJSFunction={heroThree} />;
};

export default OrthogonalHero;
