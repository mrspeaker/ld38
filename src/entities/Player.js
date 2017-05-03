import pop from "../../pop";
const { Texture, TileSprite, math, Particles } = pop;
import Matter from "matter-js";
import Asplode from "./Asplode";

const textures = {
  player: new Texture("res/images/player.png"),
  flameup: new Texture("res/images/flameup.png"),
  flamedown: new Texture("res/images/flamedown.png")
};

class Player extends TileSprite {
  constructor(pos) {
    super(textures.player, 16, 24);
    this.type = "PLAYER";
    this.pivot.x = 8;
    this.pivot.y = 12;
    this.body = Matter.Bodies.rectangle(pos.x, pos.y, this.w, this.h, {
      restitution: 0.9,
      angle: 0,
      mass: 1,
      frictionAir: 0
    });
    this.body._ent = this;
    this.started = false;
    this.deaded = false;

    // Add ignition flames
    this.flameup = this.add(new TileSprite(textures.flameup, 16, 16));
    this.flameup.pos.y = 25;
    this.flameup.visible = false;
    this.flamedown = this.add(new TileSprite(textures.flamedown, 16, 16));
    this.flamedown.pos.y = -17;
    this.flamedown.visible = false;
  }

  flameUp(show) {
    this.flameup.visible = show;
    this.flameup.frame.x = math.rand(2);
  }

  flameDown(show) {
    this.flamedown.visible = show;
    this.flamedown.frame.x = math.rand(3);
  }

  win() {
    this.frame.x = 5;
  }

  die(inDeepSpace = false) {
    const { frame } = this;
    this.deaded = true;
    frame.x = inDeepSpace ? 7 : 4;
    if (inDeepSpace) {
      // const head = this.add(new Asplode());
      // head.pos.x = -20;
      // head.pos.y = -33;

      this.p = this.add(new Particles());
    }
  }

  update(dt, t) {
    super.update(dt, t);
    const { body, pos, started, deaded, frame } = this;
    pos.x = body.position.x - 8;
    pos.y = body.position.y - 12;
    this.rotation = body.angle;
    if (this.p) {
      this.p.rotation = Math.PI - this.rotation;
    }

    if (deaded) {
      return;
    }

    if (body.speed > 0.1) {
      this.started = true;
    }

    if (started) {
      if (math.randOneIn(50)) {
        frame.x = [0, 2, 3][math.rand(3)];
      }
    } else {
      frame.x = (t / 800 % 2) | 0;
    }
  }
}

export default Player;
