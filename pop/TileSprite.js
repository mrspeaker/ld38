import Sprite from "./Sprite";

class TileSprite extends Sprite {
  frame = { x: 0, y: 0 };
  constructor (texture, w, h) {
    super(texture);
    this.tileW = w;
    this.tileH = h;
  }

  get w () {
    return this.tileW * Math.abs(this.scale.x);
  }

  get h () {
    return this.tileH * Math.abs(this.scale.y);
  }
}

export default TileSprite;
