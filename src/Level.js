import pop from "../pop";
const { Container, math } = pop;
import Card from "./Card";

class Level extends Container {
  constructor(game) {
    super();
    this.tw = 64;
    this.th = 64;
    this.mapW = Math.ceil(game.w / this.tw) + 1;
    this.mapH = Math.ceil(game.h / this.th) + 1;

    this.w = this.tw * this.mapW;
    this.h = this.th * this.mapH;

    for (let y = 0; y < this.mapH; y++) {
      for (let x = 0; x < this.mapW; x++) {
        const t = this.add(new Card());
        t.pos.x = x * this.tw;
        t.pos.y = y * this.th;
      }
    }
    this.xo = 0;
    this.yo = 0;

    this.dirX = math.rand(-50, 50);
    this.dirY = math.rand(-50, 50);
  }

  getClicked(pos) {
    const { xo, yo, tw, th, mapW, mapH, w, h } = this;
    const xt = ((pos.x - xo % w) / tw + mapW) % mapW | 0;
    const yt = ((pos.y - yo % h) / th + mapH) % mapH | 0;
    const ch = this.children[yt * mapW + xt];
    return ch;
  }
}

export default Level;
