export class HUD {
  constructor(game) {
    this.game = game;
  }

  render(ctx) {
    this.renderHealth(ctx);
    this.renderTimer(ctx);
    this.renderAmmo(ctx);
  }

  renderTimer(ctx) {
    const time = this.game.timeSurvival.formatted;

    ctx.fillStyle = "white";
    ctx.font = "20px monospace";
    ctx.textAlign = "right";

    ctx.fillText(time, this.game.canvas.width - 20, 30);
  }

  renderHealth(ctx) {
    const player = this.game.player;

    const x = 20;
    const y = 20;
    const width = 200;
    const height = 20;

    ctx.fillStyle = "#333";
    ctx.fillRect(x, y, width, height);

    const hp = player.health / player.maxHealth;
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, width * hp, height);

    ctx.strokeStyle = "white";
    ctx.strokeRect(x, y, width, height);
  }

  renderAmmo(ctx) {
    const weapon = this.game.shootingSystem.weapon; // Убедись, что путь к оружию верный
    const x = 20;
    const y = this.game.canvas.height - 40;

    // Отрисовка текста патронов
    ctx.fillStyle = "white";
    ctx.font = "24px monospace";
    ctx.textAlign = "left";

    let text = `AMMO: ${weapon.ammo} / ${weapon.magSize}`;
    if (weapon.isReloading) text = "RELOADING...";

    ctx.fillText(text, x, y);

    // Полоска прогресса перезарядки (если нужно)
    if (weapon.isReloading) {
      const progress = 1 - weapon.reloadTimer / weapon.reloadTime;
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.fillRect(x, y + 10, 150, 5);
      ctx.fillStyle = "yellow";
      ctx.fillRect(x, y + 10, 150 * progress, 5);
    }
  }

  renderExperience(ctx) {
    const levelSystem = this.game.levelSystem;
    const x = 0;
    const y = 0; // На самом верху экрана
    const width = this.game.canvas.width;
    const height = 10;

    // Фон полоски
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(x, y, width, height);

    // Прогресс
    const progress = levelSystem.experience / levelSystem.expToNextLevel;
    ctx.fillStyle = "#00ffcc";
    ctx.fillRect(x, y, width * progress, height);

    // Текст уровня
    ctx.fillStyle = "white";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`LVL ${levelSystem.level}`, 10, 25);
  }
}
