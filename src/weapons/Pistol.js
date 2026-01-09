import { Weapon } from "./Weapon.js";

export class Pistol extends Weapon {
  constructor() {
    super({
      damage: 10,
      fireRate: 0.25,
      projectileSpeed: 1000,
      projectileRadius: 5,
      projectileColor: "yellow",
      range: 400,
    });
  }
}
