class Timers {
  constructor () {
    this.timers = [];
    this.time = 0;
  }

  add(cb) {
    this.timers.push({cb});
  }

  wait(time, cb) {
    this.timers.push({cb, time: this.time + time});
  }

  update(dt, t) {
    this.timers = this.timers.filter(({cb, time}) => {
      if (!time) cb(dt, t);
      return true;
    });
    this.time += dt;
  }

  clear() {
    this.timers = [];
  }
}

export default new Timers();
