//
// src/score.ts
//

export function calculateMultiplier(jump: number): number {
  if (jump <= 0) return 1;

  // Константы для настройки "крутизны" графика
  const startStep = 0.01;
  const acceleration = 1.157;

  // Основная формула
  // При n = 1: 1 + (0.01 * 1 * 1.157^0) = 1 + 0.01 = 1.01
  const multiplier = 1 + startStep * jump * Math.pow(acceleration, jump - 1);

  // Округляем до 2 знаков для красоты
  return Math.round(multiplier * 100) / 100;
}
