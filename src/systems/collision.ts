//
// src/systems/collision.ts
//

import { Sprite } from "pixi.js";

export function checkCollision(chicken: Sprite | null, car: Sprite | null): boolean {
  if (!chicken) return false;
  if (!car) return false;

  const chickenBounds = chicken.getBounds();
  chickenBounds.width = chickenBounds.width * 0.5; // reduce collision zone for Chicken
  chickenBounds.height = chickenBounds.height * 0.5;

  const carBounds = car.getBounds();
  carBounds.width = carBounds.width * 0.7; // reduce collision zone for Car
  carBounds.height = carBounds.height * 0.7;

  return (
    carBounds.x < chickenBounds.x + chickenBounds.width &&
    carBounds.x + carBounds.width > chickenBounds.x &&
    carBounds.y < chickenBounds.y + chickenBounds.height &&
    carBounds.y + carBounds.height > chickenBounds.y
  );
}
