export class World {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.entities = [];
  }

  addEntity(entity) {
    this.entities.push(entity);
  }

  update(dt) {
    for (const entity of this.entities) {
      if (entity.update) entity.update(dt);
    }
    this.cleanup();
  }

  cleanup() {
    this.entities = this.entities.filter((e) => !e.toRemove);
  }

  clear() {
    this.entities = [];
  }
}
