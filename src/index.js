import { CANVAS } from "./config/constants.js";
import { Game } from "./core/Game.js";
import { GameLoop } from "./core/GameLoop.js";

const canvas = document.getElementById("game");
canvas.width = CANVAS.WIDTH;
canvas.height = CANVAS.HEIGHT;

const ctx = canvas.getContext("2d");
const game = new Game(ctx, canvas);

const gameLoop = new GameLoop(
  (dt) => game.update(dt),
  (alpha) => game.render(alpha)
);

gameLoop.start();
