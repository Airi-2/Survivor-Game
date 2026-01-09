export class DamageText {
  constructor(x, y, amount, isCrit = false) {
    this.x = x;
    this.y = y;
    this.amount = amount;
    this.isCrit = isCrit;

    this.lifetime = 1; // сколько секунд будет виден текст
    this.timer = 0;

    // случайный небольшой сдвиг по x/y, чтобы цифры не накладывались
    this.offsetX = (Math.random() - 0.5) * 20;
    this.offsetY = (Math.random() - 0.5) * 10;

    this.vy = -30; // скорость поднятия текста
    this.alpha = 1; // прозрачность
  }

  update(dt) {
    this.timer += dt;

    // плавное исчезновение
    this.alpha = Math.max(0, 1 - this.timer / this.lifetime);

    // движение вверх
    this.y += this.vy * dt; // <-- используй vy, а не velocityY
  }

  render(ctx, camera) {
    ctx.save();
    ctx.fillStyle = `rgba(255, 255, 0, ${this.alpha})`;
    ctx.font = "20px sans-serif";

    // Вычитаем координаты камеры, чтобы текст был привязан к точке в мире
    const screenX = this.x + this.offsetX - camera.x;
    const screenY = this.y + this.offsetY - camera.y;

    ctx.fillText(this.amount, screenX, screenY);
    ctx.restore();
  }

  get isDead() {
    return this.timer >= this.lifetime;
  }
}
