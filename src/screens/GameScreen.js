import pop from "../../pop";
const { Camera, Container, math, Sprite, Sound, Texture, TileSprite } = pop;
import Matter from "matter-js";
// Bug in matter-attractors...
import MatterAttractors from "../../node_modules/matter-attractors/index";
import Sun from "../entities/Sun";
import Projectile from "../entities/Projectile";
import Asteroid from "../entities/Asteroid";

const textures = {
  border: new Texture("res/images/border.png"),
  stable: new Texture("res/images/stable.png"),
  fail: new Texture("res/images/fail.png"),
  intro: new Texture("res/images/intro.png"),
  stars: new Texture("res/images/stars.png"),
};

const sounds = {
  ignit: new Sound("./res/sounds/ignit.mp3", {volume: 0.75, loop: false}),
  dead1: new Sound("./res/sounds/dead3.mp3", {volume: 0.75, loop: false}),
  dead2: new Sound("./res/sounds/dead4.mp3", {volume: 0.75, loop: false}),
  beep: new Sound("./res/sounds/beep.mp3", {volume: 0.05, loop: false}),
  win: new Sound("./res/sounds/win.mp3", {volume: 0.75, loop: false}),
  crash: new Sound("./res/sounds/crash.mp3", {volume: 0.7, loop: false})
};

class GameScreen extends Container {
  constructor(game, mouse, keys, onDead) {
    super();
    this.showDebug = false;
    this.mouse = mouse;
    this.keys = keys;

    this.onDead = onDead;
    this.state = "READY";
    this.stateTime = 0;

    this.noTouchTime = 0;
    this.lastBeep = 3;

    sounds.theme = game.theme;
    if (!sounds.theme.playing) {
      sounds.theme.play();
    }

    const { Engine, Render, World } = Matter;
    const engine = (this.engine = Engine.create());
    if (this.showDebug) {
      const render = Render.create({
        element: document.body,
        engine: engine,
        options: {
          width: 640,
          height: 480
        }
      });
      Render.run(render);
    }

    this.runner = Engine.run(engine);
    Matter.use(MatterAttractors);
    MatterAttractors.Attractors.gravityConstant = 0.001 * 100;

    //engine.timing.timeScale = 1.5;
    engine.world.gravity.scale = 0;

    const sun = (this.sun = new Sun({ x: 600, y: 700 }));
    const p1 = (this.p1 = new Projectile({
      x: sun.pos.x,
      y: sun.pos.y - sun.radius - 13
    }));
    const p2 = new Asteroid({ x: 700, y: 490 });

    const { w, h } = game;

    const camera = (this.camera = new Camera(
      p1,
      { w, h },
      { w: w * 5, h: h * 5 }
    ));
    camera.pos.x = p1.pos.x- w / 2 - 180;
    camera.pos.y = p1.pos.y;

    this.add(camera);
    camera.scale = { x: 1.5, y: 1.5 };

    for (let i = 0; i < 100; i++) {
      const s = camera.add(new TileSprite(textures.stars, 16, 16));
      const deg = math.randf(Math.PI * 2);

      const rnd = Math.random() * Math.random();
      s.pos.x = sun.pos.x + (Math.cos(deg) * (math.rand(1200) * rnd + sun.radius));
      s.pos.y = sun.pos.y + (Math.sin(deg) * (math.rand(1200) * rnd + sun.radius));
      s.frame.x = math.rand(4);
      s.frame.y = math.rand(2);
    }
    //camera.add(this.level);
    camera.add(sun);
    camera.add(p1);
    camera.add(p2);

    this.add(new Sprite(textures.border));

    World.add(engine.world, [sun.body, p1.body, p2.body]);

    // Fix for a weird sync issue with pop.renderer (rotation == 0 i guess)
    p1.body.angle -= 0.0001;

    Matter.Body.setVelocity(p2.body, { x: 2, y: 4 });

    // an example of using collisionStart event on an engine
    Matter.Events.on(engine, "collisionStart", event => {
      const { pairs } = event;
      for (let i = 0; i < pairs.length; i++) {
        const { bodyA, bodyB } = pairs[i];
        const a = bodyA._ent && bodyA._ent.type;
        const b = bodyB._ent && bodyB._ent.type;
        if (a === "PROJECTILE" || b === "PROJECTILE") {
          if (!sounds.crash.playing) {
            sounds.crash.play();
          }
          // If hit asteroid, don't die.
          if (!(a && b)) {
            this.die();
          }
        }
      }
    });

    this.intro = this.add(new Sprite(textures.intro));
    this.intro.visible = true;
    if (game.first) {
      this.intro.visible = true;
      game.first = false;
    }

  }

