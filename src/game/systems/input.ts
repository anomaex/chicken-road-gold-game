//
// src/game/systems/input.ts
//

import { FederatedPointerEvent } from "pixi.js";
import { store } from "../../store";

export function initInput() {
  const app = store.app;
  app.stage.eventMode = "static";
  app.stage.hitArea = app.screen; // hit area all screen

  //let startX = 0;
  //let startY = 0;
  //let startTime = 0;

  // Настройки чувствительности
  //const CLICK_THRESHOLD = 10; // Макс расстояние в пикселях для клика
  //const TIME_THRESHOLD = 250; // Макс время в мс для клика

  app.stage.on("pointerdown", (e: FederatedPointerEvent) => {
    if (e.button !== 0) return; // 0 - it's touch or right mouse click
    if (store.state.inputBlock) return;

    store.camera.isDragging = true;
    store.camera.lastPointerX = e.global.x;

    //startX = e.global.x;
    //startY = e.global.y;
    //startTime = Date.now();
  });

  app.stage.on("pointermove", (e: FederatedPointerEvent) => {
    if (store.state.inputBlock) return;
    if (!store.camera.isDragging) return;

    const deltaX = e.global.x - store.camera.lastPointerX;
    const scale = store.camera.baseScale * store.camera.zoom;

    // Если мы тянем мир вправо (deltaX > 0),
    // значит "точка фокуса" камеры едет ВЛЕВО по миру.
    store.camera.centerX -= deltaX / scale;

    store.camera.lastPointerX = e.global.x;
  });

  // Сlick recognition
  const endDrag = (/*e: FederatedPointerEvent*/) => {
    if (store.state.inputBlock) return;

    if (!store.camera.isDragging) return;

    /*
    const dist = Math.sqrt(
      Math.pow(e.global.x - startX, 2) + Math.pow(e.global.y - startY, 2),
    );

    const duration = Date.now() - startTime;

    // Check click or slide move
    if (dist < CLICK_THRESHOLD && duration < TIME_THRESHOLD) {
      store.chicken.jump();
    }*/

    store.camera.isDragging = false;
  };

  app.stage.on("pointerup", () => endDrag());
  app.stage.on("pointerupoutside", () => endDrag());
}
