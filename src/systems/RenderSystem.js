export class RenderSystem {
  constructor(ctx, canvas) {
    this.ctx = ctx;
    this.canvas = canvas;
  }

  render(game) {
    const { ctx, canvas, camera, world, hud, state, GAME_STATE } = game;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (state === game.GAME_STATE.MENU) {
      game.menuScreen.render(ctx, canvas);
      return;
    }

    if (state === game.GAME_STATE.GAMEOVER) {
      game.gameOverScreen.render(ctx, canvas);
      return;
    }

    // --- Отрисовка игрового мира ---
    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    // Фон мира
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, world.width, world.height);

    // Все сущности (игрок, враги, пули)
    for (const entity of world.entities) {
      entity.render(ctx);
    }

    // Тексты урона
    game.damageTextSystem.render(ctx);

    ctx.restore();

    // --- UI поверх всего ---
    hud.render(ctx);
    hud.renderExperience(ctx);

    if (game.isPaused) {
      this.renderPauseOverlay();
    }
  }

  renderPauseOverlay() {
    this.ctx.fillStyle = "rgba(0,0,0,0.6)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "center";
    this.ctx.font = "bold 48px sans-serif";
    this.ctx.fillText("PAUSED", this.canvas.width / 2, this.canvas.height / 2);
  }
}
