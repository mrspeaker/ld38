import Sprite from "../Sprite";

class Particle extends Sprite {
  constructor(texture, onDone) {
    super(texture);
    this.life = 2;
    this.xs = 0;
    this.ys = 0;
    this.onDone = onDone;
  }

  update(dt) {
    const { xs, ys, pos } = this;
    pos.x += xs * dt;
    pos.y -= ys * dt;
    this.life -= dt;
    if (this.life <= 0) {
      this.onDone(this);
    }
    this.alpha = this.life;
  }
}

export default Particle;
