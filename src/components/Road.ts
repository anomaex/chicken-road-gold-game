//
// src/components/Road.ts
//

import { Container, Sprite, Assets, TextStyle, Text } from "pixi.js";
import { Tween, Easing } from "@tweenjs/tween.js";

import { calculateMultiplier } from "../systems/score";
import { checkCollision } from "../systems/collision";

import { store } from "../store";

export class Road extends Container {
  private coinBronzeContainer!: Container;
  private scoreText!: Text;

  private coinGoldSprite!: Sprite;
  private fencingSprite!: Sprite;
  private fencingOffsetY: number = 130;

  private scoreMultiplier: number = 0;

  private activeCar: Sprite | null = null;
  private spawnCarTimer: number = 0;
  private nextSpawnCarTime: number = 1000;
  private carStop: boolean = false;
  private carSpeed: number = 8;

  constructor(id: number, x: number = 0) {
    super();

    this.x = x;

    new Sprite({
      texture: Assets.get("bgRoad"),
      anchor: {x: 0, y: 0},
      parent: this
    });

    this.scoreMultiplier = calculateMultiplier(id + 1);

    this.addObjects();

    this.nextSpawnCarTime = this.calcNexSpawnTime();
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
      anchor: {x: 0.5, y: 0.5}
    });

    // Bronze coin
    this.coinBronzeContainer = new Container({
      x: centerX,
      y: store.chickenStartPoint.y,
      parent: this,
      children: [
        new Sprite({
          texture: Assets.get("coinBronze"),
          anchor: {x: 0.5, y: 0.5},
          parent: this.coinBronzeContainer
        }),
        this.scoreText
      ]
    });

    // Gold coint
    this.coinGoldSprite = new Sprite({
      texture: Assets.get("coinGold"),
      anchor: {x: 0.5, y: 0.5},
      x: centerX,
      y: store.chickenStartPoint.y,
      scale: {x: 0, y: 1},
      visible: false,
      parent: this
    });

    // Fencing
    this.fencingSprite = new Sprite({
      texture: Assets.get("fencing"),
      anchor: {x: 0.5, y: 0.5},
      x: centerX,
      y: store.chickenStartPoint.y - (this.fencingOffsetY * 3),
      alpha: 0,
      visible: false,
      parent: this
    });
  }

  public getJumpPoint() {
    return {
      x: this.x + (this.width / 2),
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
  }

  public backlightScore(enable: boolean = false) {
    if (enable)
      this.scoreText.alpha = 1;
    else
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
    this.backlightScore(true);
    this.showCoinGold();
  }

  //#region Car
  private spawnCar() {
    this.removeActiveCar();

    const id = Math.floor(Math.random() * 4);

    this.activeCar = Sprite.from(`car_${id}`);
    this.activeCar.anchor.set(0.5, 1);

    this.activeCar.x = this.width / 2;
    this.activeCar.y =
      this.toLocal({ x: 0, y: 0 }).y  - 10;
    this.addChild(this.activeCar);
  }

  public updateCar(dt: number) {
    // If car is not present, calt the time for next spawn
    if (!this.activeCar) {
        this.spawnCarTimer += dt;
        if (this.spawnCarTimer >= this.nextSpawnCarTime) {
            this.spawnCar();
            this.spawnCarTimer = 0;
        }
        return;
    }

    const car = this.activeCar;

    // Check fencing for stop car upper fencing
    if (car.y < this.y) {
      if (this.fencingSprite.visible) {
        if (!this.carStop) {
          this.carStop = true;
        }
      }

    }

    if (this.carStop) {
      const distance = Math.abs(car.y - this.y);
      if (distance < 5)
        console.log("asdas");
      return;
    }

    car.y += this.carSpeed; // car speed, change if needed

    if (checkCollision(car)) {
        this.onChickenHit();
    }

    // If car is already run to out for world
    if (car.y > (store.level.height + this.activeCar.height + 10)) { 
      this.removeActiveCar();
      // После удаления задаем рандомную паузу до появления следующей машины
      this.nextSpawnCarTime = this.calcNexSpawnTime();
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

  private calcNexSpawnTime() {
    const time = 1000 + Math.random() * 2000; 
    return time;
  }
  //#endregion Car
}
