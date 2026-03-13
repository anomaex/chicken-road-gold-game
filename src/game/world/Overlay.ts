//
// src/game/components/Overlay.ts
//

import { Container, Sprite, Assets } from "pixi.js";
import { store } from "../../shared/store";

export class Overlay extends Container {
  constructor(x: number = 0, y: number = 0) {
    super();

    this.x = x;
    this.y = y;

    this.zIndex = 10;

    this.AddOverlayDecoration();
  }

  private AddOverlayDecoration() {
    new Sprite({
      texture: Assets.get("statuePhone"),
      x: store.bg.start.x + 25,
      y: 645,
      parent: this,
    });
  }
}
