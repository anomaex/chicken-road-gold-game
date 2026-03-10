//
// src/components/Finish.ts
//

import { Container, Sprite, Assets } from "pixi.js";
import { store } from "../store";

export class Finish extends Container {
  constructor(x: number = 0, y: number = 0) {
    super();

    this.x = x;
    this.y = y;

    const texture = Assets.get("bgFinish");
    const sprite = new Sprite(texture);
    sprite.anchor.set(0, 0);

    this.zIndex = 1;

    this.addChild(sprite);

    this.addDecoration();
  }

  public addDecoration() {
    const springBoardTex = Assets.get("springBoard");
    const springBoardSprite = new Sprite(springBoardTex);
    springBoardSprite.anchor.set(0, 0.5);
    springBoardSprite.position.set(0, 887);
    this.addChild(springBoardSprite);
  }

  public getFinishPathPoint() {
    const point = { x: 0, y: 0 };
    point.x = this.x + 150;
    point.y = store.chickenStartPoint.y - 64;
    return point;
  }

  public getGoldPathPoint() {
    const point = { x: 0, y: 0 };
    point.x = this.x + 315;
    point.y = store.chickenStartPoint.y + 20;
    return point;
  }
}
