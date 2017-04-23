import pop from "../../pop";
const { Camera, Container, math } = pop;
import Matter from "matter-js";
// Bug in matter-attractors...
import MatterAttractors from "../../node_modules/matter-attractors/index";
import Level from "../Level";
import Sun from "../entities/Sun";
import Projectile from "../entities/Projectile";

class GameScreen extends Container {
  constructor(game, mouse, keys) {
    super();
    this.mouse = mouse;
    this.keys = keys;

    this.level = new Level(game);

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

    Render.run(render);
    Engine.run(engine);
    Matter.use(MatterAttractors);
    MatterAttractors.Attractors.gravityConstant *= 100;

    //engine.timing.timeScale = 1.5;
    engine.world.gravity.scale = 0;

    const sun = this.sun = new Sun({x: 400, y: 400});
    const p1 = this.p1 = new Projectile({x: 400, y: 180});
    const p2 = new Projectile({x: 500, y: 190});

    const { w, h } = game;

    const camera = this.camera = new Camera(p1, { w, h }, { w: w * 5, h: h * 5 });
    this.add(camera);
    camera.scale = {x: 1, y: 1};
    camera.add(this.level);
    camera.add(sun);
    camera.add(p1);
    camera.add(p2);

    World.add(engine.world, [sun.body, p1.body, p2.body]);

    //Matter.Body.setVelocity(p1.body, { x: 3, y: -0.2 });
    //Matter.Body.applyForce(p1.body, p1.body.position, {x: 0, y: 0.1});
    p1.body.angle -= 0.0001;
    Matter.Body.setVelocity(p2.body, { x: 2, y: 4 });
  }

  update(dt, t) {
    super.update(dt, t);
    const { mouse, keys } = this;
    if (mouse.left.pressed) {
      const { Vector } = Matter;
      const { p1: { body }} = this;
      const rot = body.angle;
      const up = Vector.rotate(Vector.create(Math.cos(rot), Math.sin(rot)), -Math.PI / 2);
      const vec = Vector.mult(up, 0.005);
      Matter.Body.applyForce(body, body.position, vec);
    }

    if (keys.x || keys.y) {
      const { Vector } = Matter;
      const { p1: { body }} = this;
      const rot = body.angle;
      if (keys.y) {
        const ex = keys.y < 0 ? -Math.PI / 2 : -Math.PI * 1.5;
        const up = Vector.rotate(Vector.create(Math.cos(rot), Math.sin(rot)), ex);
        const vec = Vector.mult(up, 0.0005);
        Matter.Body.applyForce(body, body.position, vec);
      }
      if (keys.x < 0) body.torque = -0.0001;
      if (keys.x > 0) body.torque = 0.0001;
    }


    this.camera.scale.x += Math.sin(t / 1000) * 0.001;
    this.camera.scale.y += Math.sin(t / 800) * 0.001;

    mouse.update();
  }
}

export default GameScreen;
