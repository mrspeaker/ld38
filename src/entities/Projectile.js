import pop from "../../pop";
const { Texture, TileSprite, math } = pop;
import Matter from "matter-js";

const texture = new Texture("res/images/player.png");
const flameup = new Texture("res/images/flameup.png");

class Projectile extends TileSprite {
  constructor(pos) {
    super(texture, 16, 24);
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
    this.flame = new TileSprite(flameup, 16, 16);
    this.flame.pos.y = 25;
    this.flame.visible = false;
    this.children = [
      this.flame
    ];
  }

  flameUp (show) {
    //this.fame
    this.flame.visible = show;
    this.flame.frame.x = math.rand(2);
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
