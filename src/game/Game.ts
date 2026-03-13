//
// src/game/game.ts
//

import { Application, Container, Assets, Ticker } from "pixi.js";

import { manifest } from "./assets/manifest";
import { store } from "../shared/store";

import { initResizeHandler } from "./systems/resize";
import { updateCamera } from "./systems/camera";
import { initInput } from "./systems/input";
import { initAudio } from "./systems/audio";
import { LevelManager } from "./world/LevelManager";

export class Game {
  public async init (parentElement: HTMLElement) {
    const app = new Application();
    store.app = app;

    await app.init({
      resizeTo: window, // pixijs auto resize to window
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    parentElement.appendChild(app.canvas);

    store.worldContainer = new Container();
    store.app.stage.addChild(store.worldContainer);

    store.levelManager = new LevelManager();

    this.start();

    // Pixi DevTools
    if (import.meta.env.DEV) {
      globalThis.__PIXI_APP__ = app;
    }
  }

  private async start() {
    await this.loadAssets();

    store.levelManager.build();

    initResizeHandler();

    initInput();

    initAudio();

    store.app.ticker.add((ticker) => this.update(ticker));
  }

  private async loadAssets() {
    await Assets.init({ manifest: manifest });
    await Assets.loadBundle(["bg", "chicken", "road", "decorations", "audio"]); // pixijs load assets to self cache
  }

  private update(ticker: Ticker) {
    const delta = ticker.deltaMS;

    store.tweenGroup.update();

    store.bg.roads.forEach((road) => {
      road.update(delta); // first car move
    });

    store.chicken.update(delta); // second chicken move

    updateCamera();
  }
}
