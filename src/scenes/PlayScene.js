import { Scene } from "./Scene.js";
import { MainMenuScene } from "./MainMenuScene.js";
// import { PauseScene } from "./PauseScene.js";

// Импортируем твои сущности и системы
import { Player } from "../entities/Player.js";
import { MovementSystem } from "../systems/MovementSystem.js";
import { CollisionSystem } from "../systems/CollisionSystem.js";
import { RenderSystem } from "../systems/RenderSystem.js";
import { HUD } from "../ui/HUD.js";
import { Camera } from "../core/Camera.js";
import { World } from "../core/World.js";
import { WORLD } from "../config/constants.js";
import { GameTimer } from "../core/GameTimer.js";
import { Pistol } from "../weapons/Pistol.js";
import { Shotgun } from "../weapons/Shotgun.js";
import { InputSystem } from "../systems/InputSystem.js";
import { ShootingSystem } from "../systems/ShootingSystem.js";
import { EnemySpawnSystem } from "../systems/EnemySpawnSystem.js";
import { DamageTextSystem } from "../systems/DamageTextSystem.js";
import { EnemyAISystem } from "../systems/EnemyAISystem.js";
import { LevelSystem } from "../systems/LevelSystem.js";
import { UpgradeSystem } from "../systems/UpgradeSystem.js";
import { UpgradeScene } from "./UpgradeScene.js";

export class PlayScene extends Scene {
  constructor(game, config) {
    super(game);
    this.config = config; // Содержит { hero, weapon }

    // Хранилища
    this.systems = [];

    this.player = null;
    this.world = new World(WORLD.TILE_SIZE);
    this.camera = new Camera(this.game.canvas.width, this.game.canvas.height);
    this.gameTimer = new GameTimer();

    this.init();
  }

  init() {
    // 1. Определяем, какое оружие создать
    let selectedWeapon;
    if (this.config.weapon.id === "pistol") {
      selectedWeapon = new Pistol();
    } else if (this.config.weapon.id === "shotgun") {
      selectedWeapon = new Shotgun();
    }

    // 2. Создаем игрока
    // Передаем объект настроек и отдельно аудио-менеджер из game
    this.player = new Player(
      {
        x: this.world.tileSize / 2,
        y: this.world.tileSize / 2,
        name: this.config.hero.name,
        color: this.config.hero.color,
        health: this.config.hero.id === "tank" ? 200 : 100,
        weapon: selectedWeapon,
      },
      this.game.audio
    );

    this.world.entities.push(this.player);

    // 2. Инициализируем системы
    // this.movementSystem = new MovementSystem(this.world.width, this.world.height);
    this.movementSystem = new MovementSystem();
    this.renderSystem = new RenderSystem(this.game.ctx, this.game.canvas);
    this.inputSystem = new InputSystem();
    this.shootingSystem = new ShootingSystem();
    this.enemySpawnSystem = new EnemySpawnSystem(this.game.audio);
    this.damageTextSystem = new DamageTextSystem();
    this.collisionSystem = new CollisionSystem(this.game.audio, this.player.weapon, this.damageTextSystem);
    this.enemyAISystem = new EnemyAISystem();
    this.levelSystem = new LevelSystem(this.game);
    this.upgradeSystem = new UpgradeSystem(this.game);

    // 3. Инициализируем UI
    this.hud = new HUD(this.game.canvas.width, this.game.canvas.height);

    this.onLevelUp = () => {
      this.game.pushScene(new UpgradeScene(this.game, this.player, this.levelSystem, this.upgradeSystem));
    };

    this.game.events.on("LEVEL_UP", this.onLevelUp);

    this.game.audio.playLoop("background1", 0.7);
    this.gameTimer.start();
  }

  update(dt) {
    // Пауза
    if (this.game.input.wasPressed("Escape")) {
      this.game.pushScene(new PauseScene(this.game));
      return;
    }

    // 1. Сначала превращаем кнопки в скорость игрока
    this.gameTimer.update(dt);

    this.inputSystem.update(this.player, this.game.input, dt);

    // 2. Двигаем ВСЕ сущности (включая игрока, у которого теперь есть скорость)
    this.movementSystem.update(this.world.entities, dt);

    // Вызываем стрельбу
    this.shootingSystem.update(dt, this.game.input, this.player, this.world.entities, this.camera, this.game.audio);

    this.enemySpawnSystem.update(dt, this.world.entities, this.player, this.gameTimer.elapsed);
    this.enemyAISystem.update(dt, this.world.entities, this.player);

    this.collisionSystem.update(this.world.entities, this.player, this.world);

    // ОБНОВЛЕНИЕ ТЕКСТА
    this.damageTextSystem.update(dt);
    this.levelSystem.update(dt, this.player, this.world.entities);

    for (const entity of this.world.entities) {
      if (entity.update) {
        entity.update(dt);
      }
    }

    this.world.entities = this.world.entities.filter((e) => !e.toRemove);

    this.camera.update(this.player);

    // Здесь же можно добавить спавн врагов или проверку условий победы/проигрыша
  }

  render(ctx) {
    // 1. Очистка экрана (хотя Game.loop может это делать за нас)
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);

    // 2. Отрисовка игрового мира через RenderSystem
    this.renderSystem.render(this.world.entities, this.camera, this.world);

    // ОТРИСОВКА ТЕКСТА (Важно: текст должен учитывать камеру!)
    // Если DamageTextSystem.render просто использует ctx.fillText(x, y),
    // он не будет следовать за камерой.
    this.damageTextSystem.render(ctx, this.camera);

    // 3. Отрисовка интерфейса поверх игры
    this.hud.render(ctx, this.player, this.gameTimer, this.levelSystem);
  }

  // Метод, который вызовется, когда сцена полностью удаляется
  exit() {
    this.game.events.off("LEVEL_UP", this.onLevelUp);

    // Останавливаем музыку, чтобы она не накладывалась в следующей сцене
    this.game.audio.stop("background1");

    // Останавливаем таймер
    this.gameTimer.stop();
  }
}
