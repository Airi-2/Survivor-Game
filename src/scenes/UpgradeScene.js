import { Scene } from "./Scene.js";
import { UpgradeScreen } from "../ui/UpgradeScreen.js";

export class UpgradeScene extends Scene {
  constructor(game, player, levelSystem, upgradeSystem) {
    super(game);

    this.player = player;
    this.levelSystem = levelSystem;
    this.upgradeSystem = upgradeSystem;

    this.options = this.upgradeSystem.getRandomUpgrades(3);
    this.screen = new UpgradeScreen(this.game, this.options); // Передаем game первым аргументом
  }

  update(dt) {
    const selected = this.screen.update(dt, this.game.input);

    if (selected) {
      selected.apply(this.player, this.levelSystem); // Передаем оба параметра
      this.game.input.clearAll(); // Очищаем ввод
      this.game.popScene(); // Закрываем экран выбора
    }
  }

  render(ctx) {
    // 1. Отрисовываем предыдущую сцену (PlayScene), чтобы она была видна на фоне
    const scenes = this.game.sceneStack; // Предполагаем, что у тебя массив scenes в Game
    if (scenes.length > 1) {
      scenes[scenes.length - 2].render(ctx);
    }

    // 2. Затем рисуем интерфейс выбора карточек
    this.screen.render(ctx, this.game.canvas);
  }
}
