import pop from "../../pop";
const { Container } = pop;
import Matter from "matter-js";
// Bug in matter-attractors...
import MatterAttractors from "../../node_modules/matter-attractors/index";
import Level from "../Level";
import Projectile from "../entities/Projectile";

class GameScreen extends Container {
  constructor(game, mouse) {
    super();
    this.mouse = mouse;

    this.level = new Level(game);
    this.add(this.level);
    this.faceUps = [];
    this.canClick = true;

    const { Engine, Render, World, Bodies } = Matter;
    const engine = Engine.create();
    const render = Render.create({
      element: document.body,
      engine: engine,
      options: {
        width: 1640,
        height: 1480
      }
    });
    Engine.run(engine);
    Render.run(render);
    Matter.use(MatterAttractors);

    const sun = Bodies.circle(300, 600, 230, {
      isStatic: true,
      mass: 100000,
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
    const p1 = this.p1 = this.add(new Projectile({x: 100, y: -120}));
    const p2 = this.add(new Projectile({x: 500, y: -220}));

    engine.world.gravity.scale = 0;
    World.add(engine.world, [sun, p1.body, p2.body]);

  }

  update(dt, t) {
    super.update(dt, t);
    const { mouse, level } = this;
    if (mouse.left.pressed) {
      const t = level.getClicked(mouse.pos);
      t.flip();
    }
    mouse.update();
    const {p1} = this;
    const {body} = p1;
    Matter.Body.applyForce(body, body.position, {x:0.031, y: 0});
  }
}

export default GameScreen;
