import { Entity } from "./Entity.js";

export class Enemy extends Entity {
  constructor(x, y, radius, color, speed) {
    super(x, y, radius, color);
    this.speed = speed;
    this.type = "ENEMY";
  }

  // Логика движения врага: он всегда бежит к игроку
  update(dt, player) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const angle = Math.atan2(dy, dx);

    this.velocity.x = Math.cos(angle) * this.speed;
    this.velocity.y = Math.sin(angle) * this.speed;
  }
}
