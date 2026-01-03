export class LevelSystem {
  constructor(game) {
    this.level = 1;
    this.experience = 0;
    this.expToNextLevel = 10;

    // Базовый радиус сбора опыта
    this.magnetRadius = 80;
    // Скорость, с которой опыт летит к игроку
    this.magnetSpeed = 400;

    this.game = game;
  }

  addExperience(amount) {
    this.experience += amount;
    if (this.experience >= this.expToNextLevel) {
      this.levelUp();
    }
  }

  levelUp() {
    if (this.game.state === "UPGRADE") return; // Защита от двойного вызова

    this.experience -= this.expToNextLevel;
    this.level++;
    // Формула усложнения: каждый уровень требует на 20% больше опыта
    this.expToNextLevel = Math.round(this.expToNextLevel * 1.2 + 5);

    // Очищаем ввод перед открытием меню
    this.game.input.clearAll();

    // Вызываем состояние паузы для выбора улучшения в игре
    this.game.showUpgradeScreen();
  }

  update(dt, player, entities) {
    const gems = entities.filter((e) => e.type === "EXP");

    for (const gem of gems) {
      const dx = player.x - gem.x;
      const dy = player.y - gem.y;
      const dist = Math.hypot(dx, dy);

      // 1. ПРОВЕРКА МАГНИТА
      if (dist < this.magnetRadius) {
        // Направляем вектор скорости кристалла к игроку
        const force = this.magnetSpeed;
        gem.velocity.x = (dx / dist) * force;
        gem.velocity.y = (dy / dist) * force;
      }

      // 2. СБОР (КОНТАКТ)
      // Используем сумму радиусов для точности
      if (dist < player.radius + gem.radius) {
        this.addExperience(gem.value);
        gem.toRemove = true;
        // Можно добавить звук подбора
        // this.audio.play("pickup_exp", 0.3);
      }
    }
  }
}
