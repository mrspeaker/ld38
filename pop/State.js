class State {
  last = "";
  stateTime = Date.now();
  isNewState = false;

  constructor (state) {
    this.state = state;
  }

  set (state) {
    this.last = this.state;
    this.state = state;
    this.stateTime = Date.now();
    this.isNewState = true;
  }

  get () {
    return this.state;
  }

  is (state) {
    return state === this.state;
  }

  isIn (...args) {
    const {state} = this;
    return args.some(s => s === state);
  }

  time () {
    return Date.now() - this.stateTime;
  }

}

export default State;
