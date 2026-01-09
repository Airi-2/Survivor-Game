export class UpgradeScreen {
  constructor(game, options) {
    this.game = game;
    this.currentOptions = options;
    this.cooldown = 0.3; // Чуть больше задержка, чтобы избежать случайных кликов
  }

  update(dt) {
    if (this.cooldown > 0) {
      this.cooldown -= dt;
      return null; // Ничего не возвращаем, пока КД
    }

    const { input, canvas } = this.game;

    if (input.wasMousePressed()) {
      const mouse = input.mouse;
      const cardWidth = 200;
      const cardHeight = 250; // Увеличим высоту, чтобы влез текст
      const spacing = 30;
      const totalWidth = this.currentOptions.length * (cardWidth + spacing) - spacing;
      const startX = (canvas.width - totalWidth) / 2;
      const startY = (canvas.height - cardHeight) / 2;

      for (let i = 0; i < this.currentOptions.length; i++) {
        const x = startX + i * (cardWidth + spacing);
        const y = startY;

        if (mouse.x >= x && mouse.x <= x + cardWidth && mouse.y >= y && mouse.y <= y + cardHeight) {
          return this.currentOptions[i]; // Возвращаем выбранный объект улучшения
        }
      }
    }
    return null;
  }

  render(ctx, canvas) {
    // Полупрозрачный фон
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cardWidth = 200;
    const cardHeight = 250;
    const spacing = 30;
    const totalWidth = this.currentOptions.length * (cardWidth + spacing) - spacing;
    const startX = (canvas.width - totalWidth) / 2;
    const startY = (canvas.height - cardHeight) / 2;

    this.currentOptions.forEach((option, index) => {
      const x = startX + index * (cardWidth + spacing);
      const y = startY;

      // Рисуем карточку
      ctx.fillStyle = "#1a1a1a";
      ctx.strokeStyle = "#00ffcc";
      ctx.lineWidth = 3;

      // Скругленный прямоугольник (упрощенно)
      ctx.fillRect(x, y, cardWidth, cardHeight);
      ctx.strokeRect(x, y, cardWidth, cardHeight);

      // Заголовок
      ctx.fillStyle = "#00ffcc";
      ctx.font = "bold 18px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(option.title, x + cardWidth / 2, y + 40);

      // Описание
      ctx.fillStyle = "white";
      ctx.font = "14px sans-serif";
      this.wrapText(ctx, option.description, x + cardWidth / 2, y + 80, cardWidth - 20, 20);
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
