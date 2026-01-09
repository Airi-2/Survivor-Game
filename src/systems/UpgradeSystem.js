export class UpgradeSystem {
  constructor() {
    this.availableUpgrades = [
      {
        id: "damage",
        title: "Урон +2",
        description: "Увеличивает базовый урон оружия",
        apply: (player) => {
          player.weapon.damage += 2;
        },
      },
      {
        id: "speed",
        title: "Скорость +10%",
        description: "Игрок двигается быстрее",
        apply: (player) => {
          player.speed *= 1.1;
        },
      },
      {
        id: "magnet",
        title: "Радиус сбора +20px",
        description: "Кристаллы опыта притягиваются издалека",
        apply: (player, levelSystem) => {
          levelSystem.magnetRadius += 20;
        },
      },
    ];
  }

  getRandomUpgrades(count = 3) {
    return [...this.availableUpgrades].sort(() => Math.random() - 0.5).slice(0, count);
  }
}
