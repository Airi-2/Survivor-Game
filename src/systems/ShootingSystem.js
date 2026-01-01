import { Projectile } from "../entities/Projectile.js";

export class ShootingSystem {
  constructor(camera) {
    this.camera = camera;
    // Можно добавить задержку между выстрелами (в секундах)
    this.fireRate = 0.2;
    this.timer = 0;
  }

  update(dt, input, player, entities) {
    if (this.timer > 0) {
      this.timer -= dt;
    }

    // Проверяем нажатие (теперь можно зажать кнопку для очереди)
    if (input.mouse.pressed && this.timer <= 0) {
      this.shoot(input.mouse, player, entities);
      this.timer = this.fireRate;
    }
  }

  shoot(mouse, player, entities) {
    // 1. Координаты мыши в мире
    const worldMouseX = mouse.x + this.camera.x;
    const worldMouseY = mouse.y + this.camera.y;

    // 2. Расчет угла
    const angle = Math.atan2(worldMouseY - player.y, worldMouseX - player.x);

    const speed = 800;
    const velocity = {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed,
    };

    // 3. Создание и добавление снаряда
    const projectile = new Projectile(
      player.x,
      player.y,
      velocity,
      5,
      "yellow"
    );

    entities.push(projectile);
  }
}
