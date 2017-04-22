class Sprite {
  constructor(texture) {
    this.texture = texture;
    this.pos = { x: 0, y: 0 };
    this.scale = { x: 1, y: 1 };
    this.pivot = { x: 0, y: 0 };
    this.rotation = 0;
  }

  get w() {
    return this.texture.img.width * Math.abs(this.scale.x);
  }

  get h() {
    return this.texture.img.height * Math.abs(this.scale.y);
  }
}

export default Sprite;
