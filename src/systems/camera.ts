//
// src/systems/camera.ts
//

import { Tween, Easing } from "@tweenjs/tween.js";

import { store } from "../store";

// ВОЗМОЖно в дальнейшем сделать что бы при переворачивание экрана с land to portrain zoom персонажа
// уменьшался или добавлялся, если понадобится то сделать для разных экранов, по типу если экран превышает
// весь наш logicHeight 1280 то делать zoom камеры на 1.
export function updateCamera() {
  const scale = store.camera.baseScale * store.camera.zoom;
  store.worldContainer.scale.set(scale);

  const sw = window.innerWidth;
  const sh = window.innerHeight;

  // 1. Считаем, где ДОЛЖЕН быть контейнер, чтобы centerX был в центре экрана
  const targetX = sw / 2 - store.camera.centerX * scale;
  const targetY = sh / 2 - store.camera.centerY * scale;

  // 2. Рамки уровня
  const minX = sw - store.level.width * scale;
  const minY = sh - store.level.height * scale;

  // 3. Жесткий Clamp
  const finalX = Math.max(minX, Math.min(0, targetX));
  const finalY = Math.max(minY, Math.min(0, targetY));

  // 4. Применяем позицию мгновенно
  store.worldContainer.x = finalX;
  store.worldContainer.y = finalY;

  // 5. ОБРАТНАЯ СИНХРОНИЗАЦИЯ (Секрет плавности)
  // Если мы уперлись в край, обновляем centerX, чтобы он соответствовал
  // РЕАЛЬНОМУ положению камеры на экране. Это убирает рывки.
  store.camera.centerX = (sw / 2 - store.worldContainer.x) / scale;
  store.camera.centerY = (sh / 2 - store.worldContainer.y) / scale;
}

export function moveCameraTo(x: number, y: number, duration: number = 800) {
  new Tween(store.camera, store.tweenGroup)
    .to({ centerX: x, centerY: y }, duration)
    .easing(Easing.Quadratic.Out)
    .start();
}
