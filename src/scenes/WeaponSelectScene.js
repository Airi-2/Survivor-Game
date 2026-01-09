import { Scene } from "./Scene.js";
import { PlayScene } from "./PlayScene.js";
import { CharacterSelectScene } from "./CharacterSelectScene.js";

export class WeaponSelectScene extends Scene {
  constructor(game, selectedHero) {
    super(game);
    // Сохраняем данные персонажа из прошлой сцены
    this.hero = selectedHero;

    // Список доступного оружия (можно вынести в константы)
    this.weapons = [
      { id: "pistol", name: "Пистолет", damage: 10, fireRate: "Быстро" },
      { id: "shotgun", name: "Дробовик", damage: 40, fireRate: "Медленно" },
      { id: "laser", name: "Лазер", damage: 5, fireRate: "Очень быстро" },
    ];
    this.selectedIndex = 0;
  }

  update() {
    // Навигация
    if (this.game.input.wasPressed("ArrowDown")) {
      this.selectedIndex = (this.selectedIndex + 1) % this.weapons.length;
    }
    if (this.game.input.wasPressed("ArrowUp")) {
      this.selectedIndex = (this.selectedIndex - 1 + this.weapons.length) % this.weapons.length;
    }

    // Назад к выбору персонажа
    if (this.game.input.wasPressed("Escape")) {
      this.game.setScene(new CharacterSelectScene(this.game));
    }

    // Подтверждение: идем в игру с полным набором данных
    if (this.game.input.wasPressed("Enter")) {
      const selectedWeapon = this.weapons[this.selectedIndex];

      // Формируем финальный конфиг для игры
      const gameConfig = {
        hero: this.hero,
        weapon: selectedWeapon,
      };

      this.game.setScene(new PlayScene(this.game, gameConfig));
    }

    this.game.input.endFrame();
  }

  render(ctx) {
    const { width, height } = this.game.canvas;
    const centerX = width / 2;

    // Фон
    ctx.fillStyle = "#16a085";
    ctx.fillRect(0, 0, width, height);

    // Заголовок и инфо о герое
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "24px Arial";
    ctx.fillText(`Герой: ${this.hero.name}`, centerX, 50);

    ctx.font = "40px Arial";
    ctx.fillText("ВЫБЕРИ ОРУЖИЕ", centerX, 110);

    // Отрисовка списка оружия
    this.weapons.forEach((weapon, index) => {
      const isSelected = this.selectedIndex === index;
      const yPos = 200 + index * 80;

      // Рамка выбора
      if (isSelected) {
        ctx.strokeStyle = "#f1c40f";
        ctx.lineWidth = 3;
        ctx.strokeRect(centerX - 150, yPos - 35, 300, 60);
        ctx.fillStyle = "#f1c40f";
      } else {
        ctx.fillStyle = "white";
      }

      ctx.font = "30px Arial";
      ctx.fillText(weapon.name, centerX, yPos);

      // Доп. характеристики мелким шрифтом
      ctx.font = "16px Arial";
      ctx.fillText(`Урон: ${weapon.damage} | Скорость: ${weapon.fireRate}`, centerX, yPos + 20);
    });

    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = "16px Arial";
    ctx.fillText("ENTER - Начать бой | ESC - Назад", centerX, height - 40);
  }
}
