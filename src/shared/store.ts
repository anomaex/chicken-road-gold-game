//
// src/shared/store.ts
//

import { Application, Container } from "pixi.js";
import { Group, Tween } from "@tweenjs/tween.js";
import { createMutable } from "solid-js/store";

import { Start } from "../game/world/Start";
import { Road } from "../game/world/Road";
import { Finish } from "../game/world/Finish";
import { Chicken } from "../game/entites/Chicken";
import { LevelManager } from "../game/world/LevelManager";

class GameStore {
  public app!: Application;

  public worldContainer!: Container;

  public levelManager!: LevelManager;

  public screen = {
    width: 0,
    height: 0,
  };

  public level = {
    width: 720, // dynamic, change when level is build
    height: 1280,
    difficulty: {
      easy: 8,
      medium: 13,
      hard: 18,
      hardcore: 23,
    },
  };

  public camera = {
    baseScale: 1,
    zoom: 1.4,
    centerX: 0,
    centerY: 0,
    // For input:
    isDragging: false,
    lastPointerX: 0,
    moveTween: null as unknown as Tween,
  };

  public chicken!: Chicken;

  public bg = {
    start: null as unknown as Start,
    roads: [] as Road[],
    finish: null as unknown as Finish,
  };

  public tweenGroup = new Group();

  public ui = {
    fontStack: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    colors: {
      primary: "#fff5e6",
      inActive: "#a8742f",
    },
  };

  public state = createMutable({
    isMuted: false,
    balance: 1000000,
    bet: 1,
    currentBetCount: 0,
    winBetCount: 0,
    difficulty: 0,
    isGameStarted: false,
    inputBlock: false,
  });
}

export const store = new GameStore();
