import { Enemy } from "../entities/Enemy.js";

export class EnemySpawnSystem {
  constructor(worldSize, audio) {
    this.worldSize = worldSize;
    this.audio = audio;
    this.timer = 0;
    this.interval = 2;
  }

  update(dt, entities, player) {
    this.timer += dt;
    if (this.timer < this.interval) return;

    const x = Math.random() * this.worldSize.width;
    const y = Math.random() * this.worldSize.height;

    if (Math.hypot(x - player.x, y - player.y) > 300) {
      entities.push(new Enemy(x, y, 20, "red", 150, 150, this.audio));
      this.timer = 0;
    }
  }

  reset() {
    this.timer = 0;
  }
}
