/**
 * props:
   - focus: an object with a .pos position, or an {x, y} object to focus on
   - viewport: object of {w, h} for the width/height of the Canvas
   - worldSize (optional): object of {w, h} of the game map
   - scale (optional): number
   - moveSpeed (optional): number
 */
import Container from "./Container";
import math from "./utils/math";

class Camera extends Container {
  constructor(focus, viewport, worldSize = viewport, moveSpeed = 0.1) {
    super();
    this.focus = focus.pos || focus;
    this.scale = {
      x: 1, y: 1
    };

    const offset = { x: 0, y: 0 };
    if (focus.w) {
      offset.x += focus.w / 2;
      offset.y += focus.h / 2;
    }
    if (focus.pivot) {
      offset.x -= focus.pivot.x;
      offset.y -= focus.pivot.y;
    }
    this.offset = offset;

    this.viewport = viewport;
    this.worldSize = worldSize;
    this.moveSpeed = moveSpeed;
    this.focusOn(this.focus, 1);
  }

  focusOn(pos, easingFactor) {
    const { worldSize, viewport } = this;

    const centeredX = (pos.x * this.scale.x) - viewport.w / 2;
    const maxX = (worldSize.w * this.scale.x) - viewport.w;
    const x = -math.clamp(centeredX, 0, maxX);

    const centeredY = (pos.y * this.scale.y) - viewport.h / 2;
    const maxY = (worldSize.h * this.scale.y) - viewport.h;
    const y = -math.clamp(centeredY, 0, maxY);

    // Ease between the current position and the new position
    this.pos.x = math.mix(this.pos.x, x, easingFactor);
    this.pos.y = math.mix(this.pos.y, y, easingFactor);
  }

  update(dt, t) {
    super.update(dt, t);

    const { focus, offset, moveSpeed } = this;
    const pos = { x: focus.x + offset.x, y: focus.y + offset.y };
    this.focusOn(pos, moveSpeed);
  }
}

export default Camera;
