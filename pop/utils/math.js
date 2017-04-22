function add (v1, v2) {
  return {
    x: v1.x + v2.x,
    y: v1.y + v2.y
  };
}

function angle (a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const angle = Math.atan2(dy, dx);

  return angle;
}

function center (entity, w, h) {
  w = entity.w || w || 0;
  h = entity.h || h || 0;
  entity = entity.pos || entity;
  return {
    x: entity.x + w / 2,
    y: entity.y + h / 2
  };
}

function clamp (x, min, max) {
  return Math.max(min, Math.min(x, max));
}

function distance (a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;

  return Math.sqrt(dx * dx + dy * dy);
}

function lerp (x, inf, sup) {
  return (x-inf) / (sup-inf);
}

function gauss (x) {
  return Math.exp(- x * x);
}

function gaussDistance (x, center, dist) {
  return gauss((x-center)/dist);
}

function mix (a, b, p) {
  return a * (1 - p) + b * p;
}

function pick(arr) {
  return arr[rand(arr.length)];
}

function rand(min, max) {
  return Math.floor(randf(min, max));
}

function randf(min, max) {
  if (max == null) {
    max = min || 1;
    min = 0;
  }
  return Math.random() * (max - min) + min;
}

function randOneIn(max) {
  return rand(0, max) === 0;
}

const rnd = {
  seed: 42,
  rand: function(max, min) {
    max = max || 1;
    min = min || 0;
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return ((this.seed / 233280) * (max - min) + min) | 0;
  }
};

function smoothstep (value, inf, sup) {
  var x = clamp(lerp(value, inf, sup), 0, 1);
  return x*x*(3 - 2*x); // smooth formula
}

export default {
  add,
  angle,
  center,
  clamp,
  distance,
  gauss,
  gaussDistance,
  lerp,
  mix,
  pick,
  rand,
  randf,
  randOneIn,
  rnd,
  smoothstep
};
