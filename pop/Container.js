import Sprite from "./Sprite";
import Texture from "./Texture";
import TileSprite from "./TileSprite";

class Container {
  constructor() {
    this.pos = { x: 0, y: 0 };
    this.children = [];
  }

  add(child) {
    this.children.push(child);
    return child;
  }

  remove(child) {
    this.children = this.children.filter(c => c !== child);
    return child;
  }

  map(f) {
    return this.children.map(f);
  }

  update(dt, t) {
    this.children = this.children.filter(child => {
      if (child.update) {
        child.update(dt, t, this);
      }
      return child.dead ? false : true;
    });
  }

  get make() {
    return {
      sprite: path => this.add(
        new Sprite(new Texture(path))
      ),
      tileSprite: (path, w, h) => {
        return this.add(
          new TileSprite(new Texture(path), w, h)
        );
      }
    };
  }
}

export default Container;
