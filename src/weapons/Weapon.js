export class Weapon {
  constructor({
    damage = 10,
    fireRate = 0.2,
    projectileSpeed = 800,
    projectileRadius = 5,
    projectileColor = "yellow",
    range = 1000,
    magSize = 12, // Вместимость магазина
    reloadTime = 1.5, // Время перезарядки в секундах
  } = {}) {
    this.damage = damage;
    this.fireRate = fireRate;
    this.projectileSpeed = projectileSpeed;
    this.projectileRadius = projectileRadius;
    this.projectileColor = projectileColor;
    this.range = range;

    // Логика патронов
    this.magSize = magSize;
    this.ammo = magSize;
    this.reloadTime = reloadTime;
    this.reloadTimer = 0;
    this.isReloading = false;

    this.timer = 0;
  }

  canShoot(dt) {
    this.timer -= dt;

    // Не можем стрелять, если: идет перезарядка, кончились патроны или не откатился КД выстрела
    if (this.isReloading || this.ammo <= 0 || this.timer > 0) return false;
    return true;
  }

  reload() {
    if (this.isReloading || this.ammo === this.magSize) return;
    this.isReloading = true;
    this.reloadTimer = this.reloadTime;
  }

  updateReload(dt) {
    if (!this.isReloading) return;

    this.reloadTimer -= dt;
    if (this.reloadTimer <= 0) {
      this.ammo = this.magSize;
      this.isReloading = false;
    }
  }

  resetTimer() {
    this.timer = this.fireRate;
    this.ammo--; // Тратим патрон при выстреле
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
