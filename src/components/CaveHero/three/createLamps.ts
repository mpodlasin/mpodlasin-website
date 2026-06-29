import loadAssets from "./loadAssets";

type CreateLampsArguments = {
  models: Awaited<ReturnType<typeof loadAssets>>["models"];
};

export default function createLamps({ models }: CreateLampsArguments) {
  const lampA = models.lamp.scene;
  lampA.scale.setScalar(6);
  lampA.position.x = -4.5;
  lampA.position.y = 0.2;
  lampA.traverse((child) => {
    child.castShadow = true;
  });

  const lampB = lampA.clone();
  lampB.scale.setScalar(6);
  lampB.position.x = 4.5;
  lampB.position.y = 0.2;
  lampB.traverse((child) => {
    child.castShadow = true;
    child.receiveShadow = true;
  });

  return { lampA, lampB };
}
