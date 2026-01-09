export class Camera {
  constructor(viewWidth, viewHeight) {
    this.viewWidth = viewWidth;
    this.viewHeight = viewHeight;
    this.x = 0;
    this.y = 0;
  }

  update(target) {
    this.x = target.x - this.viewWidth / 2;
    this.y = target.y - this.viewHeight / 2;
  }
}
