export class LevelSystem {
  constructor() {
    this.level = 1;
    this.experience = 0;
    this.expToNextLevel = 10;
    this.pickupRadius = 60; // На каком расстоянии игрок притягивает опыт
  }

  addExperience(amount) {
    this.experience += amount;
    if (this.experience >= this.expToNextLevel) {
      this.levelUp();
    }
  }

  levelUp() {
    this.experience -= this.expToNextLevel;
    this.level++;
    // Формула усложнения: каждый уровень требует на 20% больше опыта
    this.expToNextLevel = Math.round(this.expToNextLevel * 1.2 + 5);

    console.log(`Level Up! Current Level: ${this.level}`);
    // Здесь позже добавим вызов меню улучшений
  }

  update(dt, player, entities) {
    const gems = entities.filter((e) => e.type === "EXP");

    for (const gem of gems) {
      const dx = player.x - gem.x;
      const dy = player.y - gem.y;
      const dist = Math.hypot(dx, dy);

      // Магнитный эффект: если опыт близко, он летит к игроку
      if (dist < this.pickupRadius) {
        const speed = 400;
        gem.velocity.x = (dx / dist) * speed;
        gem.velocity.y = (dy / dist) * speed;
      }

      // Сбор опыта
      if (dist < player.radius + gem.radius) {
        this.addExperience(gem.value);
        gem.toRemove = true;
      }
    }
  }
}
