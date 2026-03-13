//
// src/game/systems/resize.ts
//

import { Container, Sprite } from "pixi.js";
import { store } from "../../store";

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

  // 3. Обновляем данные экрана
  store.screen.width = screenWidth;
  store.screen.height = screenHeight;
}

export function initResizeHandler() {
  resize();
  window.addEventListener("resize", () => resize());
}

export function resizeSpriteToWinCenter(sprite: Sprite, container: Container) {
  const screenWidth = store.app.screen.width;
  const screenHeight = store.app.screen.height;

  const imgWidth = sprite.texture.width;
  const imgHeight = sprite.texture.height;

  const scaleX = (screenWidth * 0.75) / imgWidth;
  const scaleY = (screenHeight * 0.75) / imgHeight;

  //const finalScale = Math.max(scaleX, scaleY); // one side is full another crop
  const finalScale = Math.min(scaleX, scaleY); // full size inside
  container.scale.set(finalScale);
  //sprite.scale.set(finalScale);
  sprite.parent?.position.set(screenWidth / 2, screenHeight / 2);
  //sprite.position.set(screenWidth / 2, screenHeight / 2);
}
