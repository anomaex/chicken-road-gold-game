//
// src/components/Road.ts
//

import { Container, Sprite, Assets, TextStyle, Text } from "pixi.js";
import { Tween, Easing } from "@tweenjs/tween.js";

import { calculateMultiplier } from "../systems/score";
import { checkCarToChickenCollision } from "../systems/collision";

import { store } from "../store";

export class Road extends Container {
  private coinBronzeContainer!: Container;
  private scoreText!: Text;

  private coinGoldSprite!: Sprite;
  private fencingSprite!: Sprite;
  private fencingOffsetY: number = 85;

  private scoreMultiplier: number = 0;

  private activeCar: Sprite | null = null;
  private spawnCarTimer: number = 0;
  private nextSpawnCarTime: number = 1000;
  private activeCarStopped: boolean = false;

  constructor(id: number, x: number = 0) {
    super();

    this.x = x;

    new Sprite({
      texture: Assets.get("bgRoad"),
      anchor: { x: 0, y: 0 },
      parent: this,
    });

    this.scoreMultiplier = calculateMultiplier(id + 1);

    this.addObjects();

    this.nextSpawnCarTime = this.calcNexSpawnTime(0);
  }

  private addObjects() {
    const centerX = this.width / 2;

    // Multi score on bronze coin and in bronzeOntainer
    this.scoreText = new Text({
      style: new TextStyle({
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
      }),
      y: -2,
      alpha: 0.7,
      text: `${this.scoreMultiplier}x`,
      anchor: { x: 0.5, y: 0.5 },
    });

    // Bronze coin
    this.coinBronzeContainer = new Container({
      x: centerX,
      y: store.chickenStartPoint.y,
      parent: this,
      children: [
        new Sprite({
          texture: Assets.get("coinBronze"),
          anchor: { x: 0.5, y: 0.5 },
          parent: this.coinBronzeContainer,
        }),
        this.scoreText,
      ],
    });

    // Gold coint
    this.coinGoldSprite = new Sprite({
      texture: Assets.get("coinGold"),
      anchor: { x: 0.5, y: 0.5 },
      x: centerX,
      y: store.chickenStartPoint.y,
      scale: { x: 0, y: 1 },
      visible: false,
      parent: this,
    });

    // Fencing
    this.fencingSprite = new Sprite({
      texture: Assets.get("fencing"),
      anchor: { x: 0.5, y: 1 },
      x: centerX,
      y: store.chickenStartPoint.y - this.fencingOffsetY * 5,
      alpha: 0,
      visible: false,
      parent: this,
      zIndex: 1
    });
  }

  public getJumpPoint() {
    return {
      x: this.x + this.width / 2,
      y: store.chickenStartPoint.y,
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
    // Need to check, if car under fencing position set timeout, show fencing after car moved
    let duration = 0;     
    if (this.activeCar) {
      const distance = Math.abs((store.chickenStartPoint.y - this.fencingOffsetY) - this.activeCar.y)
      if (distance < (this.activeCar.height / 2))
        duration = 200;
    }

    setTimeout(() => {
      new Tween(this.fencingSprite, store.tweenGroup)
        .to({ alpha: 1 }, 175)
        .easing(Easing.Linear.None)
        .onStart(() => {
          this.fencingSprite.visible = true;
        })
        .start();

      new Tween(this.fencingSprite, store.tweenGroup)
        .to({ y: store.chickenStartPoint.y - this.fencingOffsetY }, 175)
        .easing(Easing.Quadratic.In)
        .onStart(() => {
          this.fencingSprite.visible = true;
        })
        .start();
    }, duration);
  }

  public backlightScore(enable: boolean = false) {
    if (enable) this.scoreText.alpha = 1;
    else this.scoreText.alpha = 0.7;
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
    this.backlightScore(true);
    this.showCoinGold();
  }

  //#region Car
  private spawnCar() {
    this.removeActiveCar();

    if (this.fencingSprite.visible) return;

    const id = Math.floor(Math.random() * 4); // 4 it's count of cars

    const car = new Sprite({
      texture: Assets.get(`car_${id}`),
      anchor: {x: 0.5, y: 1},
      x: this.width / 2,
      y: this.toLocal({ x: 0, y: 0 }).y - 5,
      parent: this
    });
    this.activeCar = car;

    const pointY = store.level.height + this.activeCar.height + 5;

    // Base 500 + (scatter 1500) = range [500, 1500]
    const duration = 500 + (Math.random() * 1000);

    const carTween = new Tween(car, store.tweenGroup)
      .to({ y: pointY }, duration) // Drive to end road for ms
      .easing(Easing.Linear.None)
      .onUpdate(() => {
          this.checkCarFencing(carTween);
          if (checkCarToChickenCollision(car)) this.onChickenHit();
      })
      .onComplete(() => {
          this.removeActiveCar();
      })
      .start();
  }

  public updateCar(dt: number) {
    // If car is not present, calt the time for next spawn
    if (!this.activeCar) {
      this.spawnCarTimer += dt;
      if (this.spawnCarTimer >= this.nextSpawnCarTime) {
        this.spawnCarTimer = 0;
        this.nextSpawnCarTime = this.calcNexSpawnTime();
        this.spawnCar();
      }
    }
  }

  private checkCarFencing(carTween: Tween) {
    if (!this.activeCar) return;
    if (!this.fencingSprite.visible) return;
    if (this.activeCarStopped) return;

    const fencingCarStopPoint = store.chickenStartPoint.y - this.fencingOffsetY - this.fencingSprite.height;
    if (this.activeCar.y < fencingCarStopPoint) {
      this.activeCarStopped = true;
      carTween.stop();
      new Tween(this.activeCar, store.tweenGroup)
      .to({ y: fencingCarStopPoint }, 300)
      .easing(Easing.Linear.None)
      .onStart(() => {
          // проиграть музыку когда останавливается перед забором
      })
      .start();
    }
  }

  private onChickenHit() {
    console.log("HIT");
  }

  private removeActiveCar() {
    if (this.activeCar) {
      this.activeCar.destroy();
      this.activeCar = null;
    }
  }

  private calcNexSpawnTime(baseTime: number = 200) {
    // Base 200 + (scatter 1000) = range [200, 1200]
    const time = baseTime + Math.random() * 1000;
    return time;
  }
  //#endregion Car
}
