import Container from "../Container";
import Particle from "./Particle";
import Texture from "../Texture";
import math from "../utils/math";

class Particles extends Container {
  constructor(texture) {
    super();
    if (!texture) {
      const p = document.createElement("canvas");
      p.width = 3;
      p.height = 3;
      const c = p.getContext("2d");
      c.fillStyle = "white";
      c.fillRect(0, 0, p.width, p.height);
      texture = new Texture(p);
    }
    for (let i = 0; i < 30; i++) {
      const p = this.add(new Particle(texture, p => p.dead = true));
      this.resetParticle(p);
    }
  }

  resetParticle(p) {
    p.life = math.rand(1, 3);
    p.pos.x = 0;
    p.pos.y = 0;
    p.xs = math.rand(-50, 50);
    p.ys = math.rand(-50, 50);
  }

  update(dt, t) {
    super.update(dt, t);
  }
}

export default Particles;
