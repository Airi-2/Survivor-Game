export class Weapon {
  constructor({
    damage = 10,
    fireRate = 0.2,
    projectileSpeed = 800,
    projectileRadius = 5,
    projectileColor = "yellow",
    range = 1000,
  } = {}) {
    this.damage = damage;
    this.fireRate = fireRate;
    this.projectileSpeed = projectileSpeed;
    this.projectileRadius = projectileRadius;
    this.projectileColor = projectileColor;
    this.range = range;

    this.timer = 0;
  }

  canShoot(dt) {
    this.timer -= dt;
    return this.timer <= 0;
  }

  resetTimer() {
    this.timer = this.fireRate;
  }

  // Базовый метод shoot возвращает один снаряд
  shoot(player, targetX, targetY) {
    const angle = Math.atan2(targetY - player.y, targetX - player.x);

    const velocity = {
      x: Math.cos(angle) * this.projectileSpeed,
      y: Math.sin(angle) * this.projectileSpeed,
    };

    return {
      x: player.x,
      y: player.y,
      velocity,
      radius: this.projectileRadius,
      color: this.projectileColor,
      damage: this.damage,
      range: this.range,
    };
  }
}
