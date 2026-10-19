/* Color Engine (CEP runtime copy) — pure logic, mirrors src/colors/*.ts.
 * No Illustrator access. Keep in sync with the TypeScript sources. */
(function (global) {
  "use strict";

  var ROLE_ORDER = ["principale", "secondaire", "accent"];

  function colorToKey(c) {
    switch (c.kind) {
      case "rgb": return c.hex ? c.hex.toLowerCase() : "rgb:" + (c.rgb || []).join(",");
      case "cmyk": return "cmyk:" + (c.cmyk || []).join(",");
      case "gray": return "gray:" + (c.rgb || []).join(",");
      case "spot": return "spot:" + String(c.name || "?").toLowerCase();
      case "gradient": return "gradient:" + (c.gradientStops || []).map(colorToKey).join("|");
      case "pattern": return "pattern";
      case "none": return "none";
      default: return "unknown";
    }
  }

  function normalizeColor(c) {
    return {
      key: colorToKey(c),
      kind: c.kind,
      hex: c.hex,
      rgb: c.rgb,
      cmyk: c.cmyk,
      name: c.name,
      label: c.name || c.hex || c.kind
    };
  }

  function isSkip(c) {
    return !c || c.kind === "none" || c.kind === "unknown";
  }

  function dedupeColors(colors) {
    var map = {};
    var order = [];
    for (var i = 0; i < colors.length; i++) {
      var c = colors[i];
      if (isSkip(c)) continue;
      var n = normalizeColor(c);
      if (map[n.key] === undefined) {
        n.occurrences = 1;
        map[n.key] = n;
        order.push(n.key);
      } else {
        map[n.key].occurrences++;
      }
    }
    return order.map(function (k) { return map[k]; });
  }

  function collectColors(items) {
    var raw = [];
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      if (!it.usable) continue;
      if (it.fill) raw.push(it.fill);
      if (it.stroke) raw.push(it.stroke);
    }
    return raw;
  }

  function extractPalette(items) {
    var deduped = dedupeColors(collectColors(items));
    deduped.sort(function (a, b) { return b.occurrences - a.occurrences; });
    var colors = deduped.map(function (c, i) {
      return {
        key: c.key, kind: c.kind, hex: c.hex, rgb: c.rgb, cmyk: c.cmyk, name: c.name,
        occurrences: c.occurrences,
        suggestedRole: i < ROLE_ORDER.length ? ROLE_ORDER[i] : "neutre"
      };
    });
    var warnings = [];
    if (colors.length === 0) warnings.push("Aucune couleur exploitable dans la sélection.");
    var gradients = colors.filter(function (c) { return c.kind === "gradient"; }).length;
    if (gradients > 0) warnings.push(gradients + " couleur(s) en dégradé : présentées comme dégradés, jamais comme couleurs uniques.");
    var spots = colors.filter(function (c) { return c.kind === "spot"; }).length;
    if (spots > 0) warnings.push(spots + " couleur(s) ton direct : conversion RGB indicative uniquement.");
    return { count: colors.length, colors: colors, warnings: warnings };
  }

  function layoutPalette(count, opts) {
    opts = opts || {};
    var cellSize = opts.cellSize === undefined ? 40 : opts.cellSize;
    var gap = opts.gap === undefined ? 10 : opts.gap;
    var maxColumns = opts.maxColumns === undefined ? 6 : opts.maxColumns;
    var n = Math.max(0, Math.floor(count));
    var columns = Math.max(1, Math.min(maxColumns, n));
    var rows = Math.max(1, Math.ceil(n / columns));
    var placements = [];
    for (var i = 0; i < n; i++) {
      var col = i % columns;
      var row = Math.floor(i / columns);
      placements.push({ index: i, x: col * (cellSize + gap), y: row * (cellSize + gap), width: cellSize, height: cellSize });
    }
    return {
      columns: columns, rows: rows, cellSize: cellSize, gap: gap,
      totalWidth: columns * cellSize + (columns - 1) * gap,
      totalHeight: rows * cellSize + (rows - 1) * gap,
      placements: placements
    };
  }

  var api = {
    colorToKey: colorToKey,
    normalizeColor: normalizeColor,
    dedupeColors: dedupeColors,
    extractPalette: extractPalette,
    layoutPalette: layoutPalette
  };

  global.LGG_Colors = api;
  try {
    if (typeof module !== "undefined" && module.exports) module.exports = api;
  } catch (e) { /* browser: no module */ }
})(typeof globalThis !== "undefined" ? globalThis : this);
