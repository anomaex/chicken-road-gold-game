//
// src/store.ts
//

import { Application, Container } from "pixi.js";
import { Group } from "@tweenjs/tween.js";

import { Start } from "./components/Start";
import { Road } from "./components/Road";
import { Finish } from "./components/Finish";
import { Chicken } from "./components/Chicken";

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
  };

  public input = {
    block: false,
  };

  public chickenStartPoint = {
    // in worldContainer coords
    x: 218,
    y: 894,
  };
  public chicken!: Chicken;

  public bg = {
    start: null as unknown as Start,
    roads: [] as Road[],
    finish: null as unknown as Finish,
  };

  public tweenGroup = new Group();
}

export const store = new GameStore();
