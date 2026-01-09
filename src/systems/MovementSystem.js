import { clamp } from "../utils/Vector2.js";

export class MovementSystem {
  // constructor(width, height) {
  //   this.width = width;
  //   this.height = height;
  // }

  update(entities, dt) {
    for (const e of entities) {
      if (!e.velocity) continue;

      e.x += e.velocity.x * dt;
      e.y += e.velocity.y * dt;

      // if (e.type === "PLAYER") {
      //   // Игрока ограничиваем
      //   e.x = clamp(e.x, 0, this.width, e.radius);
      //   e.y = clamp(e.y, 0, this.height, e.radius);
      // } else {
      //   // Остальные сущности (пули) помечаем на удаление, если вышли за границы
      //   if (e.x < 0 || e.x > this.width || e.y < 0 || e.y > this.height) {
      //     e.toRemove = true;
      //   }
      // }
    }
  }
}
