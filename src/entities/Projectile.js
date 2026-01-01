import { Entity } from "./Entity.js";

export class Projectile extends Entity {
  constructor(x, y, velocity, radius, color) {
    super(x, y, radius, color);
    this.velocity = velocity;
    this.type = "PROJECTILE";
  }
}
