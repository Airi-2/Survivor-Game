export class MenuScreen {
  constructor(game) {
    this.game = game;
  }

  update() {
    if (this.game.input.wasMousePressed()) {
      this.game.startGame();
    }
  }

  render(ctx, canvas) {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    ctx.font = "bold 48px sans-serif";
    ctx.fillText("MY GAME", canvas.width / 2, canvas.height / 2 - 60);

    ctx.font = "24px sans-serif";
    ctx.fillText("CLICK TO START", canvas.width / 2, canvas.height / 2);
  }
}
