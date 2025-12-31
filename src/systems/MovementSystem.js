import { clamp } from "../utils/Vector2.js";

export class MovementSystem {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  update(entities, dt) {
    for (const e of entities) {
      if (!e.velocity) continue;
      if (!e.x || !e.y) continue;

      e.x += e.velocity.x * dt;
      e.y += e.velocity.y * dt;

      e.x = clamp(e.x, 0, this.width, e.radius);
      e.y = clamp(e.y, 0, this.height, e.radius);
    }
  }
}
