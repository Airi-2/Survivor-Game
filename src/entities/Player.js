import { PLAYER } from "../config/constants.js";

export class Player {
  constructor(canvas) {
    this.canvas = canvas;

    this.radius = PLAYER.RADIUS;
    this.color = PLAYER.COLOR;
    this.speed = PLAYER.SPEED;
    this.x = this.canvas.width / 2;
    this.y = this.canvas.height / 2;
  }

  update() {}

  render(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}
