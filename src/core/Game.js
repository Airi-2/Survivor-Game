import { GAME_STATE, WORLD } from "../config/constants.js";
import { Camera } from "./Camera.js";
import { Input } from "./Input.js";
import { AudioManager } from "./AudioManager.js";
import { loadGameAudio } from "../config/audio.js";

import { Player } from "../entities/Player.js";

import { InputSystem } from "../systems/InputSystem.js";
import { MovementSystem } from "../systems/MovementSystem.js";
import { ShootingSystem } from "../systems/ShootingSystem.js";
import { CollisionSystem } from "../systems/CollisionSystem.js";
import { EnemySpawnSystem } from "../systems/EnemySpawnSystem.js";
import { EnemyAISystem } from "../systems/EnemyAISystem.js";
import { DamageTextSystem } from "../systems/DamageTextSystem.js";

import { MenuScreen } from "../ui/MenuScreen.js";
import { GameOverScreen } from "../ui/GameOverScreen.js";
import { GameTimer } from "./GameTimer.js";
import { HUD } from "../ui/HUD.js";
import { Pistol } from "../weapons/Pistol.js";
import { Shotgun } from "../weapons/Shotgun.js";

export class Game {
  constructor(ctx, canvas) {
    this.ctx = ctx;
    this.canvas = canvas;

    this.state = GAME_STATE.MENU;
    this.worldSize = { width: WORLD.WIDTH, height: WORLD.HEIGHT };

    // --- Core ---
    this.input = new Input(canvas);
    this.audio = new AudioManager();
    loadGameAudio(this.audio);

    this.camera = new Camera(
      canvas.width,
      canvas.height,
      this.worldSize.width,
      this.worldSize.height
    );

    // --- Entities ---
    this.player = new Player(this.worldSize, this.audio);
    this.player.isPlayer = true;
    this.entities = [this.player];

    this.weapon = new Shotgun();

    // --- Systems ---
    this.inputSystem = new InputSystem(this.input, this.player);
    this.movementSystem = new MovementSystem(
      this.worldSize.width,
      this.worldSize.height
    );
    this.shootingSystem = new ShootingSystem(
      this.camera,
      this.audio,
      this.weapon
    );
    this.damageTextSystem = new DamageTextSystem();
    this.collisionSystem = new CollisionSystem(
      this.audio,
      this.weapon,
      this.damageTextSystem
    );
    this.enemySpawnSystem = new EnemySpawnSystem(this.worldSize, this.audio);
    this.enemyAISystem = new EnemyAISystem();

    // --- UI / Screens ---
    this.menuScreen = new MenuScreen(this);
    this.gameOverScreen = new GameOverScreen(this);
    this.timeSurvival = new GameTimer();
    this.hud = new HUD(this);

    this.focusPaused = false;
  }

  update(dt) {
    switch (this.state) {
      case GAME_STATE.MENU:
        this.menuScreen.update();
        break;

      case GAME_STATE.PAUSED:
        if (this.input.wasPressed("Escape")) {
          this.resume();
        }
        break;

      case GAME_STATE.GAMEOVER:
        this.gameOverScreen.update();
        break;

      case GAME_STATE.PLAYING:
        this.updatePlaying(dt);
        break;
    }

    this.input.endFrame();
  }

  updatePlaying(dt) {
    if (this.input.wasPressed("Escape")) {
      this.pause();
      return;
    }

    if (this.isPaused) return;

    this.timeSurvival.update(dt);

    this.enemySpawnSystem.update(dt, this.entities, this.player);

    this.inputSystem.update(this.entities, dt);
    this.shootingSystem.update(dt, this.input, this.player, this.entities);

    this.player.update(dt);
    this.enemyAISystem.update(dt, this.entities, this.player);
    this.movementSystem.update(this.entities, dt);
    this.collisionSystem.update(this.entities, this.player);
    this.damageTextSystem.update(dt);

    for (const entity of this.entities) {
      if (entity.update) {
        entity.update(dt);
      }
    }

    if (this.player.health <= 0) {
      this.state = GAME_STATE.GAMEOVER;
    }

    this.cleanupEntities();
    this.camera.update(this.player);
  }

  /* ================= RENDER ================= */

  render(alpha) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    switch (this.state) {
      case GAME_STATE.MENU:
        this.menuScreen.render(this.ctx, this.canvas);
        return;

      case GAME_STATE.GAMEOVER:
        this.gameOverScreen.render(this.ctx, this.canvas);
        return;
    }

    // --- World ---
    this.ctx.save();
    this.ctx.translate(-this.camera.x, -this.camera.y);

    this.hud.render(this.ctx);

    this.ctx.fillStyle = "#1a1a1a";
    this.ctx.fillRect(0, 0, this.worldSize.width, this.worldSize.height);

    for (const entity of this.entities) {
      entity.render(this.ctx);
    }

    // Рисуем цифры урона поверх сущностей
    this.damageTextSystem.render(this.ctx);

    this.ctx.restore();

    // --- UI ---
    this.hud.render(this.ctx);

    if (this.isPaused) {
      this.renderPauseOverlay();
    }
  }

  /* ================= STATE ================= */

  get isPaused() {
    return this.state === GAME_STATE.PAUSED || this.focusPaused;
  }

  startGame() {
    this.state = GAME_STATE.PLAYING;
    this.input.clearAll();
    this.timeSurvival.start();
    this.audio.playLoop("background1", 0.7);
  }

  restart() {
    this.player = new Player(this.worldSize, this.audio);
    this.player.isPlayer = true;
    this.entities = [this.player];

    this.inputSystem.player = this.player;
    this.enemySpawnSystem.reset();

    this.state = GAME_STATE.PLAYING;
    this.input.clearAll();
  }

  pause() {
    this.state = GAME_STATE.PAUSED;
    this.timeSurvival.stop();
    this.input.clearAll();
  }

  resume() {
    this.state = GAME_STATE.PLAYING;
    this.focusPaused = false;
    this.timeSurvival.start();
  }

  cleanupEntities() {
    this.entities = this.entities.filter((e) => !e.toRemove);
  }

  renderPauseOverlay() {
    const ctx = this.ctx;
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "bold 48px sans-serif";
    ctx.fillText("PAUSED", this.canvas.width / 2, this.canvas.height / 2);
  }
}