  die() {
    if (this.state !== "DYING") {
      sounds.ignit.stop();
      sounds.win.stop();
      if (math.randOneIn(2)) {
        sounds.dead1.play();
      } else {
        sounds.dead2.play();
      }

      this.state = "DYING";
      this.p1.deaded = true; // what
      this.p1.frame.x = 4;
      this.stateTime = 0;
      this.failSprite = this.add(new Sprite(textures.fail));
      if (this.winSprite) {
        this.winSprite.visible = false;
      }
    }
  }

  dead() {
    const { engine, runner } = this;
    Matter.World.clear(engine.world);
    Matter.Engine.clear(engine);
    Matter.Runner.stop(runner);
    sounds.dead1.stop();
    sounds.dead2.stop();
    sounds.ignit.stop();
    this.onDead();
  }

  win() {
    if (this.state !== "WIN") {
      this.state = "WIN";
      sounds.theme.stop();
      sounds.win.play();
      this.camera.focus = this.sun.pos;
      this.winSprite = this.add(new Sprite(textures.stable));
    }
  }

  update(dt, t) {
    super.update(dt, t);
    const { mouse, keys } = this;

    this.p1.flameUp(false);
    this.p1.flameDown(false);

    if (keys.action) {
      this.dead();
      return;
    }

    if (this.state === "DYING") {
      this.stateTime += dt;
      if (this.stateTime > 2) {
        this.dead();
      }
      this.failSprite.visible = (t / 300 % 2) | 0;
      return;
    }

    if (this.state === "WIN") {
      if (keys.x || keys.y || keys.action) {
        this.dead();
      }
      this.camera.scale.x *= 0.999;
      this.camera.scale.y *= 0.999;
      return;
    }

    const { Vector, Body } = Matter;
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
        if (keys.y < 0) this.p1.flameUp(true);
        else this.p1.flameDown(true);
        if (!sounds.ignit.playing) {
          sounds.ignit.play();
        }
      } else {
        sounds.ignit.stop();
      }
      if (keys.x < 0) body.torque = -0.0001;
      if (keys.x > 0) body.torque = 0.0001;
    } else {
      sounds.ignit.stop();
      // Not touching keys... check for stable orbit
      if (this.p1.started) this.noTouchTime += dt;
      if (this.noTouchTime > 10) {
        this.win();
      }
    }

    if (this.p1.started) {
      this.intro.visible = false;
      //this.p1.frame.x = 0;
      if (math.randOneIn(50)) {
        this.p1.frame.x = [0, 2, 3][math.rand(3)];
      }
    } else {
      this.p1.frame.x = t / 800 % 2 | 0;
    }

    this.lastBeep -= dt;
    if (this.lastBeep < 0) {
      sounds.beep.play();
      this.lastBeep = 3;
    }

    // Check for off the page - dead in space
    const dist = Vector.sub(this.sun.body.position, this.p1.body.position);
    if (Vector.magnitude(dist) > 375) {
      this.die();
    }

    // weird little camera effect
    this.camera.scale.x += Math.sin(t / 1000) * 0.001;
    this.camera.scale.y += Math.sin(t / 800) * 0.001;
    mouse.update();
  }
}

export default GameScreen;
