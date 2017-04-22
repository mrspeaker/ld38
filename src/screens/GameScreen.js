import pop from "../../pop";
const { Camera, Container, math } = pop;
import Matter from "matter-js";
// Bug in matter-attractors...
import MatterAttractors from "../../node_modules/matter-attractors/index";
import Level from "../Level";
import Sun from "../entities/Sun";
import Projectile from "../entities/Projectile";

class GameScreen extends Container {
  constructor(game, mouse) {
    super();
    this.mouse = mouse;

    this.level = new Level(game);
    //this.add(this.level);

    const { Engine, Render, World, Bodies } = Matter;
    const engine = Engine.create();
    const render = Render.create({
      element: document.body,
      engine: engine,
      options: {
        width: 640,
        height: 480
      }
    });
    Engine.run(engine);
    Render.run(render);
    Matter.use(MatterAttractors);
    MatterAttractors.Attractors.gravityConstant *= 100;

    //engine.timing.timeScale = 1.5;
    engine.world.gravity.scale = 0;

    const sun = this.sun = new Sun({x: 400, y: 400});
    const p1 = this.p1 = new Projectile({x: 100, y: 300});
    const p2 = new Projectile({x: 500, y: 190});

    const { w, h } = game;

    const camera = this.camera = new Camera(p1, { w, h }, { w: w * 5, h: h * 5 });
    this.add(camera);
    camera.add(this.level);
    camera.add(sun);
    camera.add(p1);
    camera.add(p2);

    World.add(engine.world, [sun.body, p1.body, p2.body]);

    //Matter.Body.setVelocity(p1.body, { x: 3, y: -0.2 });
    Matter.Body.setVelocity(p2.body, { x: 2, y: 4 });
  }

  update(dt, t) {
    super.update(dt, t);
    const { mouse, level } = this;
    if (mouse.left.pressed) {
      const { Vector } = Matter;
      const t = level.getClicked(mouse.pos);
      const { p1: { body }} = this;
      const rot = body.angle;
      const up = Vector.rotate(Vector.create(Math.cos(rot), Math.sin(rot)), -Math.PI / 2);
      const vec = Vector.mult(up, 0.005);
      Matter.Body.applyForce(body, body.position, vec);
      t.flip();
    }
    mouse.update();

  }
}

export default GameScreen;
