export class UpgradeSystem {
  constructor(game) {
    this.game = game;

    // Список доступных улучшений
    this.availableUpgrades = [
      {
        id: "damage",
        title: "Урон +2",
        description: "Увеличивает базовый урон оружия",
        apply: () => {
          this.game.weapon.damage += 2;
        },
      },
      {
        id: "speed",
        title: "Скорость +10%",
        description: "Игрок двигается быстрее",
        apply: () => {
          this.game.player.speed *= 1.1;
        },
      },
      {
        id: "magnet",
        title: "Радиус сбора +20px",
        description: "Кристаллы опыта притягиваются издалека",
        apply: () => {
          this.game.levelSystem.magnetRadius += 20;
        },
      },
    ];
  }

  // Метод для получения случайных улучшений (например, 3 штуки)
  getRandomUpgrades(count = 3) {
    const shuffled = [...this.availableUpgrades].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}
