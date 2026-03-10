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

    const texture = Assets.get("chickenStatic");
    const sprite = new Sprite(texture);
    sprite.anchor.set(0.5, 0.6);

    this.zIndex = 2;

    this.addChild(sprite);

    this.addScore();
  }

  private addScore() {
    this.scoreContainer = new Container();
    this.scoreContainer.visible = false;

    this.scoreContainer.x = -10;
    this.scoreContainer.y = 66;

    const scoreTex = Assets.get("chickenScore");
    const scoreSprite = new Sprite(scoreTex);
    scoreSprite.anchor.set(0.5, 0);
    this.scoreContainer.addChild(scoreSprite);

    const textStyle = new TextStyle({
      fontFamily: "Arial",
      fontSize: 30,
      fontWeight: "bold",
      fill: "#ffffff",
      dropShadow: {
        color: "#000000",
        angle: 90,
        distance: 2,
      },
    });
    this.scoreText = new Text({
      text: "0.0x",
      style: textStyle,
      y: 26,
      x: 4,
    });
    this.scoreText.anchor.set(0.5, 0);
    this.scoreContainer.addChild(this.scoreText);

    this.addChild(this.scoreContainer);
  }

  private showScore() {
    this.scoreText.text = `${this.scoreMulti}x`;
    this.scoreContainer.visible = true;
  }

  private hideScore() {
    this.scoreContainer.visible = false;
  }

  //#region Jump
  public preJump() {
    // On start point
    if ((this.currentRoadIndex == -1 && this.nextRoadIndex == 0) 
      || (this.currentRoadIndex >= 0 && this.nextRoadIndex <= store.bg.roads.length)) {
      const nextRoad = store.bg.roads[this.nextRoadIndex];
      nextRoad.lightOnScore(); // turn on light on text score
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

    const pathPoint = nextRoad.getPathPoint()

    new Tween(this, store.tweenGroup)
      .to(pathPoint, 350)
      .easing(Easing.Quadratic.Out)
      .onStart(() => {

        this.hideScore();
        moveCameraTo(pathPoint.x + 50, pathPoint.y);
        nextRoad.chickenIn();
        
      })
      .onComplete(() => {

        // For skip start if -1
        if (this.currentRoadIndex > -1)  {
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

          this.showScore()
          this.preJump()
          store.input.block = false;
        }

      })
      .start();
  }
  //#endregion Jump
  
  //#region Finish
  private moveToFinish() {
    const point = store.bg.finish.getFinishPathPoint();

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
    const point = store.bg.finish.getGoldPathPoint();

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
