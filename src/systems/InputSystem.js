export class InputSystem {
  constructor(input, player) {
    this.input = input;
    this.player = player;
  }

  update(entities, dt) {
    if (!this.player.velocity) this.player.velocity = { x: 0, y: 0 };

    let inputX = 0;
    let inputY = 0;

    if (this.input.isDown("KeyD")) inputX += 1;
    if (this.input.isDown("KeyA")) inputX -= 1;
    if (this.input.isDown("KeyW")) inputY -= 1;
    if (this.input.isDown("KeyS")) inputY += 1;

    const length = Math.hypot(inputX, inputY);

    if (length > 0) {
      this.player.velocity.x = (inputX / length) * this.player.speed;
      this.player.velocity.y = (inputY / length) * this.player.speed;
    } else {
      this.player.velocity.x = 0;
      this.player.velocity.y = 0;
    }
  }
}
