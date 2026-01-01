export class Time {
  constructor() {
    this.last = performance.now();
  }

  reset() {
    this.last = performance.now();
  }

  getDelta(now) {
    let dt = (now - this.last) / 1000;
    this.last = now;

    if (dt > 0.25) dt = 0.25;
    return dt;
  }
}
