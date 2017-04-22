var createShader = require("gl-shader");
var TextureAtlas = require("./TextureAtlas");
var Affine = require("../Affine");
var visibleInViewport = require("../visibleInViewport");

var glslify = require('glslify');
var mainVert = glslify(__dirname+"/main.vert");
var mainFrag = glslify(__dirname+"/main.frag");

function WebGLRenderer (w, h, textures) {
  var canvas = document.createElement('canvas');
  this.w = canvas.width = w;
  this.h = canvas.height = h;
  this.view = canvas;
  var gl = this.gl = canvas.getContext('webgl');
  this.shader = createShader(gl, mainVert, mainFrag);
  this.atlas = new TextureAtlas(gl, textures);
  var buffer = this.buffer = gl.createBuffer(gl.ARRAY_BUFFER);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
}

WebGLRenderer.prototype = {
  render: function (container) {
    // Render the container
    var shader = this.shader;
    var gl = this.gl;
    var buffer = this.buffer;
    var atlas = this.atlas;
    var vw = this.w;
    var vh = this.h;

    // Data to be computed by constructSprites
    var sprites = [];
    var nbVertices = 0;

    // Add a new sprite to the buffer
    function addSprite (obj, affine) {
      var pivotX = obj.pivot && obj.pivot.x || 0;
      var pivotY = obj.pivot && obj.pivot.y || 0;
      var w = obj.width;
      var h = obj.height;
      var bound = atlas.getTileAtlasBound(obj);
      nbVertices += 6;
      [
        // first triangle
        [0, 0],
        [0, h],
        [w, h],
        // second triangle
        [0, 0],
        [w, 0],
        [w, h]
      ].forEach(function (p) {
        sprites.push(
          p[0], p[1],
          pivotX, pivotY,
          bound[0], bound[1],
          affine.m00, affine.m01,
          affine.m10, affine.m11,
          affine.v0, affine.v1
        );
      });
    }

    function constructSprites (obj, affine) {
      affine = affine.clone();
      if (obj.pos) affine.translate(obj.pos.x, obj.pos.y);
      if (obj.scale) affine.scale(obj.scale.x, obj.scale.y);
      if (obj.rotation) affine.rotate(obj.rotation);

      // Filter the tree node that are not visible in the viewport
      if (!visibleInViewport(obj, affine, vw, vh)) {
        return;
      }

      // Handle the child types
      if (obj.children) {
        obj.children.forEach(function (child) {
          constructSprites(child, affine);
        });
      }
      else {
        // TODO support for texts ?
        if (obj.texture)
          addSprite(obj, affine);
      }
    }

    // Bind the shader for a new render loop
    shader.bind();
    shader.uniforms.resolution = [ vw, vh ];
    shader.uniforms.atlas = atlas.bindTexture();
    shader.uniforms.atlasSize = atlas.size;
    shader.attributes.position.pointer();

    constructSprites(container, new Affine());

    // Send the sprites buffer to the GPU
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sprites), gl.DYNAMIC_DRAW);

    // Describe how the buffer data is encoded so the vertex shader receive the attributes
    var attrs = [
      { loc: shader.attributes.position.location, size: 2 },
      { loc: shader.attributes.pivot.location, size: 2 },
      { loc: shader.attributes.atlasPos.location, size: 2 },
      { loc: shader.attributes.transform.location[0], size: 2 },
      { loc: shader.attributes.transform.location[1], size: 2 },
      { loc: shader.attributes.offset.location, size: 2 }
    ];
    var SpriteBytes = attrs.reduce(function (b, o) {
      return b + 4 * o.size;
    }, 0);
    attrs.reduce(function (b, o) {
      gl.enableVertexAttribArray(o.loc);
      gl.vertexAttribPointer(o.loc, o.size, gl.FLOAT, false, SpriteBytes, b);
      return b + 4 * o.size;
    }, 0);

    // Clear the viewport
    gl.viewport(0, 0, vw, vh);
    gl.clearColor(1,1,1,1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the sprites
    gl.drawArrays(gl.TRIANGLES, 0, nbVertices);
  }
};

module.exports = WebGLRenderer;
