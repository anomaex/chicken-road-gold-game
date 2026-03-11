//
// src/components/Chicken.ts
//

import { Container, Sprite, Assets, TextStyle, Text } from "pixi.js";

import { store } from "../store";
import { moveCameraTo } from "../systems/camera";

export class Chicken extends Container {
  public startPoint = {
    // In worldContainer coords
    x: 218,
    y: 894,
    offsetY: 66 // for correct sprite position
  };

  private scoreContainer!: Container;

  public chickenStaticSprite: Sprite;
  private chickenRunOverSprite: Sprite;

  private scoreText!: Text;
  private scoreMulti = 1;

  private nextRoadIndex = 0;

  private jumpPositionX = 0;
  private isJump = false;

  public isRunOver = false;

  constructor() {
    super();

    this.x = this.startPoint.x;
    this.y = this.startPoint.y;

    this.jumpPositionX = this.startPoint.x;

    this.chickenStaticSprite = new Sprite({
      texture: Assets.get("chickenStatic"),
      anchor: { x: 0.5, y: 1 },
      y: this.startPoint.offsetY,
      parent: this,
    });

    this.chickenRunOverSprite = new Sprite({
      texture: Assets.get("chickenRunOver"),
      anchor: { x: 0.5, y: 1 },
      y: this.startPoint.offsetY,
      visible: false,
      parent: this,
    });

    this.zIndex = 2;

    this.addScore();
  }

  private addScore() {
    this.scoreText = new Text({
      text: "0.0x",
      style: new TextStyle({
        fontFamily: store.ui.fontStack,
        fontSize: 30,
        fontWeight: "bold",
        fill: store.ui.colors.primary,
        dropShadow: {
          color: "#000000",
          angle: 90,
          distance: 2,
        },
      }),
      y: 26,
      x: 4,
      anchor: { x: 0.5, y: 0 },
    });
    this.scoreContainer = new Container({
      x: -10,
      y: 66,
      visible: false,
      children: [
        new Sprite({
          texture: Assets.get("chickenScore"),
          anchor: { x: 0.5, y: 0 },
          parent: this.scoreContainer,
        }),
        this.scoreText,
      ],
      parent: this,
    });
  }

  //#region Helpers
  private visibleScore(enable: boolean) {
    if (!enable) {
      this.scoreContainer.visible = false;
    } else {
      this.scoreText.text = `${this.scoreMulti}x`;
      this.scoreContainer.visible = true;
    }
  }
  //#endregion Helpers

  public update(dt: number) {
    if (!this.isJump) return;

    const jumpSpeed = 1 * dt;
    const newPosX = this.x + jumpSpeed;

    const isHit = this.checkCollision();
    if (isHit)
      this.isRunOver = true;

    if (this.x >= this.jumpPositionX) {
      this.x = this.jumpPositionX;

      if (!this.isRunOver) {
        const currentRoad = store.bg.roads[this.nextRoadIndex];
        if (currentRoad)
          this.scoreMulti = currentRoad.getScoreMulti();
        this.visibleScore(true);

        this.nextRoadIndex++;

        const nextRoad = store.bg.roads[this.nextRoadIndex];
        if (nextRoad)
          nextRoad.setBacklightScore(true)

        currentRoad.showFencing();
      } else {
        this.chickenStaticSprite.visible = false;
        this.chickenRunOverSprite.visible = true;
      }

      this.isJump = false;
      store.input.block = false;

    } else {
      this.x = newPosX;
    }
  }

  //#region Jump
  public jump() {
    if (this.isRunOver) return;

    if (store.input.block) return;
    store.input.block = true;

    if (this.isJump) return;
    this.isJump = true;

    const nextRoad = store.bg.roads[this.nextRoadIndex];

    // HERE need to CHECK for WIN

    this.visibleScore(false);
    nextRoad.visibleCoinBronze(false);

    this.jumpPositionX = nextRoad.x + nextRoad.width / 2;
    moveCameraTo(this.jumpPositionX + (this.width / 2), this.startPoint.y, 500);

    const prevRoad = store.bg.roads[this.nextRoadIndex - 1];
    if (prevRoad) {
      prevRoad.visibleCoinGold(true);
    }
  }

  private checkCollision(): boolean {
    const currentRoad = store.bg.roads[this.nextRoadIndex];
    if (!currentRoad.car) return false;

    // First need to check points
    const upY = currentRoad.fencingStopPointY; // in worldContainer coords
    const downY = this.y; // in worldContainer coords

    const carFwdPointY = currentRoad.car.y // matches in worldContainer coords
    const carCenterPointY = currentRoad.car.y - currentRoad.car.height / 2; // On high speed car need reduce 2 to 1.75 or 1.5 or 1.25
    //const carBackPointY = currentRoad.car.y - currentRoad.car.height;

    if (carFwdPointY >= upY && carFwdPointY <= downY) {
      currentRoad.isStopSpawnCar = true;
      console.log("HIT to Forward");
      return true;
    }
    if (carCenterPointY >= upY && carCenterPointY <= downY) {
      currentRoad.isStopSpawnCar = true;
      console.log("HIT to Center");
      return true;
    }
    /*if (carBackPointY >= upY && carBackPointY <= downY) {
      console.log("HIT to back");
      currentRoad.carStopped = true;
      return true;
    }*/

    return false;
  }
  //#endregion JUMP
}
