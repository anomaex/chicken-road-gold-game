//
// src/store.ts
//

import { Application, Container } from "pixi.js";
import { Group, Tween } from "@tweenjs/tween.js";
import { createMutable } from "solid-js/store";

import { Start } from "./game/components/Start";
import { Road } from "./game/components/Road";
import { Finish } from "./game/components/Finish";
import { Chicken } from "./game/components/Chicken";

class GameStore {
  public app!: Application;

  public worldContainer!: Container;
  public uiContainer!: Container;

  public screen = {
    width: 0,
    height: 0,
  };

  public level = {
    width: 720, // dynamic, change when level is build
    height: 1280,
    difficulty: {
      easy: 3, // 30 default
      medium: 25, // 25
      hard: 22, // 22
      hardcore: 18, // 18
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

  public input = {
    block: false,
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
    bet: 0,
    winScore: 0,
  });
}

export const store = new GameStore();
