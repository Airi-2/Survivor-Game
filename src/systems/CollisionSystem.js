export class CollisionSystem {
  update(entities) {
    // Разделяем сущности по типам для оптимизации
    const projectiles = entities.filter(e => e.type === "PROJECTILE");
    const enemies = entities.filter(e => e.type === "ENEMY");

    for (const p of projectiles) {
      for (const e of enemies) {
        // Если уже помечены на удаление, пропускаем
        if (p.toRemove || e.toRemove) continue;

        if (this.checkCollision(p, e)) {
          p.toRemove = true;
          e.toRemove = true;
        }
      }
    }
  }

  checkCollision(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    // Расстояние между центрами (Пифагор)
    const distance = Math.sqrt(dx * dx + dy * dy);
    // Столкнулись, если расстояние меньше суммы радиусов
    return distance < a.radius + b.radius;
  }
}