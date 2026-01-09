import { Entity } from "./Entity.js";

export class Projectile extends Entity {
  constructor(x, y, velocity, radius, color, damage = 10, range = 1000) {
    super(x, y, radius, color);
    this.velocity = velocity;
    this.type = "PROJECTILE";

    this.damage = damage;
    this.range = range;

    // Координаты появления для расчета дальности
    this.startX = x;
    this.startY = y;
  }

  update(dt) {
    // Проверяем дальность
    const dist = Math.hypot(this.x - this.startX, this.y - this.startY);
    if (dist >= this.range) {
      this.toRemove = true;
    }
  }
}
