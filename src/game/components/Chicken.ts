//
// src/game/components/Chicken.ts
//

import { Container, Sprite, Assets, TextStyle, Text } from "pixi.js";
import { Group } from "@tweenjs/tween.js";

import { store } from "../../store";
import { moveCameraTo, shakeCameraX } from "../systems/camera";
import {
  playJumpAudio,
  playRunOverAudio,
  playCarDriveAudio,
  playWinAudio,
  playCashoutAudio,
} from "../systems/audio";

export class Chicken extends Container {
  public startPoint = {
    // In worldContainer coords
    x: 218,
    y: 894,
    offsetY: 66, // for correct sprite position
  };

  private scoreContainer!: Container;

  public chickenStaticSprite: Sprite;
  private chickenRunOverSprite: Sprite;

  private scoreText!: Text;
  private scoreMulti = 1;

  private currentRoadIndex = -1;

  private jumpPositionX = 0;
  private isJump = false;

  private isCollisionHit = false;
  private isRunOver = false;

  private isFinish = false;

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
    if (this.isRunOver) return;
    if (this.isFinish) return;

    if (this.isJump) {
      if (this.x < this.jumpPositionX) {
        this.x += 1.15 * dt;
      }

      // Check collision
      this.checkCollision();

      if (this.x >= this.jumpPositionX) {
        this.isJump = false;

        this.x = this.jumpPositionX;

        if (this.isCollisionHit) {
          this.isRunOver = true;

          this.chickenStaticSprite.visible = false;
          this.chickenRunOverSprite.visible = true;

          playCarDriveAudio();
          playRunOverAudio();

          shakeCameraX(); // shake camera on collision hit

          // Emulating restart
          setTimeout(() => {
            this.restart();
          }, 1000);

          return;
        }

        this.currentRoadIndex += 1; // on road I jump

        const currentRoad = store.bg.roads[this.currentRoadIndex];
        this.scoreMulti = currentRoad.getScoreMulti();

        currentRoad.visibleFencing(true);

        const currentBetCount = store.state.bet * this.scoreMulti;
        store.state.currentBetCount = currentBetCount; // solidjs listen store.state.winBalance

        const nextRoadIndex = this.currentRoadIndex + 1; // need check what road next, after on road I jump
        if (nextRoadIndex > store.bg.roads.length - 1) {
          // Run finish event
          if (this.isFinish) return;
          this.isFinish = true;

          setTimeout(() => {
            playWinAudio();
          }, 200);

          currentRoad.visibleCoinGold(true);

          // SolidJS listen store.state.balance
          store.state.winBetCount = currentBetCount;
          store.state.balance += currentBetCount;

          // Emulating restart
          setTimeout(() => {
            this.restart();
          }, 3000);
        } else {
          const nextRoad = store.bg.roads[nextRoadIndex];
          if (nextRoad) nextRoad.setBacklightScore(true);
          this.visibleScore(true);
        }

        setTimeout(() => {
          store.state.inputBlock = false;
        }, 200);
      }
    }
  }

  //#region Jump
  public jump() {
    if (this.isRunOver) return;
    if (this.isFinish) return;

    // Block input when camera and chicken moving on next point
    if (store.state.inputBlock) return;
    store.state.inputBlock = true;

    if (this.isJump) return;
    this.isJump = true;

    const nextRoad = store.bg.roads[this.currentRoadIndex + 1];
    nextRoad.visibleCoinBronze(false);

    this.visibleScore(false);

    playJumpAudio();

    this.jumpPositionX = nextRoad.x + nextRoad.width / 2;
    moveCameraTo(this.jumpPositionX + this.width / 2, this.startPoint.y, 500);

    const currentRoad = store.bg.roads[this.currentRoadIndex];
    if (currentRoad) {
      currentRoad.visibleCoinGold(true);
    }
  }

  private checkCollision() {
    const currentRoad = store.bg.roads[this.currentRoadIndex + 1];
    if (!currentRoad.car) return;

    // First need to check points
    const upY = currentRoad.fencingStopPointY; // in worldContainer coords
    const downY = this.y; // in worldContainer coords

    const carFwdPointY = currentRoad.car.y; // matches in worldContainer coords
    const carCenterPointY = currentRoad.car.y - currentRoad.car.height / 2; // On high speed car need reduce 2 to 1.75 or 1.5 or 1.25
    //const carBackPointY = currentRoad.car.y - currentRoad.car.height;

    if (carFwdPointY >= upY && carFwdPointY <= downY) {
      currentRoad.isStopSpawnCar = true;
      this.isCollisionHit = true;
    }
    if (carCenterPointY >= upY && carCenterPointY <= downY) {
      currentRoad.isStopSpawnCar = true;
      this.isCollisionHit = true;
    }
    /*if (carBackPointY >= upY && carBackPointY <= downY) {
      currentRoad.isStopSpawnCar = true;
      this.isCollisionHit = true;
    }*/
  }
  //#endregion JUMP

  public cashout() {
    store.state.inputBlock = true;
    this.isFinish = true;

    playCashoutAudio();
    
    // SolidJS listen store.state.balance
    store.state.winBetCount = store.state.currentBetCount;
    store.state.balance += store.state.currentBetCount;

    setTimeout(() => {
      this.restart();
    }, 1000);
  }

  private restart() {
    store.tweenGroup.allStopped();
    store.tweenGroup.removeAll();
    store.tweenGroup = new Group();

    // Roads first
    store.bg.roads.forEach((e) => {
      e.restart();
    });

    this.x = this.startPoint.x;
    this.y = this.startPoint.y;

    this.chickenRunOverSprite.visible = false;
    this.chickenStaticSprite.visible = true;

    store.state.currentBetCount = 0;
    store.state.winBetCount = 0;
    store.state.bet = 1;

    this.scoreMulti = 1;

    this.currentRoadIndex = -1;

    moveCameraTo(this.startPoint.x, this.startPoint.y, 300);

    this.isCollisionHit = false;

    this.isFinish = false;

    this.isRunOver = false;

    store.state.inputBlock = false;

    store.state.isGameStarted = false;
  }
}
