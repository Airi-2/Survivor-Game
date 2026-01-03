export class CollisionSystem {
  constructor(audio, weapon, damageTextSystem) {
    this.audio = audio;
    this.weapon = weapon;
    this.damageTextSystem = damageTextSystem; // <--- важно
  }

  update(entities, player, world) {
    // Разделяем сущности по типам для оптимизации
    const projectiles = entities.filter((e) => e.type === "PROJECTILE");
    const enemies = entities.filter((e) => e.type === "ENEMY");

    for (const e of enemies) {
      if (e.toRemove) continue;

      // 1. Проверка: Враг + Пуля
      for (const p of projectiles) {
        if (p.toRemove) continue;
        if (this.checkCollision(p, e)) {
          this.audio.play("hit", 0.4);
          p.toRemove = true;

          const damage = this.weapon.damage;
          e.takeDamage(damage, world);

          // координаты для текста: центр врага
          this.damageTextSystem.addDamage(e.x, e.y, damage);
        }
      }

      // 2. Проверка: Враг + Игрок
      if (this.checkCollision(e, player)) {
        // Используем урон врага, если он задан, иначе 10
        const damage = e.contactDamage || 10;
        player.takeDamage(damage);
      }
    }
  }

  checkCollision(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.hypot(dx, dy) < a.radius + b.radius;
  }
}
