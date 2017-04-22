
attribute vec2 position; // dynamic position inside the sprite triangle
attribute vec2 pivot; // The sprite pivot relative position
attribute vec2 atlasPos; // The altas position to lookup the sprite into
attribute mat2 transform; // The 2d affine transform matrix
attribute vec2 offset; // The 2d affine offset

varying vec2 uv; // The computed atlas uv position to give to the fragment shader

uniform vec2 resolution; // the viewport size
uniform vec2 atlasSize; // the altas size

void main() {
  // Map the vertex position to the atlas lookup position
  uv = (position + atlasPos) / atlasSize;

  // Map the vertex position to the viewport position
  vec2 p = ((position - pivot) * transform + offset) / resolution;
  gl_Position = vec4((2.0 * p - 1.0) * vec2(1.0, -1.0), 0.0, 1.0);
}
