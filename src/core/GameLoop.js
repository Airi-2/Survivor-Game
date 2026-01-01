import { GAME_LOOP } from "../config/constants.js";
import { Time } from "./Time.js";

export class GameLoop {
  constructor(update, render) {
    this.update = update;
    this.render = render;

    this.accumulator = 0;
    this.alpha = 0;
    this.isRunning = false;

    this.time = new Time();
  }

  tick = (now) => {
    if (!this.isRunning) return;

    const deltaTime = this.time.getDelta(now);
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

    this.alpha = this.accumulator / GAME_LOOP.FIXED_TIMESTEP;
    this.render(this.alpha);

    requestAnimationFrame(this.tick);
  };

  start() {
    this.isRunning = true;
    this.accumulator = 0;
    this.time.reset();
    requestAnimationFrame(this.tick);
  }

  resetTime() {
    this.accumulator = 0;
    this.time.reset();
  }
}
