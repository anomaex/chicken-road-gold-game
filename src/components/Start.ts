//
// src/components/Start.ts
//

import { Container, Sprite, Assets } from "pixi.js";

export class Start extends Container {
  constructor(x: number = 0, y: number = 0) {
    super();

    this.x = x;
    this.y = y;

    const texture = Assets.get("bgStart");
    const sprite = new Sprite(texture);
    sprite.anchor.set(0, 0);

    this.zIndex = 1;

    this.addChild(sprite);
  }
}
