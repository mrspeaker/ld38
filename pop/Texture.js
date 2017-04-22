import Assets from "./Assets";

class Texture {
  constructor(url) {
    this.img = Assets.image(url);
  }
}

export default Texture;
