//
// src/systems/resize.ts
//

import { store } from "../store";

function resize() {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const app = store.app;

  app.renderer.resize(screenWidth, screenHeight);

  // 1. Всегда делаем Fit Height (зум зависит от высоты экрана)
  const scale = screenHeight / store.level.height;
  store.camera.baseScale = scale;

  // 2. Применяем масштаб
  store.worldContainer.scale.set(scale);
  store.uiContainer.scale.set(scale); // UI масштабируется, но НЕ двигается камерой

  // 3. Обновляем данные экрана
  store.screen.width = screenWidth;
  store.screen.height = screenHeight;
}

export function initResizeHandler() {
  resize();
  window.addEventListener("resize", () => resize());
}
