import Assets from "./Assets";

class Texture {
  constructor(url) {
    this.img = typeof url === "string" ? Assets.image(url) : url;
  }
}

export default Texture;
