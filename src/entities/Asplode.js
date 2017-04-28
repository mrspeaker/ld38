import pop from "../../pop";
const { Texture, TileSprite } = pop;

const texture = new Texture("res/images/asplode.png");

class Asplode extends TileSprite {
  constructor() {
    super(texture, 48, 48);
    this.life = 1.2;
  }

  update(dt, t) {
    this.frame.x = (t / 249 % 8) | 0;
    this.life -= dt;
    if (this.life < 0) {
      this.dead = true;
    }
  }
}

export default Asplode;
