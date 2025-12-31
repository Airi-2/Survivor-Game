import { Player } from "../entities/Player.js";
import { InputSystem } from "../systems/InputSystem.js";
import { MovementSystem } from "../systems/MovementSystem.js";
import { Input } from "../core/Input.js";

export class Game {
  constructor(ctx, canvas) {
    this.ctx = ctx;
    this.canvas = canvas;

    this.state = "PLAYING";

    this.player = new Player(this.canvas);
    // создаём Input и системы
    this.input = new Input();
    this.inputSystem = new InputSystem(this.input, this.player);
    this.movementSystem = new MovementSystem(canvas.width, canvas.height);

    // Список всех сущностей (для движения)
    this.entities = [this.player];
  }

  update(dt) {
    if (this.state !== "PLAYING") return;

    this.inputSystem.update(this.entities, dt);
    this.movementSystem.update(this.entities, dt);
  }

  render(alpha) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.player.render(this.ctx);
  }
}
