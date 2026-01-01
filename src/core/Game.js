import { Player } from "../entities/Player.js";
import { InputSystem } from "../systems/InputSystem.js";
import { MovementSystem } from "../systems/MovementSystem.js";
import { Input } from "../core/Input.js";
import { GAME_STATE, WORLD } from "../config/constants.js";
import { Camera } from "./Camera.js";
import { ShootingSystem } from "../systems/ShootingSystem.js";
import { CollisionSystem } from "../systems/CollisionSystem.js";
import { Enemy } from "../entities/Enemy.js";
export class Game {
  constructor(ctx, canvas) {
    this.ctx = ctx;
    this.canvas = canvas;

    this.worldSize = { width: WORLD.WIDTH, height: WORLD.HEIGHT };

    // 1. Камера
    this.camera = new Camera(
      this.canvas.width,
      this.canvas.height,
      this.worldSize.width,
      this.worldSize.height
    );

    this.state = GAME_STATE.PLAYING;

    // 2. Создаем игрока и помечаем его, чтобы MovementSystem знала, кого "клэмпить" (ограничивать)
    this.player = new Player(this.worldSize);
    this.player.isPlayer = true;

    // 3. Системы
    this.input = new Input(this.canvas);
    this.inputSystem = new InputSystem(this.input, this.player);
    this.movementSystem = new MovementSystem(
      this.worldSize.width,
      this.worldSize.height
    );
    this.shootingSystem = new ShootingSystem(this.camera);
    this.collisionSystem = new CollisionSystem();

    this.enemyTimer = 0;
    this.enemySpawnInterval = 2; // спавн каждые 2 секунды

    // 4. Единый список сущностей для всех систем
    this.entities = [this.player];

    this.userPaused = false;
    this.focusPaused = false;
  }

  get isPaused() {
    return (
      this.state === GAME_STATE.PAUSED || this.userPaused || this.focusPaused
    );
  }

  update(dt) {
    this.handleGlobalInput();
    if (this.isPaused) return;

    // 1. Спавн врагов
    this.spawnEnemies(dt);

    // 2. Обновление систем
    this.inputSystem.update(this.entities, dt);
    this.shootingSystem.update(dt, this.input, this.player, this.entities);

    // 3. Заставляем врагов бежать к игроку
    this.entities.forEach((e) => {
      if (e instanceof Enemy) e.update(dt, this.player);
    });

    this.movementSystem.update(this.entities, dt);

    // 4. Проверка столкновений
    this.collisionSystem.update(this.entities);

    this.cleanupEntities();
    this.camera.update(this.player);
    this.input.endFrame();
  }

  spawnEnemies(dt) {
    this.enemyTimer += dt;
    if (this.enemyTimer >= this.enemySpawnInterval) {
      // Генерируем случайные координаты (например, по краям мира)
      const x = Math.random() * this.worldSize.width;
      const y = Math.random() * this.worldSize.height;

      // Чтобы враг не появился прямо в игроке:
      const distToPlayer = Math.hypot(x - this.player.x, y - this.player.y);
      if (distToPlayer > 300) {
        const enemy = new Enemy(x, y, 20, "red", 150);
        this.entities.push(enemy);
        this.enemyTimer = 0;
      }
    }
  }

  handleGlobalInput() {
    if (this.input.wasPressed("Escape")) {
      this.isPaused ? this.resume() : this.pause();
    }
  }

  cleanupEntities() {
    // Оставляем только те, у кого toRemove === false
    this.entities = this.entities.filter((e) => !e.toRemove);
  }

  pause() {
    this.state = GAME_STATE.PAUSED;
    this.input.clearAll(); // Очищаем клавиши, чтобы игрок не "бежал" в паузе
  }

  resume() {
    this.state = GAME_STATE.PLAYING;
    this.focusPaused = false; // Сбрасываем флаг фокуса при ручном возобновлении
  }

  render(alpha) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.save(); // Сохраняем состояние контекста
    // Сдвигаем весь мир в обратную сторону от камеры
    this.ctx.translate(-this.camera.x, -this.camera.y);

    // РИСУЕМ МИР (например, фон игрового мира)
    this.ctx.fillStyle = "#1a1a1a";
    this.ctx.fillRect(0, 0, this.worldSize.width, this.worldSize.height);

    // РИСУЕМ ВСЕ СУЩНОСТИ
    for (const entity of this.entities) {
      entity.render(this.ctx);
    }

    this.ctx.restore(); // Возвращаем контекст в исходное состояние

    // РИСУЕМ ПАУЗУ ПОВЕРХ ВСЕГО (в координатах экрана)
    if (this.isPaused) {
      this.renderPauseOverlay();
    }
  }

  renderPauseOverlay() {
    // Затемнение всего экрана
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Текст
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "center";
    this.ctx.font = "bold 48px sans-serif";
    this.ctx.fillText("PAUSED", this.canvas.width / 2, this.canvas.height / 2);

    this.ctx.font = "20px sans-serif";
    this.ctx.fillText(
      "Press ESC to Resume",
      this.canvas.width / 2,
      this.canvas.height / 2 + 50
    );
  }
}
