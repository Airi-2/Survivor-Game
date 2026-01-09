export class RenderSystem {
  constructor(ctx, canvas) {
    this.ctx = ctx;
    this.canvas = canvas;
  }

  // Принимаем только то, что относится к игровому миру
  render(entities, camera, world) {
    const ctx = this.ctx;
    const tileSize = world.tileSize || 512;

    // Определяем начальную точку отрисовки тайлов
    // Мы берем координату камеры и "округляем" её до размера тайла
    const startX = Math.floor(camera.x / tileSize) * tileSize;
    const startY = Math.floor(camera.y / tileSize) * tileSize;

    // Рисуем сетку тайлов, захватывая чуть больше области, чем видит камера
    for (let x = startX - tileSize; x < startX + this.canvas.width + tileSize; x += tileSize) {
      for (let y = startY - tileSize; y < startY + this.canvas.height + tileSize; y += tileSize) {
        // Переводим мировые координаты в экранные
        const screenX = x - camera.x;
        const screenY = y - camera.y;

        // Рисуем плитку (можно просто чередовать цвета для эффекта шахматки)
        ctx.fillStyle = (Math.abs(x + y) / tileSize) % 2 === 0 ? "#1a1a1a" : "#222";
        ctx.fillRect(screenX, screenY, tileSize, tileSize);

        // Если есть текстура: ctx.drawImage(tileImage, screenX, screenY, tileSize, tileSize);
      }
    }
    ctx.restore();

    // 2. Рисуем сущности
    ctx.save();
    ctx.translate(-camera.x, -camera.y);
    for (const entity of entities) {
      if (entity.render) entity.render(ctx);
    }
    ctx.restore();
  }
}
