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
    this.radius = this.w2 / 2;
    this.pos.x = pos.x;
    this.pos.y = pos.y;

    this.body = Matter.Bodies.circle(pos.x, pos.y, this.radius, {
      isStatic: true,
      mass: 100,
      plugin: {
        attractors: [
          this.gravity
          /*(bodyA, bodyB) => ({
            x: (bodyA.position.x - bodyB.position.x) * 1e-5,
            y: (bodyA.position.y - bodyB.position.y) * 1e-5,
          })*/
        ]
      }
    });
  }

  gravity (bodyA, bodyB) {
    if (bodyB._ent && bodyB._ent.started === false) {
      return;
    }

    // use Newton's law of gravitation
    const bToA = Matter.Vector.sub(bodyB.position, bodyA.position),
      distanceSq = Matter.Vector.magnitudeSquared(bToA) || 0.0001,
      normal = Matter.Vector.normalise(bToA),
      magnitude = -MatterAttractors.Attractors.gravityConstant * (bodyA.mass * bodyB.mass / distanceSq),
      force = Matter.Vector.mult(normal, magnitude);

    // to apply forces to both bodies
    Matter.Body.applyForce(bodyA, bodyA.position, Matter.Vector.neg(force));
    Matter.Body.applyForce(bodyB, bodyB.position, force);
  }

  update() {
    this.pos.x = this.body.position.x;
    this.pos.y = this.body.position.y;
    this.rotation = this.body.angle;
  }
}

export default Sun;
