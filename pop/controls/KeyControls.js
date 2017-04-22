class KeyControls {
  constructor() {
    this.keys = {};

    // Bind event handlers
    document.addEventListener("keydown", e => {
      if ([37, 38, 39, 40, 32].indexOf(e.which) >= 0) {
        e.preventDefault();
      }
      this.keys[e.which] = true;
    }, false);

    document.addEventListener("keyup", e => {
      this.keys[e.which] = false;
    }, false);
  }

  // Handle key actions
  get action() {
    return this.keys[32];
  }

  reset() {
    this.keys[32] = false;
    for (var key in this.keys) {
      this.keys[key] = false;
    }
  }

  get x() {
    if (this.keys[37] || this.keys[65]) {
      return -1;
    }
    if (this.keys[39] || this.keys[68]) {
      return 1;
    }
    return 0;
  }

  get y() {
    if (this.keys[38] || this.keys[87]) {
      return -1;
    }
    if (this.keys[40] || this.keys[83]) {
      return 1;
    }
    return 0;
  }

  key(keyCode) {
    return this.keys[keyCode];
  }

  unset(keyCode) {
    this.keys[keyCode] = false;
  }

}

export default KeyControls;
