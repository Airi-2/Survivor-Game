import { Enemy } from "../entities/Enemy.js";

export class EnemySpawnSystem {
  constructor(audio) {
    this.audio = audio;

    this.spawnTimer = 0; // Таймер для обычных врагов
    this.waveTimer = 0; // Таймер для волн/толп
    this.waveInterval = 10; // Раз в 10 секунд — толпа

    // Начальные настройки
    this.baseInterval = 2.0; // Раз в 2 секунды
    // this.minInterval = 0.4; // Быстрее чем раз в 0.4с спавнить не будем
    this.baseHealth = 30; // Стартовое ХП врагов
    // this.baseDamage = 10; // Стартовый урон врагов
  }

  update(dt, entities, player, gameTime) {
    // Рассчитываем множитель сложности (растет каждые 30 секунд)
    // Например: на 2-й минуте difficulty будет 2.0
    const difficulty = 1 + gameTime / 60;

    // 1. ПОСТОЯННЫЙ СПАВН (ФОН)
    this.spawnTimer += dt;
    const currentInterval = Math.max(0.4, this.baseInterval / difficulty);

    if (this.spawnTimer >= currentInterval) {
      this.spawnSingleEnemy(entities, player, difficulty);
      this.spawnTimer = 0;
    }

    // 2. СПАВН ТОЛПЫ (WAVE)
    this.waveTimer += dt;
    if (this.waveTimer >= this.waveInterval) {
      // Количество врагов в толпе растет со сложностью
      const waveSize = Math.floor(5 * difficulty);
      this.spawnWave(entities, player, difficulty, waveSize);

      this.waveTimer = 0;
      // Можно проиграть особый звук или вывести надпись "WAVE INCOMING!"
      // this.audio.play("wave_start", 0.4);
    }
  }

  spawnSingleEnemy(entities, player, difficulty) {
    const pos = this.getRandomPosition(player, 400, 600);
    const health = this.baseHealth * difficulty;
    const enemy = new Enemy(pos.x, pos.y, 30, "red", 150, health, this.audio);
    enemy.contactDamage = Math.floor(10 * difficulty);
    entities.push(enemy);
  }

  spawnWave(entities, player, difficulty, count) {
    // Спавним группу врагов в одном секторе, чтобы они шли "пачкой"
    const angle = Math.random() * Math.PI * 2;
    const dist = 500;
    const centerX = player.x + Math.cos(angle) * dist;
    const centerY = player.y + Math.sin(angle) * dist;

    for (let i = 0; i < count; i++) {
      // Небольшой разброс внутри толпы
      const x = centerX + (Math.random() - 0.5) * 100;
      const y = centerY + (Math.random() - 0.5) * 100;

      const health = this.baseHealth * difficulty;
      const enemy = new Enemy(x, y, 30, "#ff4444", 160, health, this.audio); // Чуть быстрее
      enemy.contactDamage = Math.floor(10 * difficulty);
      entities.push(enemy);
    }
  }

  getRandomPosition(player, minDist, maxDist) {
    const angle = Math.random() * Math.PI * 2;
    const dist = minDist + Math.random() * (maxDist - minDist);
    return {
      x: player.x + Math.cos(angle) * dist,
      y: player.y + Math.sin(angle) * dist,
    };
  }

  reset() {
    this.spawnTimer = 0;
    this.waveTimer = 0;
  }
}
