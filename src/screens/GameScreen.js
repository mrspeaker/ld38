import pop from "../../pop";
const {
  Camera,
  Container,
  math,
  Particles,
  Sprite,
  Sound,
  Texture,
  TileSprite
} = pop;
import Matter from "matter-js";
// Bug in matter-attractors...
import MatterAttractors from "../../node_modules/matter-attractors/index";
import Sun from "../entities/Sun";
import Player from "../entities/Player";
import Asteroid from "../entities/Asteroid";

const textures = {
  border: new Texture("res/images/border.png"),
  stable: new Texture("res/images/stable.png"),
  fail: new Texture("res/images/fail.png"),
  intro: new Texture("res/images/intro.png"),
  stars: new Texture("res/images/stars.png")
};

const sounds = {
  ignit: new Sound("./res/sounds/ignit.mp3", { volume: 0.85, loop: false }),
  dead1: new Sound("./res/sounds/dead3.mp3", { volume: 0.75, loop: false }),
  dead2: new Sound("./res/sounds/dead4.mp3", { volume: 0.75, loop: false }),
  beep: new Sound("./res/sounds/beep.mp3", { volume: 0.05, loop: false }),
  win: new Sound("./res/sounds/win.mp3", { volume: 0.75, loop: false }),
  crash: new Sound("./res/sounds/crash.mp3", { volume: 0.7, loop: false })
};

class GameScreen extends Container {
  constructor(game, keys, onDead) {
    super();
    this.showDebug = false;
    this.keys = keys;
    this.onDead = onDead;

    this.state = "READY";
    this.stateTime = 0;
    this.noTouchTime = 0;
    this.lastBeep = 3;

    const { w, h } = game;

    this.playThemeSong(game);

    const { Body, Engine, Events, Render, World } = Matter;
    Matter.use(MatterAttractors);
    MatterAttractors.Attractors.gravityConstant = 0.001 * 100;
    const engine = Engine.create();
    engine.world.gravity.scale = 0;
    Engine.run(engine);

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

    const sun = new Sun({ x: 600, y: 700 });
    const player = new Player({
      x: sun.pos.x,
      y: sun.pos.y - sun.radius - 13
    });
    const asteroid = new Asteroid({ x: 700, y: 490 });
    const camera = new Camera(player, { w, h }, { w: w * 5, h: h * 5 });

    this.sun = sun;
    this.camera = camera;
    this.player = player;

    camera.pos.x = player.pos.x - w / 2 - 180; // lol... 180, wtf?
    camera.pos.y = player.pos.y;
    camera.scale = { x: 1.5, y: 1.5 };

    this.add(camera);
    this.addBackgroundStars();
    camera.add(sun);
    camera.add(player);
    camera.add(asteroid);
    this.intro = this.add(new Sprite(textures.intro));
    this.add(new Sprite(textures.border));

    World.add(engine.world, [sun.body, player.body, asteroid.body]);
    // Fix for a weird sync issue with pop.renderer (rotation == 0 i guess)
    player.body.angle -= 0.0001;

    Body.setVelocity(asteroid.body, { x: 2, y: 4 }); // fire asteroid
    Events.on(engine, "collisionStart", event => {
      const { pairs } = event;
      for (let i = 0; i < pairs.length; i++) {
        const { bodyA, bodyB } = pairs[i];
        const a = bodyA._ent && bodyA._ent.type;
        const b = bodyB._ent && bodyB._ent.type;

        if (a === "PLAYER" || b === "PLAYER") {
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
  }

  playThemeSong(game) {
    sounds.theme = game.theme;
    if (!sounds.theme.playing) {
      sounds.theme.play();
    }
  }

  die(fromSpace = false) {
    const { player, state } = this;
    if (state !== "DYING") {
      sounds.ignit.stop();
      sounds.win.stop();
      sounds[["dead1", "dead2"][math.rand(2)]].play();

      this.state = "DYING";
      this.stateTime = 0;
      player.die(fromSpace);
      if (fromSpace) {
        this.p = this.camera.add(new Particles());
        this.p.pos.x = player.pos.x;
        this.p.pos.y = player.pos.y;
      }
      this.failSprite = this.add(new Sprite(textures.fail));
      this.failSprite.alpha = 0.5;
      if (this.winSprite) {
        this.winSprite.visible = false;
      }
    }
  }

  dead() {
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
      this.player.win();
    }
  }

  addBackgroundStars() {
    const { camera, sun } = this;
    for (let i = 0; i < 100; i++) {
      const s = camera.add(new TileSprite(textures.stars, 16, 16));
      const angle = math.randf(Math.PI * 2);
      const weightedRnd = math.randf() * math.randf();
      const dist = () => math.rand(1200) * weightedRnd + sun.radius;
      s.pos.x = sun.pos.x + Math.cos(angle) * dist();
      s.pos.y = sun.pos.y + Math.sin(angle) * dist();
      s.frame.x = math.rand(4);
      s.frame.y = math.rand(2);
    }
  }

  update(dt, t) {
    super.update(dt, t);
    const { camera, keys, player, state, sun } = this;
    if (player.started) {
      if (this.intro.visible) {
        this.intro.alpha -= dt * 6;
        if (this.intro.alpha <= 0) {
          this.intro.visible = false;
          this.intro.alpha = 0;
        }
      }
    }
    player.flameUp(false);
    player.flameDown(false);

    // Abort mission
    if (keys.action) {
      this.dead();
      return;
    }

    if (state === "DYING") {
      if ((this.stateTime += dt) > 2) {
        this.dead();
      }
      this.failSprite.visible = (t / 300 % 2) | 0;
      return;
    }

    if (state === "WIN") {
      if (keys.x || keys.y || keys.action) {
        this.dead();
      }
      // Zoom out end effect
      camera.scale.x *= 0.999;
      camera.scale.y *= 0.999;
      return;
    }

    const { Vector, Body } = Matter;
    if (keys.x || keys.y) {
      this.noTouchTime = 0;
      const { body } = player;
      const { angle } = body;
      // Accleration up or down
      if (keys.y) {
        const ex = keys.y < 0 ? -Math.PI / 2 : -Math.PI * 1.5;
        const up = Vector.rotate(
          Vector.create(Math.cos(angle), Math.sin(angle)),
          ex
        );
        Body.applyForce(body, body.position, Vector.mult(up, 0.0005));
        if (keys.y < 0) player.flameUp(true);
        else player.flameDown(true);
        if (!sounds.ignit.playing) {
          sounds.ignit.play();
        }
      } else {
        sounds.ignit.stop();
      }
      // Rotate left/right
      if (keys.x < 0) body.torque = -0.0001;
      if (keys.x > 0) body.torque = 0.0001;
    } else {
      sounds.ignit.stop();
      // Not touching keys... check for stable orbit
      if (player.started) {
        this.noTouchTime += dt;
      }
      // 10 seconds with no key-touching === stable orbit ;)
      if (this.noTouchTime > 10) {
        this.win();
      }
    }

    this.playSpaceBeep(dt);

    // Check for off the page - dead in space
    const dist = Vector.sub(sun.body.position, player.body.position);
    if (Vector.magnitude(dist) > 375) {
      this.die(true);
    }

    // weird little camera wobble effect
    camera.scale.x += Math.sin(t / 1000) * 0.001;
    camera.scale.y += Math.sin(t / 800) * 0.001;
  }

  playSpaceBeep(dt) {
    this.lastBeep -= dt;
    if (this.lastBeep < 0) {
      sounds.beep.play();
      this.lastBeep = 3;
    }
  }
}

export default GameScreen;
