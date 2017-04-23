import pop from "../pop";
const { TileSprite, Texture, math } = pop;

const texture = new Texture("res/images/player.png");

class Card extends TileSprite {
  constructor () {
    super(texture, 64, 64);
    this.face = {
      x: math.rand(2,8),
      y: math.rand(2)
    };
    this.faceUp = true;
    this.matched = false;
    this.flip();
  }

  flip () {
    const { face, frame } = this;
    const up = this.faceUp = !this.faceUp;
    frame.x = up ? face.x : 0;
    frame.y = up ? face.y : 0;
    return up;
  }
}

export default Card;
