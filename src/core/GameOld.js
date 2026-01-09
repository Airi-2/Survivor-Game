import { GAME_STATE, WORLD } from "../config/constants.js";
import { World } from "./World.js";
import { Camera } from "./Camera.js";
import { Input } from "./Input.js";
import { AudioManager } from "./AudioManager.js";
import { GameTimer } from "./GameTimer.js";
import { Player } from "../entities/Player.js";
import { Pistol } from "../weapons/Pistol.js";
import { Shotgun } from "../weapons/Shotgun.js";
import { loadGameAudio } from "../config/audio.js";

// Системы
import { RenderSystem } from "../systems/RenderSystem.js";
import { ShootingSystem } from "../systems/ShootingSystem.js";
import { CollisionSystem } from "../systems/CollisionSystem.js";
import { EnemySpawnSystem } from "../systems/EnemySpawnSystem.js";
import { EnemyAISystem } from "../systems/EnemyAISystem.js";
import { DamageTextSystem } from "../systems/DamageTextSystem.js";
import { MovementSystem } from "../systems/MovementSystem.js";
import { LevelSystem } from "../systems/LevelSystem.js";
import { UpgradeSystem } from "../systems/UpgradeSystem.js";

// UI
import { MenuScreen } from "../ui/MenuScreen.js";
import { GameOverScreen } from "../ui/GameOverScreen.js";
import { HUD } from "../ui/HUD.js";
import { InputSystem } from "../systems/InputSystem.js";
import { UpgradeScreen } from "../ui/UpgradeScreen.js";

import { MainMenuScene } from "../scenes/MainMenuScene.js";

export class Game {
  constructor(ctx, canvas) {
    this.ctx = ctx;
    this.canvas = canvas;
    // this.GAME_STATE = GAME_STATE;
    // this.state = GAME_STATE.MENU;

    this.input = new Input(canvas);
    // this.audio = new AudioManager();
    // loadGameAudio(this.audio);
    // this.world = new World(WORLD.WIDTH, WORLD.HEIGHT);
    this.camera = new Camera(canvas.width, canvas.height, WORLD.WIDTH, WORLD.HEIGHT);
    // this.timeSurvival = new GameTimer();
    // this.focusPaused = false;

    this.sceneStack = [new MainMenuScene(this)];

    // this.initEntities();
    // this.initSystems();
    // this.initUI();
  }

  get currentScene() {
    return this.sceneStack[this.sceneStack.length - 1];
  }

  // Полная смена сцены (как и было)
  setScene(newScene) {
    this.sceneStack = [newScene];
  }

  // Наложить новую сцену сверху (для паузы)
  pushScene(newScene) {
    this.sceneStack.push(newScene);
  }

  // Убрать верхнюю сцену и вернуться к предыдущей
  popScene() {
    if (this.sceneStack.length > 1) {
      this.sceneStack.pop();
    }
  }

  initEntities() {
    this.player = new Player(this.world, this.audio);
    this.player.isPlayer = true;
    this.weapon = new Pistol();
    this.world.addEntity(this.player);
  }

  initSystems() {
    this.renderSystem = new RenderSystem(this.ctx, this.canvas);
    this.inputSystem = new InputSystem(this.input, this.player);
    this.movementSystem = new MovementSystem(this.world.width, this.world.height);
    this.shootingSystem = new ShootingSystem(this.camera, this.audio, this.weapon);
    this.damageTextSystem = new DamageTextSystem();
    this.collisionSystem = new CollisionSystem(this.audio, this.weapon, this.damageTextSystem);
    this.enemySpawnSystem = new EnemySpawnSystem(this.world, this.audio);
    this.enemyAISystem = new EnemyAISystem();
    this.levelSystem = new LevelSystem(this);
    this.upgradeSystem = new UpgradeSystem(this);
  }

  initUI() {
    this.menuScreen = new MenuScreen(this);
    this.gameOverScreen = new GameOverScreen(this);
    this.hud = new HUD(this);
    this.upgradeScreen = new UpgradeScreen(this);
  }

  update(dt) {
    this.currentScene.update(dt);
  }

  render(alpha) {
    this.currentScene.render(this.ctx);
  }

  // update(dt) {
  //   switch (this.state) {
  //     case GAME_STATE.MENU:
  //       this.menuScreen.update();
  //       break;
  //     case GAME_STATE.GAMEOVER:
  //       this.gameOverScreen.update();
  //       break;
  //     case GAME_STATE.PAUSED:
  //       if (this.input.wasPressed("Escape")) this.resume();
  //       break;
  //     case GAME_STATE.PLAYING:
  //       this.updatePlaying(dt);
  //       break;
  //     case GAME_STATE.UPGRADE:
  //       this.upgradeScreen.update(dt);
  //       break;
  //   }
  //   this.input.endFrame();
  // }

  updatePlaying(dt) {
    if (this.input.wasPressed("Escape")) return this.pause();
    if (this.isPaused) return;

    this.timeSurvival.update(dt);

    // Системы
    this.inputSystem.update(this.world.entities, dt);
    this.enemySpawnSystem.update(dt, this.world.entities, this.player, this.timeSurvival.elapsed);
    this.shootingSystem.update(dt, this.input, this.player, this.world.entities);
    this.enemyAISystem.update(dt, this.world.entities, this.player);
    this.movementSystem.update(this.world.entities, dt);
    this.collisionSystem.update(this.world.entities, this.player, this.world);
    this.damageTextSystem.update(dt);
    this.levelSystem.update(dt, this.player, this.world.entities);

    this.world.update(dt); // Обновление сущностей и очистка
    this.camera.update(this.player);

    if (this.player.health <= 0) this.state = GAME_STATE.GAMEOVER;
  }

  // render() {
  //   this.renderSystem.render(this);
  // }

  // Новые методы управления

  resumeAfterUpgrade() {
    this.state = GAME_STATE.PLAYING;
    this.timeSurvival.start();
    this.input.clearAll(); // Очищаем клик, чтобы не выстрелить сразу
  }

  // --- Контроль состояний ---
  get isPaused() {
    return this.state === GAME_STATE.PAUSED || this.focusPaused;
  }

  startGame() {
    this.state = GAME_STATE.PLAYING;
    this.timeSurvival.start();
    this.audio.playLoop("background1", 0.7);
  }

  pause() {
    if (this.state !== GAME_STATE.PLAYING) return;
    this.state = GAME_STATE.PAUSED;
    this.timeSurvival.stop();
  }

  resume() {
    this.state = GAME_STATE.PLAYING;
    this.focusPaused = false;
    this.timeSurvival.start();
  }

  restart() {
    this.world.clear();
    this.initEntities();
    this.enemySpawnSystem.reset();
    this.timeSurvival = new GameTimer(); // Сброс таймера
    this.startGame();
  }
}
