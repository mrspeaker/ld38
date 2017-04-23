import pop from "../../pop";
const { Texture, TileSprite, math } = pop;
import Matter from "matter-js";

const textures = {
  player: new Texture("res/images/player.png"),
  flameup: new Texture("res/images/flameup.png"),
  flamedown: new Texture("res/images/flamedown.png"),
};

class Projectile extends TileSprite {
  constructor(pos) {
    super(textures.player, 16, 24);
    this.pivot.x = 8;
    this.pivot.y = 12;
    //this.frame.x = 0;
    this.body = Matter.Bodies.rectangle(pos.x, pos.y, this.w, this.h, {
      restitution: 0.9,
      angle: 0,
      mass: 1,
      frictionAir: 0
    });
    this.body._ent = this;
    this.started = false;
    this.type = "PROJECTILE";
    this.flameup = new TileSprite(textures.flameup, 16, 16);
    this.flameup.pos.y = 25;
    this.flameup.visible = false;
    this.flamedown = new TileSprite(textures.flamedown, 16, 16);
    this.flamedown.pos.y = -17;
    this.flamedown.visible = false;
    this.children = [
      this.flameup,
      this.flamedown
    ];
  }

  flameUp (show) {
    //this.fame
    this.flameup.visible = show;
    this.flameup.frame.x = math.rand(2);
  }

  flameDown (show) {
    this.flamedown.visible = show;
    this.flamedown.frame.x = math.rand(3);
  }

  update() {
    this.pos.x = this.body.position.x - 8;
    this.pos.y = this.body.position.y - 12;
    this.rotation = this.body.angle;
    if (this.body.speed > 0.1) {
      this.started = true;
    }
  }
}

export default Projectile;
