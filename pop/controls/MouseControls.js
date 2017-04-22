class MouseControls {

  pos = { x: 0, y: 0 };
  worldPos = { x: 0, y: 0 };

  left = {
    isDown: false,
    pressed: false,
    released: false,
    duration: 0
  };

  constructor (container) {
    this.el = container || document.body;

    // Handlers
    document.addEventListener("mousedown", this.down.bind(this), false);
    document.addEventListener("mouseup", this.up.bind(this), false);
    document.addEventListener("mousemove", this.move.bind(this), false);
    document.addEventListener("touchend", this.up.bind(this), false);
    document.addEventListener("touchstart", this.down.bind(this), false);
    document.addEventListener("touchmove", this.move.bind(this), false);
  }

  mousePosFromEvent (e) {
    const rect = this.el.getBoundingClientRect();
    // if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
    //     var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
    //     out.x = touch.pageX;
    //     out.y = touch.pageY;
    //   } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave') {
    //     out.x = e.pageX;
    //     out.y = e.pageY;
    //   }
    this.pos.x = (e.touches ? e.touches[0] : e).clientX - rect.left;
    this.pos.y = (e.touches ? e.touches[0] : e).clientY - rect.top;
  }

  down (e) {
    this.left.isDown = true;
    this.left.pressed = true;
    this.mousePosFromEvent(e);
  }

  up () {
    const left = this.left;
    left.isDown = false;
    left.released = true;
  }

  move (e) {
    this.mousePosFromEvent(e);
  }

  update (dt, t, camera) {
    const { left, pos, worldPos } = this;

    if (left.isDown) {
      left.duration += dt;
    }
    if (left.released) {
      left.released = false;
      left.duration = 0;
    }
    if (left.pressed) {
      left.pressed = false;
    }

    worldPos.x = pos.x - (camera ? camera.pos.x : 0);
    worldPos.y = pos.y - (camera ? camera.pos.y : 0);

  }

}

export default MouseControls;
