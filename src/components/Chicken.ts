//
// src/components/Chicken.ts
//

import { Container, Sprite, Assets, TextStyle, Text } from "pixi.js";
import { Tween, Easing } from "@tweenjs/tween.js";

import { store } from "../store";
import { moveCameraTo } from "../systems/camera";

export class Chicken extends Container {
  private scoreContainer!: Container;

  private scoreText!: Text;

  private currentRoadIndex = -1;
  private nextRoadIndex = 0;

  private scoreMulti = 1;

  constructor() {
    super();

    this.x = store.chickenStartPoint.x;
    this.y = store.chickenStartPoint.y;

    new Sprite({
      texture: Assets.get("chickenStatic"),
      anchor: {x: 0.5, y: 0.6},
      parent: this
    });

    this.zIndex = 2;

    this.addScore();
  }

  private addScore() {
    this.scoreText = new Text({
      text: "0.0x",
      style: new TextStyle({
        fontFamily: "Arial",
        fontSize: 30,
        fontWeight: "bold",
        fill: "#ffffff",
        dropShadow: {
          color: "#000000",
          angle: 90,
          distance: 2,
        },
      }),
      y: 26,
      x: 4,
      anchor: {x: 0.5, y: 0}
    });
    this.scoreContainer = new Container({
      x: -10,
      y: 66,
      visible: false,
      children: [
        new Sprite({
          texture: Assets.get("chickenScore"),
          anchor: { x: 0.5, y: 0},
          parent: this.scoreContainer
        }),
        this.scoreText
      ],
      parent: this
    });
  }

  private visibleScore(show: boolean) {
    if (show) {
      this.scoreText.text = `${this.scoreMulti}x`;
      this.scoreContainer.visible = true;
    } else {
      this.scoreContainer.visible = false;
    }
  }

  //#region Jump
  public preJump() {
    // On start point
    if (
      (this.currentRoadIndex == -1 && this.nextRoadIndex == 0) ||
      (this.currentRoadIndex >= 0 &&
        this.nextRoadIndex <= store.bg.roads.length)
    ) {
      const nextRoad = store.bg.roads[this.nextRoadIndex];
      nextRoad.backlightScore(true); // turn on backlight on text score
    }
  }

  public jump() {
    store.input.block = true;

    //
    // Api server logic or else
    // if else
    //

    const currentRoad = store.bg.roads[this.currentRoadIndex];
    const nextRoad = store.bg.roads[this.nextRoadIndex];

    const jumpPoint = nextRoad.getJumpPoint();

    new Tween(this, store.tweenGroup)
      .to(jumpPoint, 350)
      .easing(Easing.Quadratic.Out)
      .onStart(() => {
        this.visibleScore(false);
        moveCameraTo(jumpPoint.x + 50, jumpPoint.y);
        nextRoad.chickenIn();
      })
      .onComplete(() => {
        // For skip start if -1
        if (this.currentRoadIndex > -1) {
          currentRoad.chickenOut();
        }

        // Get score from on current road
        this.scoreMulti = nextRoad.getScoreMulti();

        // Update to next jump road
        this.currentRoadIndex = this.nextRoadIndex;
        this.nextRoadIndex++;

        if (this.nextRoadIndex >= store.bg.roads.length) {
          nextRoad.chickenOut();
          this.moveToFinish();
        } else {
          this.visibleScore(true);
          this.preJump();
          store.input.block = false;
        }
      })
      .start();
  }
  //#endregion Jump

  //#region Finish
  private moveToFinish() {
    const point = store.bg.finish.getFinishPoint();

    new Tween(this, store.tweenGroup)
      .to(point, 350)
      .easing(Easing.Quadratic.Out)
      .onStart(() => {
        moveCameraTo(point.x, point.y);
      })
      .onComplete(() => {
        setTimeout(() => {
          this.jumpToGold();
        }, 300);
      })
      .start();
  }

  private jumpToGold() {
    const point = store.bg.finish.getGoldPoint();

    new Tween(this, store.tweenGroup)
      .to(point, 350)
      .easing(Easing.Quadratic.Out)
      .onStart(() => {
        moveCameraTo(point.x, point.y);
      })
      .onComplete(() => {})
      .start();
  }
  //#endregion Finish
}
