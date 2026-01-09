export class HUD {
  constructor(canvasWidth, canvasHeight) {
    // Храним только размеры, чтобы не зависеть от всего объекта game
    this.width = canvasWidth;
    this.height = canvasHeight;
  }

  // Принимаем всё необходимое для отрисовки
  render(ctx, player, gameTimer, levelSystem) {
    this.renderExperience(ctx, levelSystem); // Полоска опыта обычно в самом низу слоев
    this.renderHealth(ctx, player);
    this.renderTimer(ctx, gameTimer);
    this.renderAmmo(ctx, player);
  }

  renderTimer(ctx, gameTimer) {
    const time = gameTimer.formatted;
    ctx.fillStyle = "white";
    ctx.font = "20px monospace";
    ctx.textAlign = "right";
    ctx.fillText(time, this.width - 20, 30);
  }

  renderHealth(ctx, player) {
    const x = 20;
    const y = 20;
    const width = 200;
    const height = 20;

    ctx.fillStyle = "#333";
    ctx.fillRect(x, y, width, height);

    // Добавим проверку на maxHealth, чтобы не делить на 0
    const hpRatio = player.maxHealth > 0 ? player.health / player.maxHealth : 0;
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, width * Math.max(0, hpRatio), height);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
  }

  renderExperience(ctx, levelSystem) {
    const x = 0;
    const y = 0;
    const width = this.width;
    const height = 12; // Сделаем чуть толще для красоты

    // 1. Фон полоски
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(x, y, width, height);

    // 2. Рассчитываем прогресс
    // Важно: используем точное имя свойства из твоего LevelSystem: expToNextLevel
    const progress = Math.min(levelSystem.experience / levelSystem.expToNextLevel, 1);

    // Градиент для красоты (опционально)
    ctx.fillStyle = "#00ffcc";
    ctx.fillRect(x, y, width * progress, height);

    // 3. Текст уровня (слева)
    ctx.fillStyle = "white";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`LVL ${levelSystem.level}`, 10, 28);

    // 4. Текст опыта (справа) — ТВОЙ ЗАПРОС
    ctx.textAlign = "right";
    const expText = `${Math.floor(levelSystem.experience)} / ${levelSystem.expToNextLevel} XP`;
    ctx.fillText(expText, this.width - 10, 28);
  }

  renderAmmo(ctx, player) {
    const weapon = player.weapon;
    const x = 20;
    const y = this.height - 20; // Чуть выше края

    ctx.fillStyle = "white";
    ctx.font = "24px monospace";
    ctx.textAlign = "left";

    let text = `AMMO: ${weapon.ammo} / ${weapon.magSize}`;
    if (weapon.isReloading) text = "RELOADING...";

    ctx.fillText(text, x, y);
  }
}
