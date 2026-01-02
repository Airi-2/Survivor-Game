import { Entity } from "./Entity.js";
import { PLAYER } from "../config/constants.js";

export class Player extends Entity {
  constructor(world, audio) {
    // Вызываем конструктор родителя (Entity)
    super(world.width / 2, world.height / 2, PLAYER.RADIUS, PLAYER.COLOR);

    this.speed = PLAYER.SPEED;
    this.isPlayer = true;
    this.type = "PLAYER"; // Добавляем тип для системы коллизий

    // Здоровье
    this.maxHealth = 100;
    this.health = this.maxHealth;

    // Параметры I-frames
    this.invulnerableTimer = 0;
    this.invulnerableDuration = 1.0;

    this.audio = audio;
  }

  update(dt) {
    // Уменьшаем таймер неуязвимости
    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer -= dt;
    }
  }

  takeDamage(amount) {
    if (this.invulnerableTimer > 0) return;

    this.audio.play("player_hurt", 0.8);
    this.health -= amount;
    this.invulnerableTimer = this.invulnerableDuration;

    if (this.health <= 0) {
      this.health = 0;
      return true; // Сигнализируем о смерти
    }
    return false;
  }

  render(ctx) {
    ctx.save();

    // Эффект мигания или прозрачности, когда игрок неуязвим
    if (this.invulnerableTimer > 0) {
      // Меняем прозрачность: будет пульсировать или просто станет полупрозрачным
      ctx.globalAlpha = 0.5;
    }

    super.render(ctx); // Вызываем базовый рендер круга

    ctx.restore();
  }
}
