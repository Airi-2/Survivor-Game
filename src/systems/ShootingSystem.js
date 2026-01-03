import { Projectile } from "../entities/Projectile.js";

export class ShootingSystem {
  constructor(camera, audio, weapon) {
    this.camera = camera;
    this.audio = audio;
    this.weapon = weapon;
  }

  update(dt, input, player, entities) {
    // 1. Обновляем таймер перезарядки оружия
    this.weapon.updateReload(dt);

    // 2. Ручная перезарядка
    if (input.wasPressed("KeyR")) {
      // Условие: не перезаряжаем, если уже в процессе ИЛИ если патронов максимум
      if (!this.weapon.isReloading && this.weapon.ammo < this.weapon.magSize) {
        this.weapon.reload();
        this.audio.play("reload", 0.7);
      }
    }

    // 3. Автоматическая перезарядка
    if (this.weapon.ammo <= 0 && !this.weapon.isReloading) {
      this.weapon.reload();
      this.audio.play("reload", 0.7);
    }

    // --- ПРЕРЫВАНИЕ ПЕРЕЗАРЯДКИ ВЫСТРЕЛОМ ---

    // Если игрок нажал выстрел, у него есть патроны, но он в процессе перезарядки
    if (
      input.mouse.pressed &&
      this.weapon.isReloading &&
      this.weapon.ammo > 0
    ) {
      this.weapon.isReloading = false; // Отменяем флаг перезарядки
      this.weapon.reloadTimer = 0; // Сбрасываем таймер
      // Теперь canShoot() при следующей проверке вернет true
    }

    // 4. Проверка возможности выстрела
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
