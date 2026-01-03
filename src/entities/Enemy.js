import { Entity } from "./Entity.js";
import { ExperienceGem } from "./ExperienceGem.js";

export class Enemy extends Entity {
  constructor(x, y, radius, color, speed, health = 30, audio) {
    super(x, y, radius, color);
    this.speed = speed;
    this.type = "ENEMY";

    this.maxHealth = health;
    this.health = health;

    this.audio = audio;

    // 🔥 flash-эффект
    this.flashTime = 0;
    this.flashDuration = 0.1; // секунды
  }

  takeDamage(amount, world) {
    // Добавляем world сюда
    this.health -= amount;

    if (this.health <= 0 && !this.toRemove) {
      this.die(world);
    }
  }

  // update(dt) {
  //   if (this.flashTime > 0) {
  //     this.flashTime -= dt;
  //   }
  // }

  die(world) {
    this.toRemove = true;
    this.audio.play("enemy_death", 0.5);

    // Создаем кристалл опыта
    const gem = new ExperienceGem(this.x, this.y, 1);

    // Импульс, чтобы кристаллы не лежали ровно в одной точке
    gem.velocity.x = (Math.random() - 0.5) * 150;
    gem.velocity.y = (Math.random() - 0.5) * 150;

    world.addEntity(gem);
  }

  render(ctx) {
    // ⚡ если вспышка — рисуем белым
    // if (this.flashTime > 0) {
    // ctx.fillStyle = "white";
    // } else {
    // Цвет зависит от % здоровья
    const healthPercent = Math.max(0, this.health / this.maxHealth);
    const intensity = Math.floor(255 * healthPercent);
    // Ограничим минимальную яркость, чтобы враг не исчезал совсем (например, минимум 50)
    const r = Math.max(50, intensity);
    const g = 0;
    const b = 0;
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    // }

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Можно добавить обводку
    // ctx.strokeStyle = "red";
    // ctx.lineWidth = 2;
    // ctx.stroke();
  }
}
