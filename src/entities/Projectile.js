import pop from "../../pop";
const { Texture, TileSprite } = pop;
import Matter from "matter-js";

const texture = new Texture("res/images/tiles.png");

class Projectile extends TileSprite {
  constructor(pos) {
    super(texture, 16, 16);
    this.pivot.x = 8;
    this.pivot.y = 8;
    this.frame.x = 4;
    this.body = Matter.Bodies.rectangle(pos.x, pos.y, this.w, this.h, {
      restitution: 0.9, //9,
      angle: 0, //-Math.PI * 0.15,
      mass: 1,
      frictionAir: 0
    });
  }

  update() {
    this.pos.x = this.body.position.x - 8;
    this.pos.y = this.body.position.y - 8;
    this.rotation = this.body.angle;
  }
}

export default Projectile;