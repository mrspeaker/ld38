import pop from "../../pop";
const { Texture, Sprite } = pop;
import Matter from "matter-js";
import MatterAttractors from "../../node_modules/matter-attractors/index";

const texture = new Texture("res/images/sun.png");

class Sun extends Sprite {
  constructor(pos) {
    super(texture);
    this.w2 = 300;
    this.h2 = 300;
    this.pivot.x = this.w2 / 2;
    this.pivot.y = this.h2 / 2;
    // this.body = Matter.Bodies.circle(pos.x, pos.y, this.w, this.h, {
    //   restitution: 0.8,//9,
    //   angle: -Math.PI * 0.15,
    //   mass: 1,
    //   frictionAir: 0
    // });

    this.body = Matter.Bodies.circle(pos.x, pos.y, this.w2 / 2, {
      isStatic: true,
      mass: 100,
      plugin: {
        attractors: [
          MatterAttractors.Attractors.gravity
          /*(bodyA, bodyB) => ({
            x: (bodyA.position.x - bodyB.position.x) * 1e-5,
            y: (bodyA.position.y - bodyB.position.y) * 1e-5,
          })*/
        ]
      }
    });
  }

  update() {
    this.pos.x = this.body.position.x;
    this.pos.y = this.body.position.y;
    this.rotation = this.body.angle;
  }
}

export default Sun;
