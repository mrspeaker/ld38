class Timers {
  constructor () {
    this.timers = [];
  }

  add(timer) {
    this.timers.push(timer);
  }

  update(dt, t) {
    this.timers.forEach(timer => timer(dt, t));
  }
}

export default Timers;
