//
// src/index.ts
//

import { Application, Container, Assets } from "pixi.js";

import { manifest } from "./assets/manifest";
import { store } from "./store";

import { Start } from "./components/Start";
import { Road } from "./components/Road";
import { Finish } from "./components/Finish";
import { Chicken } from "./components/Chicken";
import { Overlay } from "./components/Overlay";

import { initResizeHandler } from "./systems/resize";
import { updateCamera, moveCameraTo } from "./systems/camera";
import { initInput } from "./systems/input";

import "./styles/index.css";

function buildLevel() {
  const start = new Start();
  store.bg.start = start;
  store.worldContainer.addChild(start);

  let x = start.width - 10; // 10px it's some transparent in bg start image

  for (let i = 0; i < store.level.difficulty.easy; i++) {
    const road = new Road(i, x);
    store.bg.roads.push(road);
    store.worldContainer.addChild(road);
    x += road.width;
  }

  x -= 7; // last road marking

  const finish = new Finish(x);
  store.bg.finish = finish;
  store.worldContainer.addChild(finish);

  store.level.width = x + store.bg.finish.width;

  store.chicken = new Chicken();
  store.chicken.preJump();
  store.worldContainer.addChild(store.chicken);

  moveCameraTo(store.chicken.x, store.chicken.y, 0);

  store.worldContainer.addChild(new Overlay());
}

async function bootstrap() {
  store.app = new Application();
  await store.app.init({
    //resizeTo: window, // pixijs auto resize to window, upd: not needed, we auto resize every game tick
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });
  document.getElementById("pixi-container")!.appendChild(store.app.canvas);

  await Assets.init({ manifest: manifest });
  await Assets.loadBundle(["bg", "chicken", "road", "decoration"]); // pixijs load assets to self cache

  store.worldContainer = new Container();
  store.app.stage.addChild(store.worldContainer);

  store.uiContainer = new Container();
  store.app.stage.addChild(store.uiContainer);

  buildLevel();

  initResizeHandler();

  store.app.ticker.add(() => {
    updateCamera();
    store.tweenGroup.update();
  });

  initInput();
}

bootstrap().catch(console.error);
