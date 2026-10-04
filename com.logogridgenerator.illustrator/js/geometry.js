/* Geometry Engine (CEP runtime copy).
 * Pure math — no Illustrator calls. Mirrors src/geometry/*.ts.
 * Keep in sync with the TypeScript sources; this file is what index.html loads. */
(function (global) {
  "use strict";

  var MAX_RINGS = 100;
  var MAX_DIVISIONS = 360;

  // Bounds: { left, top, right, bottom, width, height, centerX, centerY }
  function makeBounds(left, top, width, height) {
    return {
      left: left,
      top: top,
      right: left + width,
      bottom: top - height, // Illustrator Y grows upward; top is max Y
      width: width,
      height: height,
      centerX: left + width / 2,
      centerY: top - height / 2
    };
  }

  // Mode A — global bounding box over all selected objects.
  function globalBounds(items) {
    if (!items || items.length === 0) return null;
    var minL = Infinity, maxT = -Infinity, maxR = -Infinity, minB = Infinity;
    for (var i = 0; i < items.length; i++) {
      var b = items[i];
      if (b.left < minL) minL = b.left;
      if (b.top > maxT) maxT = b.top;
      if (b.left + b.width > maxR) maxR = b.left + b.width;
      if (b.top - b.height < minB) minB = b.top - b.height;
    }
    var w = maxR - minL, h = maxT - minB;
    return makeBounds(minL, maxT, w, h);
  }

  // Circular grid: radius(i) = baseRadius + i * spacing, baseRadius = max(W,H)/2
  function circularRadii(bounds, rings, spacing) {
    var base = Math.max(bounds.width, bounds.height) / 2;
    var out = [];
    for (var i = 0; i < rings; i++) out.push(base + i * spacing);
    return { baseRadius: base, radii: out };
  }

  // Radial endpoints: angleStep = 360/N
  function radialEndpoints(centerX, centerY, radius, divisions) {
    var pts = [];
    var step = 360 / divisions;
    for (var i = 0; i < divisions; i++) {
      var a = (i * step * Math.PI) / 180;
      pts.push({ x: centerX + radius * Math.cos(a), y: centerY + radius * Math.sin(a), angle: i * step });
    }
    return { angleStep: step, points: pts };
  }

  // Units -> internal points (Illustrator scripting uses points)
  var UNIT_TO_PT = { pt: 1, px: 1, "in": 72, mm: 72 / 25.4, cm: 72 / 2.54 };
  function toPoints(value, unit) {
    var f = UNIT_TO_PT[unit || "px"];
    if (f === undefined) throw new Error("Unsupported unit: " + unit);
    return value * f;
  }

  function validateCircular(s) {
    var errs = [];
    if (!(s.rings >= 1 && s.rings <= MAX_RINGS)) errs.push("Rings must be 1–" + MAX_RINGS + ".");
    if (!(s.spacing >= 0)) errs.push("Spacing must be >= 0.");
    if (!(s.stroke >= 0)) errs.push("Stroke must be >= 0.");
    if (!(s.opacity >= 0 && s.opacity <= 100)) errs.push("Opacity must be 0–100.");
    if (!s.color || !/^#[0-9a-fA-F]{6}$/.test(s.color)) errs.push("Color must be #RRGGBB.");
    return errs;
  }

  var api = {
    MAX_RINGS: MAX_RINGS,
    MAX_DIVISIONS: MAX_DIVISIONS,
    makeBounds: makeBounds,
    globalBounds: globalBounds,
    circularRadii: circularRadii,
    radialEndpoints: radialEndpoints,
    toPoints: toPoints,
    validateCircular: validateCircular
  };

  global.LGG_Geometry = api;
  try {
    if (typeof module !== "undefined" && module.exports) module.exports = api;
  } catch (e) { /* browser: no module */ }
})(typeof globalThis !== "undefined" ? globalThis : this);
