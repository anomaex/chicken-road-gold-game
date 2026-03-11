//
// src/components/Road.ts
//

import { Container, Sprite, Assets, TextStyle, Text } from "pixi.js";
import { Tween, Easing } from "@tweenjs/tween.js";

import { calculateMultiplier } from "../systems/score";

import { store } from "../store";

export class Road extends Container {
  private coinBronzeContainer!: Container;
  private scoreText!: Text;

  private coinGoldSprite!: Sprite;
  private fencingSprite!: Sprite;
  private fencingOffsetY = 85;

  private scoreMulti = 0;

  public car: Sprite | null = null;
  private spawnCarTimer = 0;
  private nextSpawnCarTime = 0;
  private endMoveCarPointY!: number;
  public fencingStopPointY!: number;
  public isStopSpawnCar = false;

  constructor(id: number, x: number = 0) {
    super();

    this.x = x;

    new Sprite({
      texture: Assets.get("bgRoad"),
      anchor: { x: 0, y: 0 },
      parent: this,
    });

    this.scoreMulti = calculateMultiplier(id + 1);

    this.addObjects();
  }

  private addObjects() {
    const centerX = this.width / 2;

    // Multi score on bronze coin and in bronzeOntainer
    this.scoreText = new Text({
      style: new TextStyle({
        fontFamily: store.ui.fontStack,
        fontSize: 34,
        fontWeight: "bold",
        fill: store.ui.colors.primary,
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
      text: `${this.scoreMulti}x`,
      anchor: { x: 0.5, y: 0.5 },
    });

    // Bronze coin
    this.coinBronzeContainer = new Container({
      x: centerX,
      y: store.chicken.startPoint.y,
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
      y: store.chicken.startPoint.y,
      scale: { x: 0, y: 1 },
      visible: false,
      parent: this,
    });

    // Fencing
    this.fencingSprite = new Sprite({
      texture: Assets.get("fencing"),
      anchor: { x: 0.5, y: 1 },
      x: centerX,
      y: store.chicken.startPoint.y - this.fencingOffsetY * 5,
      alpha: 0,
      visible: false,
      parent: this,
      zIndex: 1,
    });
    this.fencingStopPointY = store.chicken.startPoint.y - this.fencingOffsetY - this.fencingSprite.height;
  }

  //#region Helpers
  public visibleCoinBronze(enable: boolean) {
    if (enable) {
      this.coinBronzeContainer.scale.set(1, 1);
      this.coinBronzeContainer.visible = true;
    } else {
      new Tween(this.coinBronzeContainer.scale, store.tweenGroup)
        .to({ x: 0 }, 225)
        .easing(Easing.Linear.None)
        .onComplete(() => {
          this.coinBronzeContainer.visible = false;
        })
        .start();
    }
  }

  public visibleCoinGold(enable: boolean) {
    if (enable) {
       setTimeout(() => {
        this.coinGoldSprite.visible = true;
        new Tween(this.coinGoldSprite.scale, store.tweenGroup)
          .to({ x: 1 }, 150)
          .easing(Easing.Linear.None)
          .start();
      }, 200);
    } else {
      this.coinGoldSprite.visible = false;
      this.coinGoldSprite.scale.set(1, 1);
    }
  }

  public getScoreMulti() {
    return this.scoreMulti;
  }

  public setBacklightScore(enable: boolean) {
    if (enable) this.scoreText.alpha = 1;
    else this.scoreText.alpha = 0.7;
  }

  public showFencing() {
    this.fencingSprite.visible = true;
    new Tween(this.fencingSprite, store.tweenGroup)
      .to({ alpha: 1 }, 100)
      .easing(Easing.Linear.None)
      .start();
    new Tween(this.fencingSprite, store.tweenGroup)
      .to({ y: store.chicken.startPoint.y - this.fencingOffsetY }, 100)
      .easing(Easing.Linear.None)
      .start();
  }
  //#endregion Helpers

  public update(dt: number) {
    if (this.car) {
      if (this.fencingSprite.visible) {
          if (this.car.y <= this.fencingStopPointY) {
            new Tween(this.car, store.tweenGroup)
              .to({ y: this.fencingStopPointY }, 200)
              .easing(Easing.Quadratic.Out) 
              .start();
            return;
        }
      }
      this.car.y += 3 * dt;
      this.endMoveCarPointY = store.level.height + this.car.height + 5;
      if (this.car.y > this.endMoveCarPointY) {
        this.removeCar();
      }
    } else {
      // If car is not present, calc the time for next spawn
      this.spawnCarTimer += dt;
      if (this.spawnCarTimer >= this.nextSpawnCarTime) {
        this.spawnCarTimer = 0;
        this.nextSpawnCarTime = this.calcNexSpawnCarTime();
        this.spawnCar();
      }
    }
  }

  //#region Car
  private spawnCar() {
    if (this.isStopSpawnCar) return;
    if (this.fencingSprite.visible) return;

    const id = Math.floor(Math.random() * 4); // 4 it's count of cars
    this.car = new Sprite({
      texture: Assets.get(`car_${id}`),
      anchor: { x: 0.5, y: 1 },
      x: this.width / 2,
      y: this.toLocal({ x: 0, y: 0 }).y - 5, // spawn car on top canvas/screen coords, NOT on top road coords
      parent: this,
    });
  }

  private calcNexSpawnCarTime() {
    const baseTime = 100;
    const rangeTime = baseTime + Math.random() * 500;
    const time = baseTime + Math.random() * rangeTime;
    return time;
  }

  private removeCar() {
    if (this.car) {
      this.car?.destroy();
      this.car = null;
    }
  }
  //#endregion Car
}
