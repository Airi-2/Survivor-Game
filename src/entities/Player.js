import { Entity } from "./Entity.js";
import { PLAYER } from "../config/constants.js";

export class Player extends Entity {
  constructor(world) {
    // Вызываем конструктор родителя (Entity)
    super(world.width / 2, world.height / 2, PLAYER.RADIUS, PLAYER.COLOR);

    this.speed = PLAYER.SPEED;
    this.isPlayer = true;
  }
}
