import { Projectile } from "../entities/Projectile.js";

export class ShootingSystem {
  constructor(camera, audio, weapon) {
    this.camera = camera;
    this.audio = audio;
    this.weapon = weapon;
  }

  update(dt, input, player, entities) {
    // Проверяем, может ли оружие стрелять
    if (!this.weapon.canShoot(dt)) return;

    if (input.mouse.pressed) {
      const worldMouseX = input.mouse.x + this.camera.x;
      const worldMouseY = input.mouse.y + this.camera.y;

      // Метод shoot оружия возвращает один снаряд или массив снарядов
      const projectilesData = this.weapon.shoot(
        player,
        worldMouseX,
        worldMouseY
      );

      if (Array.isArray(projectilesData)) {
        for (const p of projectilesData) {
          entities.push(
            new Projectile(
              p.x,
              p.y,
              p.velocity,
              p.radius,
              p.color,
              p.damage,
              p.range
            )
          );
        }
      } else {
        entities.push(
          new Projectile(
            projectilesData.x,
            projectilesData.y,
            projectilesData.velocity,
            projectilesData.radius,
            projectilesData.color,
            projectilesData.damage,
            projectilesData.range
          )
        );
      }

      this.weapon.resetTimer();
      this.audio.play("shoot", 0.3);
    }
  }
}
