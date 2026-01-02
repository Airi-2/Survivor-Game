export class GameOverScreen {
  constructor(game) {
    this.game = game;
  }

  update() {
    if (this.game.input.wasPressed("Enter")) {
      this.game.restart();
    }
  }

  render(ctx, canvas) {
    ctx.fillStyle = "rgba(139,0,0,0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    ctx.font = "bold 64px sans-serif";
    ctx.fillText("YOU DIED", canvas.width / 2, canvas.height / 2 - 20);

    ctx.font = "24px sans-serif";
    ctx.fillText(
      "Press ENTER to Restart",
      canvas.width / 2,
      canvas.height / 2 + 60
    );
  }
}
