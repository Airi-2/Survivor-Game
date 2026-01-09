export class InputSystem {
  update(player, input, dt) {
    if (!player || !player.velocity) return;

    let inputX = 0;
    let inputY = 0;

    if (input.isDown("KeyD")) inputX += 1;
    if (input.isDown("KeyA")) inputX -= 1;
    if (input.isDown("KeyW")) inputY -= 1;
    if (input.isDown("KeyS")) inputY += 1;

    const length = Math.hypot(inputX, inputY);
    if (length > 0) {
      player.velocity.x = (inputX / length) * player.speed;
      player.velocity.y = (inputY / length) * player.speed;
    } else {
      player.velocity.x = 0;
      player.velocity.y = 0;
    }
  }
}
