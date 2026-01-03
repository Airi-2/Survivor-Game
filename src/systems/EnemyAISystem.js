export class EnemyAISystem {
  update(dt, entities, player) {
    const enemies = entities.filter((e) => e.type === "ENEMY");

    for (const enemy of enemies) {
      this.updateEnemy(enemy, player, enemies);
    }
  }

  updateEnemy(enemy, player, allEnemies) {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const dist = Math.hypot(dx, dy);

    let moveX = 0;
    let moveY = 0;

    // 1. Движение к игроку
    if (dist > 0) {
      moveX = (dx / dist) * enemy.speed;
      moveY = (dy / dist) * enemy.speed;
    }

    // 2. Расталкивание
    const personalSpace = enemy.radius * 2.5;

    for (const other of allEnemies) {
      if (other === enemy) continue;

      const diffX = enemy.x - other.x;
      const diffY = enemy.y - other.y;
      const d = Math.hypot(diffX, diffY);

      if (d > 0 && d < personalSpace) {
        const force = ((personalSpace - d) / personalSpace) * 2;
        moveX += (diffX / d) * enemy.speed * force;
        moveY += (diffY / d) * enemy.speed * force;
      }
    }

    // 3. Ограничение скорости
    const speed = Math.hypot(moveX, moveY);
    if (speed > enemy.speed) {
      moveX = (moveX / speed) * enemy.speed;
      moveY = (moveY / speed) * enemy.speed;
    }

    enemy.velocity.x = moveX;
    enemy.velocity.y = moveY;
  }
}
