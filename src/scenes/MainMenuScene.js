import { Scene } from "./Scene.js";
import { CharacterSelectScene } from "./CharacterSelectScene.js";

export class MainMenuScene extends Scene {
  constructor(game) {
    super(game);
    this.options = ["Играть", "Опции"];
    this.selectedIndex = 0; // Какой пункт выбран сейчас
  }

  update() {
    // Используем твою систему ввода (предположим, методы называются так)
    if (this.game.input.wasPressed("ArrowDown")) {
      this.selectedIndex = (this.selectedIndex + 1) % this.options.length;
    }
    if (this.game.input.wasPressed("ArrowUp")) {
      this.selectedIndex = (this.selectedIndex - 1 + this.options.length) % this.options.length;
    }

    if (this.game.input.wasPressed("Enter")) {
      this.confirmSelection();
    }
  }

  confirmSelection() {
    if (this.selectedIndex === 0) {
      // Переходим к игре
      this.game.setScene(new CharacterSelectScene(this.game));
    } else {
      console.log("Открываем настройки...");
    }
  }

  render(ctx) {
    const { width, height } = this.game.canvas;
    const centerX = width / 2;
    const centerY = height / 2;

    // Фон (опционально, если хочешь закрасить именно в сцене)
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, width, height);

    // Заголовок
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "bold 48px Arial";
    ctx.fillText("МОЯ КРУТАЯ ИГРА", centerX, centerY - 100);

    // Отрисовка пунктов меню
    ctx.font = "30px Arial";
    this.options.forEach((text, index) => {
      const isSelected = this.selectedIndex === index;

      // Подсветка выбранного пункта
      ctx.fillStyle = isSelected ? "#ffcc00" : "#aaaaaa";

      // Добавляем маркер ">" перед выбранным пунктом
      const displayText = isSelected ? `> ${text} <` : text;

      ctx.fillText(displayText, centerX, centerY + index * 50);
    });

    // Подсказка внизу
    ctx.font = "16px Arial";
    ctx.fillStyle = "#555";
    ctx.fillText("Используйте стрелки для выбора и Enter для подтверждения", centerX, height - 40);
  }
}
