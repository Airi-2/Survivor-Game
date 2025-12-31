import { GAME_LOOP } from "../config/constants.js";

/**
 * GameLoop с Fixed Timestep + Accumulator + Alpha Interpolation
 *
 * Как это работает:
 * 1. FIXED_TIMESTEP (1/60 сек) - физика и логика обновляются с фиксированной частотой
 * 2. ACCUMULATOR - накапливает реальное время между кадрами
 * 3. ALPHA INTERPOLATION - плавно интерполирует положение между кадрами
 */
export class GameLoop {
  constructor(update, render) {
    this.update = update; // Функция игровой логики (physics, AI, etc)
    this.render = render; // Функция рендеринга

    // Accumulator - накапливает дельта-время
    this.accumulator = 0;

    // Последний момент времени (в миллисекундах)
    this.lastTime = performance.now();

    // Alpha для интерполяции [0, 1]
    // 0 = предыдущая позиция, 1 = текущая позиция
    this.alpha = 0;

    // Флаг для работы цикла
    this.isRunning = false;
  }

  /**
   * Главный цикл игры
   */
  tick = (now) => {
    let deltaTime = (now - this.lastTime) / 1000;
    this.lastTime = now;

    if (deltaTime > 0.25) {
      deltaTime = 0.25;
    }

    this.accumulator += deltaTime;

    let steps = 0;
    while (
      this.accumulator >= GAME_LOOP.FIXED_TIMESTEP &&
      steps < GAME_LOOP.MAX_STEPS
    ) {
      this.update(GAME_LOOP.FIXED_TIMESTEP);
      this.accumulator -= GAME_LOOP.FIXED_TIMESTEP;
      steps++;
    }

    const alpha = this.accumulator / GAME_LOOP.FIXED_TIMESTEP;
    this.render(alpha);

    if (this.isRunning) {
      requestAnimationFrame(this.tick);
    }
  };

  /**
   * Запускает игровой цикл
   */
  start() {
    this.isRunning = true;
    this.lastTime = performance.now();
    this.accumulator = 0;
    requestAnimationFrame(this.tick);
  }

  /**
   * Останавливает игровой цикл
   */
  stop() {
    this.isRunning = false;
  }
}

/**
 * Пример использования:
 *
 * const gameLoop = new GameLoop(
 *   (deltaTime) => {
 *     // deltaTime всегда = 1/60 сек
 *     player.update(deltaTime);
 *     enemy.update(deltaTime);
 *     collisions.check();
 *   },
 *   (alpha) => {
 *     // alpha от 0 до 1 - используй для интерполяции
 *     // const interpolatedX = prevX + (currX - prevX) * alpha;
 *     renderer.clear();
 *     renderer.draw(player, alpha);
 *     renderer.draw(enemy, alpha);
 *   }
 * );
 *
 * gameLoop.start();
 */
