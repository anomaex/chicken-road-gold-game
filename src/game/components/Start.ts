//
// src/game/components/Start.ts
//

import { Container, Sprite, Assets } from "pixi.js";

export class Start extends Container {
  constructor() {
    super();

    new Sprite({
      texture: Assets.get("bgStart"),
      anchor: { x: 0, y: 0 },
      parent: this,
    });

    this.zIndex = 1;
  }
}
