/* Geometry Engine (CEP runtime copy).
 * Pure math — no Illustrator calls. Mirrors src/geometry/*.ts.
 * Keep in sync with the TypeScript sources; this file is what index.html loads. */
(function (global) {
  "use strict";

  var MAX_RINGS = 100;
  var MAX_DIVISIONS = 360;
  var MAX_DIM = 50;      // max columns / rows for modular & square grids
  var MAX_CELLS = 2500;  // perf guard: columns * rows
  var CENTER_DOT_R = 2.5;

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

  function baseRadius(bounds) {
    return Math.max(bounds.width, bounds.height) / 2;
  }

  // Circular grid: radius(i) = baseRadius + i * spacing, baseRadius = max(W,H)/2
  function circularRadii(bounds, rings, spacing) {
    var base = baseRadius(bounds);
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

  // Radial grid lines from center, rotated by rotationDeg.
  // Line: { x1, y1, x2, y2 }
  function radialLines(centerX, centerY, radius, divisions, rotationDeg) {
    var rot = (rotationDeg * Math.PI) / 180;
    var step = 360 / divisions;
    var lines = [];
    for (var i = 0; i < divisions; i++) {
      var a = rot + (i * step * Math.PI) / 180;
      lines.push({
        x1: centerX, y1: centerY,
        x2: centerX + radius * Math.cos(a),
        y2: centerY + radius * Math.sin(a)
      });
    }
    return { angleStep: step, lines: lines };
  }

  // Rect: { left, top, width, height } with top = max Y.
  // Modular grid: split (bounds + padding) into columns x rows cells.
  function modularRects(bounds, columns, rows, spacing, padding) {
    var ax = bounds.left - padding;
    var at = bounds.top + padding;
    var aw = bounds.width + padding * 2;
    var ah = bounds.height + padding * 2;
    var cellW = (aw - (columns - 1) * spacing) / columns;
    var cellH = (ah - (rows - 1) * spacing) / rows;
    var rects = [];
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < columns; c++) {
        rects.push({
          left: ax + c * (cellW + spacing),
          top: at - r * (cellH + spacing),
          width: cellW,
          height: cellH
        });
      }
    }
    return { cellW: cellW, cellH: cellH, rects: rects };
  }

  // Square grid: columns x rows cells of size x size, centered on (centerX, centerY).
  function squareRects(centerX, centerY, size, columns, rows, spacing) {
    var totalW = columns * size + (columns - 1) * spacing;
    var totalH = rows * size + (rows - 1) * spacing;
    var startL = centerX - totalW / 2;
    var startT = centerY + totalH / 2;
    var rects = [];
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < columns; c++) {
        rects.push({
          left: startL + c * (size + spacing),
          top: startT - r * (size + spacing),
          width: size,
          height: size
        });
      }
    }
    return { totalW: totalW, totalH: totalH, rects: rects };
  }

  // Center marker: crosshair half-length L + dot radius. Lines: { x1, y1, x2, y2 }.
  function centerMarker(centerX, centerY, halfLen) {
    return {
      dotRadius: CENTER_DOT_R,
      lines: [
        { x1: centerX - halfLen, y1: centerY, x2: centerX + halfLen, y2: centerY },
        { x1: centerX, y1: centerY - halfLen, x2: centerX, y2: centerY + halfLen }
      ]
    };
  }

  // Units -> internal points (Illustrator scripting uses points)
  var UNIT_TO_PT = { pt: 1, px: 1, "in": 72, mm: 72 / 25.4, cm: 72 / 2.54 };
  function toPoints(value, unit) {
    var f = UNIT_TO_PT[unit || "px"];
    if (f === undefined) throw new Error("Unsupported unit: " + unit);
    return value * f;
  }

  function isNum(x) { return typeof x === "number" && isFinite(x); }

  function validateStyle(s, errs) {
    if (!isNum(s.stroke) || s.stroke < 0) errs.push("Stroke must be >= 0.");
    if (!isNum(s.opacity) || s.opacity < 0 || s.opacity > 100) errs.push("Opacity must be 0–100.");
    if (!s.color || !/^#[0-9a-fA-F]{6}$/.test(s.color)) errs.push("Color must be #RRGGBB.");
  }

  function validateCircular(s) {
    var errs = [];
    if (!isNum(s.rings) || s.rings < 1 || s.rings > MAX_RINGS) errs.push("Rings must be 1–" + MAX_RINGS + ".");
    if (!isNum(s.spacing) || s.spacing < 0) errs.push("Spacing must be >= 0.");
    validateStyle(s, errs);
    return errs;
  }

  function validateGridDims(s, errs) {
    if (!isNum(s.columns) || s.columns < 1 || s.columns > MAX_DIM) errs.push("Columns must be 1–" + MAX_DIM + ".");
    if (!isNum(s.rows) || s.rows < 1 || s.rows > MAX_DIM) errs.push("Rows must be 1–" + MAX_DIM + ".");
    if (isNum(s.columns) && isNum(s.rows) && s.columns * s.rows > MAX_CELLS) {
      errs.push("Columns × Rows must be ≤ " + MAX_CELLS + ".");
    }
    if (!isNum(s.spacing) || s.spacing < 0) errs.push("Spacing must be >= 0.");
  }

  function validateModular(s) {
    var errs = [];
    validateGridDims(s, errs);
    if (!isNum(s.padding) || s.padding < 0) errs.push("Padding must be >= 0.");
    validateStyle(s, errs);
    return errs;
  }

  function validateSquare(s) {
    var errs = [];
    if (!isNum(s.size) || s.size <= 0) errs.push("Size must be > 0.");
    validateGridDims(s, errs);
    validateStyle(s, errs);
    return errs;
  }

  function validateRadial(s) {
    var errs = [];
    if (!isNum(s.divisions) || s.divisions < 1 || s.divisions > MAX_DIVISIONS) {
      errs.push("Divisions must be 1–" + MAX_DIVISIONS + ".");
    }
    if (!isNum(s.radius) || s.radius < 0) errs.push("Radius must be >= 0 (0 = auto).");
    if (!isNum(s.rotation)) errs.push("Rotation must be a number.");
    validateStyle(s, errs);
    return errs;
  }

  function validateGrid(s) {
    switch ((s && s.type) || "circular") {
      case "modular": return validateModular(s);
      case "square": return validateSquare(s);
      case "radial": return validateRadial(s);
      default: return validateCircular(s);
    }
  }

  var api = {
    MAX_RINGS: MAX_RINGS,
    MAX_DIVISIONS: MAX_DIVISIONS,
    MAX_DIM: MAX_DIM,
    MAX_CELLS: MAX_CELLS,
    CENTER_DOT_R: CENTER_DOT_R,
    makeBounds: makeBounds,
    globalBounds: globalBounds,
    baseRadius: baseRadius,
    circularRadii: circularRadii,
    radialEndpoints: radialEndpoints,
    radialLines: radialLines,
    modularRects: modularRects,
    squareRects: squareRects,
    centerMarker: centerMarker,
    toPoints: toPoints,
    validateCircular: validateCircular,
    validateModular: validateModular,
    validateSquare: validateSquare,
    validateRadial: validateRadial,
    validateGrid: validateGrid
  };

  global.LGG_Geometry = api;
  try {
    if (typeof module !== "undefined" && module.exports) module.exports = api;
  } catch (e) { /* browser: no module */ }
})(typeof globalThis !== "undefined" ? globalThis : this);
