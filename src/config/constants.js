// Canvas размеры
export const CANVAS = {
  WIDTH: 1280,
  HEIGHT: 720,
};

// Игровой цикл - FIXED TIMESTEP с ACCUMULATOR
export const GAME_LOOP = {
  // Фиксированный timestep: 1/60 секунды = 16.67 ms
  // Это значит, что физика и логика обновляются 60 раз в секунду
  FIXED_TIMESTEP: 1 / 60,
  
  // Максимальное количество фиксированных шагов в одном кадре
  // (защита от "спирали смерти" если фреймрейт падает)
  MAX_STEPS: 5,
};

export const PLAYER = {
  RADIUS: 20,
  COLOR: "#008800",
  SPEED: 300,
}