//
// src/components/Finish.ts
//

import { Container, Sprite, Assets } from "pixi.js";
import { store } from "../store";

export class Finish extends Container {
  constructor(x: number = 0) {
    super();

    this.x = x;

    new Sprite({
      texture: Assets.get("bgFinish"),
      anchor: {x: 0, y: 0},
      parent: this
    });

    this.zIndex = 1;

    this.addDecoration();
  }

  public addDecoration() {
    new Sprite({
      texture: Assets.get("springBoard"),
      anchor: {x: 0, y: 0.5},
      x: 0,
      y: 887,
      parent: this
    });
  }

  public getFinishPoint() {
    const point = { x: 0, y: 0 };
    point.x = this.x + 150;
    point.y = store.chickenStartPoint.y - 64;
    return point;
  }

  public getGoldPoint() {
    const point = { x: 0, y: 0 };
    point.x = this.x + 315;
    point.y = store.chickenStartPoint.y + 20;
    return point;
  }
}
