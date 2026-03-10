//
// src/components/Road.ts
//

import { Container, Sprite, Assets, TextStyle, Text } from "pixi.js";
import { Tween, Easing } from "@tweenjs/tween.js";

import { calculateMultiplier } from "../systems/score";

import { store } from "../store";

export class Road extends Container {
  private pathContainer!: Container;

  private coinBronzeContainer!: Container;
  private scoreText!: Text;

  private coinGoldSprite!: Sprite;
  private fencingSprite!: Sprite;

  private fencingCoords = { x: -4, y: -130 };
  private fencingOffsetX = 250;

  private scoreMultiplier: number = 0;

  constructor(id: number, x: number = 0, y: number = 0) {
    super();

    this.x = x;
    this.y = y;

    const texture = Assets.get("bgRoad");
    const sprite = new Sprite(texture);
    sprite.anchor.set(0, 0);

    this.addChild(sprite);

    this.addGameObjects();

    const multi = calculateMultiplier(id + 1);
    this.setScoreMult(multi);
  }

  private addGameObjects() {
    this.pathContainer = new Container();
    this.addChild(this.pathContainer);
    this.pathContainer.x = this.width / 2;
    this.pathContainer.y = store.chickenStartPoint.y;

    this.coinBronzeContainer = new Container();
    const coinBronzeTex = Assets.get("coinBronze");
    const coinBronzeSprite = new Sprite(coinBronzeTex);
    coinBronzeSprite.anchor.set(0.5, 0.5);
    this.coinBronzeContainer.addChild(coinBronzeSprite);
    const textStyle = new TextStyle({
      fontFamily: "Arial",
      fontSize: 34,
      fontWeight: "bold",
      fill: "#fff5de",
      stroke: {
        width: 4,
        color: "#a8742f",
      },
      dropShadow: {
        color: "#000000",
        angle: 90,
        distance: 2,
      },
    });
    this.scoreText = new Text({
      text: `${this.scoreMultiplier}x`,
      style: textStyle,
      y: -2,
      alpha: 0.7,
    });
    this.scoreText.anchor.set(0.5, 0.5);
    this.coinBronzeContainer.addChild(this.scoreText);
    this.pathContainer.addChild(this.coinBronzeContainer);

    const coinGoldTex = Assets.get("coinGold");
    this.coinGoldSprite = new Sprite(coinGoldTex);
    this.coinGoldSprite.anchor.set(0.5, 0.5);
    this.coinGoldSprite.scale.x = 0;
    this.coinGoldSprite.visible = false;
    this.pathContainer.addChild(this.coinGoldSprite);

    const fencingTex = Assets.get("fencing");
    this.fencingSprite = new Sprite(fencingTex);
    this.fencingSprite.anchor.set(0.5, 0.5);
    this.fencingSprite.x = this.fencingCoords.x;
    this.fencingSprite.y = this.fencingCoords.y - this.fencingOffsetX;
    this.fencingSprite.alpha = 0;
    this.fencingSprite.visible = false;
    this.pathContainer.addChild(this.fencingSprite);
  }

  public getPathPoint() {
    return {
      x: this.x + this.pathContainer.x,
      y: this.y + this.pathContainer.y,
    };
  }

  private hideCoinBronze() {
    new Tween(this.coinBronzeContainer.scale, store.tweenGroup)
      .to({ x: 0 }, 225)
      .easing(Easing.Linear.None)
      .onComplete(() => {
        this.coinBronzeContainer.visible = false;
      })
      .start();
  }

  private showCoinGold() {
    new Tween(this.coinGoldSprite.scale, store.tweenGroup)
      .to({ x: 1 }, 150)
      .easing(Easing.Linear.None)
      .onStart(() => {
        this.coinGoldSprite.visible = true;
      })
      .start();
  }

  private showFencing() {
    new Tween(this.fencingSprite, store.tweenGroup)
      .to({ alpha: 1 }, 175)
      .easing(Easing.Linear.None)
      .onStart(() => {
        this.fencingSprite.visible = true;
      })
      .start();

    //this.fencingSprite.y = this.pathContainer.toLocal({ x: 0, y: 0}).y; // recalc camera top coord relative to worldContainer
    new Tween(this.fencingSprite, store.tweenGroup)
      .to({ x: this.fencingCoords.x, y: this.fencingCoords.y }, 175)
      .easing(Easing.Quadratic.In)
      .onStart(() => {
        this.fencingSprite.visible = true;
      })
      .start();
  }

  public lightOnScore() {
    this.scoreText.alpha = 1;
  }

  private lightOffScore() {
    this.scoreText.alpha = 0.7;
  }

  public getScoreMulti() {
    return this.scoreMultiplier;
  }

  public setScoreMult(num: number) {
    this.scoreMultiplier = num;
    this.scoreText.text = `${this.scoreMultiplier}x`;
  }

  public chickenIn() {
    this.hideCoinBronze();
    //
    // Here logic for car
    // if else
    //
    this.showFencing();
  }

  public chickenOut() {
    this.lightOffScore();
    this.showCoinGold();
  }
}
