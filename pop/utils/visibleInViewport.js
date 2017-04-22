
function pointInViewport (p, vw, vh) {
  return 0 <= p[0] &&
    p[0] <= vw &&
    0 <= p[1] &&
    p[1] <= vh;
}

function visibleInViewport (obj, affine, vw, vh) {
  if (obj.children) return true; // no support for Container for now
  if (obj.text) return true; // no support for Text for now
  // FIXME not sure about this pivot but this is how it works consistently with current rendering
  const x = -obj.pivot.x;
  const y = -obj.pivot.y;
  const w = obj.width;
  const h = obj.height;

  const corners = [
    [x, y],
    [x, y+h],
    [x+w, y],
    [x+w, y+h]
  ];

  // if one of 4 corners is in the viewport. the shape is (at least partially) in the viewport
  return corners.some(relativePosition => {
    const absolutePosition = affine.transform(relativePosition);
    return pointInViewport(absolutePosition, vw, vh);
  });
}

export default visibleInViewport;
