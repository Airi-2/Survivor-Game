import { Entity } from "./Entity.js";
import { PLAYER } from "../config/constants.js";

export class Player extends Entity {
  constructor(config, audio) {
    // Вызываем Entity: x, y, radius, color
    super(config.x, config.y, PLAYER.RADIUS, config.color);

    this.name = config.name;
    this.speed = PLAYER.SPEED;
    this.type = "PLAYER";

    // Здоровье берем из конфига
    this.maxHealth = config.health || 100;
    this.health = this.maxHealth;

    // Оружие
    this.weapon = config.weapon;

    // Таймеры
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
