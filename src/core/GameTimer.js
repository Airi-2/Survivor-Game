// src/core/GameTimer.js
export class GameTimer {
  constructor() {
    this.elapsed = 0;
    this.running = false;
  }

  start() {
    this.running = true;
  }

  stop() {
    this.running = false;
  }

  update(dt) {
    if (!this.running) return;
    this.elapsed += dt;
  }

  get seconds() {
    return Math.floor(this.elapsed);
  }

  get formatted() {
    const minutes = Math.floor(this.elapsed / 60);
    const seconds = Math.floor(this.elapsed % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
}
