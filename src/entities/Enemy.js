import { Entity } from "./Entity.js";

export class Enemy extends Entity {
  constructor(x, y, radius, color, speed, health = 30, audio) {
    super(x, y, radius, color);
    this.speed = speed;
    this.type = "ENEMY";

    this.maxHealth = health;
    this.health = health;

    this.audio = audio;
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.audio.play("enemy_death", 0.5);
      this.toRemove = true;
    }
  }

  render(ctx) {
    // Цвет зависит от % здоровья
    const healthPercent = Math.max(0, this.health / this.maxHealth);

    // Красный отмирает, зелёный появляется при снижении HP
    const r = Math.floor(255 * healthPercent);
    const g = Math.floor(255 * (1 - healthPercent));
    const b = 0;

    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Можно добавить обводку
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}
