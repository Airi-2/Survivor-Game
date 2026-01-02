export class AudioManager {
  constructor() {
    this.sounds = {};
  }

  // Предзагрузка звуков
  load(name, src) {
    const audio = new Audio(src);
    this.sounds[name] = audio;
  }

  play(name, volume = 0.5) {
    const sound = this.sounds[name];
    if (sound) {
      // Клонируем узел, чтобы звуки могли накладываться друг на друга
      const click = sound.cloneNode();
      click.volume = volume;
      click
        .play()
        .catch((e) => console.warn("Звук заблокирован браузером. Нужен клик!"));
    }
  }

  playLoop(name, volume = 0.5) {
    const sound = this.sounds[name];
    if (sound) {
      sound.loop = true;
      sound.volume = volume;
      sound.play().catch(() => {});
    }
  }
}
