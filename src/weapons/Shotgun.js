import { Weapon } from "./Weapon.js";

export class Shotgun extends Weapon {
  constructor() {
    super({
      damage: 8,
      fireRate: 1, // Медленнее, чем пистолет
      projectileSpeed: 700,
      projectileRadius: 5,
      projectileColor: "orange",
      range: 600,
    });

    this.pellets = 5; // количество пуль за выстрел
    this.spread = 15; // угол в градусах
  }

  shoot(player, targetX, targetY) {
    const baseAngle = Math.atan2(targetY - player.y, targetX - player.x);
    const angleOffset = (this.spread * Math.PI) / 180; // в радиан
    const halfPellets = Math.floor(this.pellets / 2);

    const projectiles = [];

    for (let i = -halfPellets; i <= halfPellets; i++) {
      const angle = baseAngle + (i * angleOffset) / halfPellets;

      const velocity = {
        x: Math.cos(angle) * this.projectileSpeed,
        y: Math.sin(angle) * this.projectileSpeed,
      };

      projectiles.push({
        x: player.x,
        y: player.y,
        velocity,
        radius: this.projectileRadius,
        color: this.projectileColor,
        damage: this.damage,
        range: this.range,
      });
    }

    return projectiles;
  }
}
