precision highp float;

uniform sampler2D altas;
varying vec2 uv;

void main() {
  vec4 clr = texture2D(altas, uv);
  if (clr.a == 0.0) discard;
  gl_FragColor = vec4(clr.rgb, 1.0);
}
