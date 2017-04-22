
var createTexture = require("gl-texture2d");
var TileSprite = require("../TileSprite");

function TextureAtlas (gl, textures) {
  this.gl = gl;
  this.textures = textures;
  this.canvas = document.createElement("canvas");
  this.canvas.width = 0;
  this.canvas.height = 0;
  this.ctx = this.canvas.getContext("2d");
  this.loaded = null;
}

TextureAtlas.prototype = {
  _regenerate: function () {
    var canvas = this.canvas;
    var ctx = this.ctx;
    var textures = this.textures;
    var W = 0;
    var H = 0;
    var atlas = textures.map(function (t) {
      var w = t.img.width;
      var h = t.img.height;
      W = Math.max(W, w);
      var bound = [ 0, H, w, h ];
      H += h;
      return bound;
    });
    if (W < 2) W = 2;
    if (H < 2) H = 2;
    this.atlas = atlas;
    this.size = [ W, H ];
    canvas.width = W;
    canvas.height = H;
    ctx.clearRect(0, 0, W, H);
    atlas.reduce(function (y, sprite, i) {
      var img = textures[i].img;
      ctx.drawImage(img, 0, y);
      return y + img.height;
    }, 0);
    if (this.texture) this.texture.dispose();
    this.texture = createTexture(this.gl, canvas);
    this.texture.minFilter = this.gl.LINEAR;
  },
  bindTexture: function () {
    var loaded = this.textures.filter(function (t) { return t.loaded; }).length;
    if (loaded !== this.loaded) {
      this.loaded = loaded;
      this._regenerate();
    }
    return this.texture.bind();
  },
  getTileAtlasBound: function (tile) {
    var i = this.textures.indexOf(tile.texture);
    if (i === -1) {
      throw new Error("tile texture is not part of the atlas textures.");
    }
    var bound = this.atlas[i];
    if (tile instanceof TileSprite) {
      var w = tile.width;
      var h = tile.height;
      var frame = tile.frame;
      var x = frame.x * w;
      var y = frame.y * h;
      return [ bound[0] + x, bound[1] + y, w, h ];
    }
    else {
      return bound;
    }
  }
};

module.exports = TextureAtlas;
