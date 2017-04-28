import Container from "./Container";

class Sprite extends Container {
  constructor(texture) {
    super();
    this.texture = texture;
  }

  get w() {
    // Should be this.hitBox || this.texture...
    return this.texture.img.width * Math.abs(this.scale.x);
  }

  get h() {
    return this.texture.img.height * Math.abs(this.scale.y);
  }
}

export default Sprite;
