//
// src/game/components/Overlay.ts
//

import { Container } from "pixi.js";

export class Overlay extends Container {
  constructor(x: number = 0, y: number = 0) {
    super();

    this.x = x;
    this.y = y;
  }
}
