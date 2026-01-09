import { Scene } from "./Scene.js";
import { MainMenuScene } from "./MainMenuScene.js";
import { WeaponSelectScene } from "./WeaponSelectScene.js";

export class CharacterSelectScene extends Scene {
  constructor(game) {
    super(game);
    // Список твоих персонажей (можно импортировать из конфига)
    this.characters = [
      { id: "warrior", name: "Воин", color: "#e74c3c", desc: "Много здоровья" },
      { id: "mage", name: "Маг", color: "#3498db", desc: "Мощные заклинания" },
      { id: "rogue", name: "Разбойник", color: "#2ecc71", desc: "Высокая скорость" },
    ];
    this.selectedIndex = 0;
  }

  update() {
    // Переключение персонажей стрелками
    if (this.game.input.wasPressed("ArrowRight")) {
      this.selectedIndex = (this.selectedIndex + 1) % this.characters.length;
    }
    if (this.game.input.wasPressed("ArrowLeft")) {
      this.selectedIndex = (this.selectedIndex - 1 + this.characters.length) % this.characters.length;
    }

    // Возврат в главное меню
    if (this.game.input.wasPressed("Escape")) {
      this.game.setScene(new MainMenuScene(this.game));
    }

    // Подтверждение выбора и переход в саму игру
    if (this.game.input.wasPressed("Enter")) {
      const selectedHero = this.characters[this.selectedIndex];
      // Передаем данные выбранного героя в PlayScene
      this.game.setScene(new WeaponSelectScene(this.game, selectedHero));
    }

    this.game.input.endFrame();
  }

  render(ctx) {
    const { width, height } = this.game.canvas;
    const centerX = width / 2;

    // Фон
    ctx.fillStyle = "#2c3e50";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "40px Arial";
    ctx.fillText("ВЫБЕРИ ГЕРОЯ", centerX, 100);

    // Отрисовка карточки выбранного персонажа
    const hero = this.characters[this.selectedIndex];

    // Рисуем "превью" героя (квадрат нужного цвета)
    ctx.fillStyle = hero.color;
    ctx.fillRect(centerX - 50, 200, 100, 100);

    // Имя и описание
    ctx.fillStyle = "white";
    ctx.font = "32px Arial";
    ctx.fillText(hero.name, centerX, 350);

    ctx.font = "20px Arial";
    ctx.fillStyle = "#bdc3c7";
    ctx.fillText(hero.desc, centerX, 390);

    // Стрелочки-подсказки
    ctx.fillStyle = "white";
    ctx.fillText("<  Стрелки  >", centerX, 450);

    ctx.font = "16px Arial";
    ctx.fillText("ESC для возврата", centerX, height - 40);
  }
}
