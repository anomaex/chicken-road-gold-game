//
// src/game/world/LevelManager.ts
//

import { store } from "../../shared/store";

import { Start } from "./Start";
import { Road } from "./Road";
import { Finish } from "./Finish";
import { Chicken } from "../entites/Chicken";
import { Overlay } from "./Overlay";

import { moveCameraTo } from "../systems/camera";

export class LevelManager {
  public build() {
    const start = new Start();
    store.bg.start = start;
    store.worldContainer.addChild(start);

    store.chicken = new Chicken();
    store.worldContainer.addChild(store.chicken);

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

    moveCameraTo(store.chicken.startPoint.x, store.chicken.startPoint.y, 0);

    store.worldContainer.addChild(new Overlay()); // adds decoration forward layer
  }

  public rebuildRoads() {
    const difficultyIndex = store.state.difficulty;
    let roadCounts = 0;
    if (difficultyIndex == 0) roadCounts = store.level.difficulty.easy;
    else if (difficultyIndex == 1) roadCounts = store.level.difficulty.medium;
    else if (difficultyIndex == 2) roadCounts = store.level.difficulty.hard;
    else if (difficultyIndex == 3) roadCounts = store.level.difficulty.hardcore;

    const currentRoadCounts = store.bg.roads.length;

    let x = store.bg.start.width - 10;

    const countsToDelete = currentRoadCounts - roadCounts;
    if (countsToDelete > 0) {
      for (let i = 0; i < countsToDelete; i++) {
        const element = store.bg.roads[currentRoadCounts - 1 - i];
        element.destroy({ children: true });
      }
      store.bg.roads.length = store.bg.roads.length - countsToDelete;
    }

    for (let i = 0; i < roadCounts; i++) {
      if (i < currentRoadCounts) {
        const road = store.bg.roads[i];
        road.restart();
        x += road.width;
      } else {
        const road = new Road(i, x);
        store.bg.roads.push(road);
        store.worldContainer.addChild(road);
        x += road.width;
      }
    }

    x -= 7; // last road marking

    store.bg.finish.x = x;

    store.level.width = x + store.bg.finish.width;
  }
}
