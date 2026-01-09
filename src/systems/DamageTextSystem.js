import { DamageText } from "../entities/DamageText.js";

export class DamageTextSystem {
  constructor() {
    this.damageTexts = [];
  }

  addDamage(x, y, amount) {
    this.damageTexts.push(new DamageText(x, y, amount));
  }

  update(dt) {
    for (const text of this.damageTexts) {
      text.update(dt);
    }
    // удаляем "мертвые" тексты
    this.damageTexts = this.damageTexts.filter((t) => !t.isDead);
  }

  render(ctx, camera) {
    for (const text of this.damageTexts) {
      text.render(ctx, camera);
    }
  }
}
