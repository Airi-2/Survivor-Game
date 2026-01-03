import { Entity } from "./Entity.js";

export class ExperienceGem extends Entity {
  constructor(x, y, value = 1) {
    super(x, y, 4, "#00ffcc"); // Маленький яркий кристалл
    this.type = "EXP";
    this.value = value;
    this.velocity = { x: 0, y: 0 };
    this.friction = 0.92; // Чтобы кристалл мог немного "отлететь" при появлении
  }

  update(dt) {
    this.x += this.velocity.x * dt;
    this.y += this.velocity.y * dt;
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;
  }

  render(ctx) {
    // Визуальный эффект: небольшое свечение
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;

    super.render(ctx);

    // Сбрасываем тени, чтобы не тормозило остальное
    ctx.shadowBlur = 0;
  }
}
