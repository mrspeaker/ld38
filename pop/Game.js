import Container from "./Container";
import Assets from "./Assets";
import CanvasRenderer from "./renderer/CanvasRenderer";
import screenCapture from "./utils/screenCapture";
import Timers from "./Timers";

class Game {
  constructor (w, h) {
    this.w = w;
    this.h = h;
    this.renderer = new CanvasRenderer(w, h);
    document.querySelector("#board").appendChild(this.renderer.view);
    screenCapture(this.renderer.view);

    this.scene = new Container();
    this.timers = new Timers();
  }

  run (loopFunc=()=>{}) {
    Assets.addReadyListener(() => {
      let dt, last;
      const loopy = (t) => {
        requestAnimationFrame(loopy);

        if (!last) { last = t; }
        dt = Math.min(t - last, 166) / 1000;
        last = t;

        loopFunc(dt, t);

        this.scene.update(dt, t);
        this.renderer.render(this.scene);
        this.timers.update(dt, t);
      };
      requestAnimationFrame(loopy);
    });
  }
}

export default Game;
