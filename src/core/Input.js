export class Input {
  constructor(canvas) {
    this.keys = new Set();
    this.justPressed = new Set();
    this.mouse = { x: 0, y: 0, pressed: false };

    window.addEventListener("keydown", (e) => {
      if (!this.keys.has(e.code)) {
        this.justPressed.add(e.code);
      }
      this.keys.add(e.code);
    });

    window.addEventListener("keyup", (e) => this.keys.delete(e.code));

    // КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ:
    window.addEventListener("blur", () => {
      this.clearAll();
    });

    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener("mousedown", () => (this.mouse.pressed = true));
    canvas.addEventListener("mouseup", () => (this.mouse.pressed = false));
  }

  // Метод для полной очистки состояния ввода
  clearAll() {
    this.keys.clear();
    this.justPressed.clear();
    this.mouse.pressed = false;
  }

  isDown(code) {
    return this.keys.has(code);
  }

  wasPressed(code) {
    return this.justPressed.has(code);
  }

  endFrame() {
    this.justPressed.clear();
  }
}
