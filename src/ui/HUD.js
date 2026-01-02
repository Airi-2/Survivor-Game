export class HUD {
  constructor(game) {
    this.game = game;
  }

  render(ctx) {
    this.renderHealth(ctx);
    this.renderTimer(ctx);
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
}
