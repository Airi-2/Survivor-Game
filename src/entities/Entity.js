export class Entity {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = { x: 0, y: 0 };

    // Флаг для удаления из игры (например, при смерти или попадании)
    this.toRemove = false;

    // Тип сущности, чтобы системы знали, как с ней работать
    this.type = "GENERIC";
  }

  // Общий метод отрисовки для всех кругов
  render(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}
