export class Camera {
  constructor(viewWidth, viewHeight, worldWidth, worldHeight) {
    this.viewWidth = viewWidth;
    this.viewHeight = viewHeight;
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
    this.x = 0;
    this.y = 0;
  }

  update(target) {
    this.x = target.x - this.viewWidth / 2;
    this.y = target.y - this.viewHeight / 2;
  }

  
}
