import pop from "../../pop";
const { Camera, Container, math } = pop;
import Matter from "matter-js";
// Bug in matter-attractors...
import MatterAttractors from "../../node_modules/matter-attractors/index";
import Level from "../Level";
import Sun from "../entities/Sun";
import Projectile from "../entities/Projectile";

class GameScreen extends Container {
  constructor(game, mouse, keys, onDead) {
    super();
    this.id = math.rand(100);
    this.mouse = mouse;
    this.keys = keys;

    this.onDead = onDead;
    this.state = "READY";
    this.stateTime = 0;

    this.noTouchTime = 0;

    //this.level = new Level(game);

    const { Engine, Render, World, Bodies } = Matter;
    const engine = (this.engine = Engine.create());
    // const render = Render.create({
    //   element: document.body,
    //   engine: engine,
    //   options: {
    //     width: 640,
    //     height: 480
    //   }
    // });
    //
    // Render.run(render);
    this.runner = Engine.run(engine);
    Matter.use(MatterAttractors);
    MatterAttractors.Attractors.gravityConstant = 0.001 * 100;

    //engine.timing.timeScale = 1.5;
    engine.world.gravity.scale = 0;

    const sun = (this.sun = new Sun({ x: 400, y: 400 }));
    const p1 = (this.p1 = new Projectile({
      x: sun.pos.x,
      y: sun.pos.y - sun.radius - 10
    }));
    //const p2 = new Projectile({x: 500, y: 190});

    const { w, h } = game;

    const camera = (this.camera = new Camera(
      p1,
      { w, h },
      { w: w * 5, h: h * 5 }
    ));
    this.add(camera);
    camera.scale = { x: 1.5, y: 1.5 };
    //camera.add(this.level);
    camera.add(sun);
    camera.add(p1);
    //camera.add(p2);

    World.add(engine.world, [sun.body, p1.body]); //p2.body]);

    //Matter.Body.setVelocity(p1.body, { x: 3, y: -0.2 });
    //Matter.Body.applyForce(p1.body, p1.body.position, {x: 0, y: 0.1});
    p1.body.angle -= 0.0001;
    //Matter.Body.setVelocity(p2.body, { x: 2, y: 4 });

    // an example of using collisionStart event on an engine
    Matter.Events.on(engine, "collisionStart", event => {
      const pairs = event.pairs;

      // change object colours to show those starting a collision
      for (var i = 0; i < pairs.length; i++) {
        const { bodyA, bodyB } = pairs[i];
        if (bodyA._ent && bodyA._ent.type === "PROJECTILE") {
          this.die();
        }
        if (bodyB._ent && bodyB._ent.type === "PROJECTILE") {
          this.die();
        }
      }
    });
  }

  die() {
    if (this.state !== "DYING") {
      this.state = "DYING";
      this.stateTime = 0;
    }
  }

  dead() {
    const { engine, runner } = this;
    Matter.World.clear(engine.world);
    Matter.Engine.clear(engine);
    Matter.Runner.stop(runner);
    this.onDead();
  }

  win() {
    if (this.state !== "WIN") {
      this.state = "WIN";
    }
  }

  update(dt, t) {
    super.update(dt, t);
    const { mouse, keys } = this;
    if (this.state === "DYING") {
      this.stateTime += dt;
      if (this.stateTime > 2) {
        this.dead();
      }
      return;
    }

    if (this.state === "WIN") {
      if (keys.x || keys.y || keys.action) {
        this.dead();
      }
      return;
    }

    const { Vector, Body } = Matter;
    /*if (mouse.left.pressed) {
      const { Vector } = Matter;
      const { p1: { body }} = this;
      const rot = body.angle;
      const up = Vector.rotate(Vector.create(Math.cos(rot), Math.sin(rot)), -Math.PI / 2);
      const vec = Vector.mult(up, 0.01);
      Body.applyForce(body, body.position, vec);
    }*/

    if (keys.x || keys.y) {
      this.noTouchTime = 0;
      const { p1: { body } } = this;
      const rot = body.angle;
      if (keys.y) {
        const ex = keys.y < 0 ? -Math.PI / 2 : -Math.PI * 1.5;
        const up = Vector.rotate(
          Vector.create(Math.cos(rot), Math.sin(rot)),
          ex
        );
        const vec = Vector.mult(up, 0.0005);
        Body.applyForce(body, body.position, vec);
      }
      if (keys.x < 0) body.torque = -0.0001;
      if (keys.x > 0) body.torque = 0.0001;
    } else {
      // Not touching keys...
      this.noTouchTime += dt;
      if (this.noTouchTime > 10) {
        this.win();
      }
    }

    const dist = Vector.sub(this.sun.body.position, this.p1.body.position);
    if (Vector.magnitude(dist) > 350) {
      this.die();
    }

    this.camera.scale.x += Math.sin(t / 1000) * 0.001;
    this.camera.scale.y += Math.sin(t / 800) * 0.001;

    mouse.update();
  }
}

export default GameScreen;
