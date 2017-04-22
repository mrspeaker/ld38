class TwinStickControls {

  _keys = {};

  constructor () {

    // Bind event handlers
    document.addEventListener("keydown", e => {
      if ([37,38,39,40,32].indexOf(e.which) >= 0) {
        e.preventDefault();
      }
      this._keys[e.which] = true;
    }, false);

    document.addEventListener("keyup", e => {
      this._keys[e.which] = false;
    }, false);

  }

  // Handle key actions
  action () {
    return this._keys[32];
  }

  reset () {
    this._keys[32] = false;
    for (let key in this._keys) {
      this._keys[key] = false;
    }
  }

  x () {
    if (this._keys[37]) {
      return -1;
    }
    if (this._keys[39]) {
      return 1;
    }
    return 0;
  }

  y () {
    if (this._keys[38]) {
      return -1;
    }
    if (this._keys[40]) {
      return 1;
    }
    return 0;
  }

  fireX () {
    if (this._keys[65]) {
      return -1;
    }
    if (this._keys[68]) {
      return 1;
    }
    return 0;
  }

  fireY () {
    if (this._keys[87]) {
      return -1;
    }
    if (this._keys[83]) {
      return 1;
    }
  }

  key (keyCode) {
    return this._keys[keyCode];
  }

  unset (keyCode) {
    this._keys[keyCode] = false;
  }

}

export default TwinStickControls;
