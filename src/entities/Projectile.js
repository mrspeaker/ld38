import pop from "../../pop";
const { Texture, TileSprite } = pop;
import Matter from "matter-js";

const texture = new Texture("res/images/tiles.png");

class Projectile extends TileSprite {
  constructor(pos) {
    super(texture, 64, 64);
    this.pivot.x = 32;
    this.pivot.y = 32;
    this.frame.x = 2;
    this.body = Matter.Bodies.rectangle(pos.x, pos.y, this.w, this.h, {
      restitution: 0.8,//9,
      angle: -Math.PI * 0.15,
      mass: 1,
      frictionAir: 0
    });
  }

  update() {
    this.pos.x = this.body.position.x - 32;
    this.pos.y = this.body.position.y - 32;
    this.rotation = this.body.angle;
  }
}

export default Projectile;
