import { Projectile } from "../entities/Projectile.js";

export class ShootingSystem {
  constructor() {
    // Теперь конструктор пустой, так как всё нужное приходит в update
  }

  update(dt, input, player, entities, camera, audio) {
    const weapon = player.weapon;
    if (!weapon) return;

    // 1. Обновляем логику оружия (таймеры перезарядки и скорострельности)
    weapon.updateReload(dt);

    // 2. Ручная перезарядка (KeyR)
    if (input.wasPressed("KeyR")) {
      if (!weapon.isReloading && weapon.ammo < weapon.magSize) {
        weapon.reload();
        audio.play("reload", 0.7);
      }
    }

    // 3. Автоматическая перезарядка при пустом магазине
    if (weapon.ammo <= 0 && !weapon.isReloading) {
      weapon.reload();
      audio.play("reload", 0.7);
    }

    // 4. Прерывание перезарядки, если игрок хочет выстрелить и есть патроны
    if (input.mouse.pressed && weapon.isReloading && weapon.ammo > 0) {
      weapon.isReloading = false;
      weapon.reloadTimer = 0;
    }

    // 5. Проверка возможности выстрела (задержка между пулями)
    if (!weapon.canShoot(dt)) return;

    // 6. Сам выстрел
    if (input.mouse.pressed) {
      // Переводим экранные координаты мыши в мировые с помощью камеры
      const worldMouseX = input.mouse.x + camera.x;
      const worldMouseY = input.mouse.y + camera.y;

      // Получаем данные о снарядах от оружия
      const projectilesData = weapon.shoot(player, worldMouseX, worldMouseY);

      if (projectilesData) {
        // Приводим к массиву, чтобы одинаково обрабатывать и пистолет, и дробь
        const dataArray = Array.isArray(projectilesData) ? projectilesData : [projectilesData];

        for (const p of dataArray) {
          entities.push(
            new Projectile(
              p.x,
              p.y,
              p.velocity,
              p.radius,
              p.color,
              p.damage,
              p.range // Теперь передаем range из данных оружия
            )
          );
        }

        weapon.resetTimer();
        audio.play("shoot", 0.3);
      }
    }
  }
}
