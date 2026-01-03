export class UpgradeScreen {
  constructor(game) {
    this.game = game;
    this.currentOptions = [];
    this.cooldown = 0;
  }

  // Подготавливаем опции для выбора
  setOptions(options) {
    this.currentOptions = options;
    this.cooldown = 0.2; // Блокируем клики на 0.2 секунды после открытия
  }

  update(dt) {
    if (this.cooldown > 0) {
      this.cooldown -= dt;
      return;
    }

    const { input, canvas } = this.game;

    if (input.wasMousePressed()) {
      const mouse = input.mouse;
      const cardWidth = 200;
      const cardHeight = 150;
      const spacing = 20;
      const totalWidth = this.currentOptions.length * (cardWidth + spacing) - spacing;
      const startX = (canvas.width - totalWidth) / 2;
      const startY = (canvas.height - cardHeight) / 2;

      // Проверяем, в какую карточку кликнули
      this.currentOptions.forEach((option, index) => {
        const x = startX + index * (cardWidth + spacing);
        const y = startY;

        if (mouse.x >= x && mouse.x <= x + cardWidth && mouse.y >= y && mouse.y <= y + cardHeight) {
          option.apply(); // Применяем улучшение
          this.game.input.clearAll(); // Очистить клик, чтобы не выстрелить после закрытия
          this.game.resumeAfterUpgrade(); // Возвращаемся в игру
        }
      });
    }
  }

  render(ctx, canvas) {
    // Затемнение фона
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText("ВЫБЕРИТЕ УЛУЧШЕНИЕ", canvas.width / 2, canvas.height / 2 - 150);

    const cardWidth = 200;
    const cardHeight = 150;
    const spacing = 20;
    const totalWidth = this.currentOptions.length * (cardWidth + spacing) - spacing;
    const startX = (canvas.width - totalWidth) / 2;
    const startY = (canvas.height - cardHeight) / 2;

    this.currentOptions.forEach((option, index) => {
      const x = startX + index * (cardWidth + spacing);
      const y = startY;

      // Рамка карточки
      ctx.strokeStyle = "#00ffcc";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, cardWidth, cardHeight);
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.fillRect(x, y, cardWidth, cardHeight);

      // Текст внутри
      ctx.fillStyle = "white";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText(option.title, x + cardWidth / 2, y + 40);

      ctx.font = "14px sans-serif";
      ctx.fillStyle = "#aaa";
      this.wrapText(ctx, option.description, x + cardWidth / 2, y + 80, 180, 20);
    });
  }

  wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    for (let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + " ";
      let metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + " ";
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }
}
