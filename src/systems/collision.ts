//
// src/systems/collision.ts
//

import { Sprite } from "pixi.js";

import { store } from "../store";

export function checkCarToChickenCollision(car: Sprite): boolean {
  if (!store.chicken) return false;

  const carBounds = car.getBounds();
  const chickenBounds = store.chicken.getBounds();

  const hitBoxPadding = 15; // padding for collision border, you can up or down for fair collision

  return (
    carBounds.x < chickenBounds.x + chickenBounds.width - hitBoxPadding &&
    carBounds.x + carBounds.width > chickenBounds.x + hitBoxPadding &&
    carBounds.y < chickenBounds.y + chickenBounds.height - hitBoxPadding &&
    carBounds.y + carBounds.height > chickenBounds.y + hitBoxPadding
  );
}
