import { loadGameAudio } from "../config/audio.js";
import { MainMenuScene } from "../scenes/MainMenuScene.js";
import { AudioManager } from "./AudioManager.js";
import { Input } from "./Input.js";
import { EventBus } from "./EventBus.js";

export class Game {
  constructor(ctx, canvas) {
    this.ctx = ctx;
    this.canvas = canvas;

    // Глобальные менеджеры
    this.input = new Input(canvas);
    this.audio = new AudioManager();
    loadGameAudio(this.audio);

    this.events = new EventBus(); // ← ВАЖНО
    // Стек сцен (начинаем с меню)
    this.sceneStack = [new MainMenuScene(this)];
  }

  get currentScene() {
    return this.sceneStack[this.sceneStack.length - 1];
  }

  setScene(newScene) {
    // Если нужно, вызываем .exit() у старой сцены
    this.sceneStack = [newScene];
  }

  pushScene(newScene) {
    this.sceneStack.push(newScene);
  }

  popScene() {
    if (this.sceneStack.length > 1) this.sceneStack.pop();
  }

  update(dt) {
    // Обновляем только текущую активную сцену
    this.currentScene.update(dt);

    // Ввод очищается здесь, так как он глобальный
    this.input.endFrame();
  }

  render() {
    // Рендер текущей сцены
    this.currentScene.render(this.ctx);
  }
}
