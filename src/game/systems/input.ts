//
// src/game/systems/input.ts
//

import { FederatedPointerEvent } from "pixi.js";
import { store } from "../../shared/store";

export function initInput() {
  const app = store.app;
  app.stage.eventMode = "static";
  app.stage.hitArea = app.screen; // hit area all screen

  let isPointerDown = false;
  let startX = 0;
  let startY = 0;
  let startTime = 0;

  // Настройки чувствительности
  const CLICK_THRESHOLD = 10; // Макс расстояние в пикселях для клика
  const TIME_THRESHOLD = 250; // Макс время в мс для клика

  const DRAG_THRESHOLD = 5;

  app.stage.on("pointerdown", (e: FederatedPointerEvent) => {
    if (e.button !== 0) return; // 0 - it's touch or right mouse click
    if (store.state.inputBlock) return;

    store.camera.isDragging = false;
    store.camera.lastPointerX = e.global.x;

    isPointerDown = true;
    startX = e.global.x;
    startY = e.global.y;
    startTime = Date.now();
  });

  app.stage.on("pointermove", (e: FederatedPointerEvent) => {
    if (store.state.inputBlock) return;
    if (!isPointerDown) return;

    if (!store.camera.isDragging) {
      const moveX = Math.abs(e.global.x - startX);
      const moveY = Math.abs(e.global.y - startY);

      // Если курсор сдвинулся дальше порога
      if (moveX > DRAG_THRESHOLD || moveY > DRAG_THRESHOLD) {
        store.camera.isDragging = true;
        store.camera.lastPointerX = e.global.x;
      }
    }

    if (store.camera.isDragging) {
      const deltaX = e.global.x - store.camera.lastPointerX;
      const scale = store.camera.baseScale * store.camera.zoom;

      store.camera.centerX -= deltaX / scale;
      store.camera.lastPointerX = e.global.x;
    }
  });

  // Сlick recognition
  const endDrag = (/*e: FederatedPointerEvent*/) => {
    if (store.state.inputBlock) return;
    if (!isPointerDown) return;
    isPointerDown = false;

    setTimeout(() => {
      store.camera.isDragging = false;
    }, 50);
  };

  app.stage.on("pointerup", () => endDrag());
  app.stage.on("pointerupoutside", () => endDrag());
}
