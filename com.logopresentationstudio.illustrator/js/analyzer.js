/* Analyzer Engine (CEP runtime copy) — pure logic, mirrors src/analyzer/*.ts.
 * No Illustrator access. Keep in sync with the TypeScript sources. */
(function (global) {
  "use strict";

  var CANDIDATE_TYPES = { path: 1, compoundPath: 1, group: 1, symbol: 1 };
  var MAX_CANDIDATES = 8;

  function normalizeType(raw) {
    switch (String(raw || "").toLowerCase()) {
      case "path": case "pathitem": return "path";
      case "compoundpath": case "compoundpathitem": return "compoundPath";
      case "group": case "groupitem": return "group";
      case "text": case "textframe": return "text";
      case "placed": case "placeditem": return "placed";
      case "raster": case "rasteritem": return "raster";
      case "mesh": case "meshitem": return "mesh";
      case "symbol": case "symbolitem": return "symbol";
      default: return "other";
    }
  }

  function makeTextInfo(raw) {
    if (!raw.isText) return undefined;
    var family = String(raw.textFamily || "").trim();
    var size = (typeof raw.textSize === "number" && isFinite(raw.textSize)) ? raw.textSize : 0;
    if (!family && size === 0) return undefined;
    return { family: family || "inconnue", style: String(raw.textStyle || "").trim(), size: size };
  }

  function analyzeItem(raw, index) {
    var warnings = [];
    var name = String(raw.name || "").trim() || "(sans nom)";
    var layerName = String(raw.layerName || "").trim() || "(calque inconnu)";
    var bounds = raw.bounds;
    var width = bounds ? bounds.width : 0;
    var height = bounds ? bounds.height : 0;
    if (!(width > 0) || !(height > 0)) warnings.push("« " + name + " » : dimensions nulles ou négatives (non exploitable).");
    if (raw.hidden) warnings.push("« " + name + " » : objet masqué.");
    if (raw.locked) warnings.push("« " + name + " » : objet verrouillé.");
    var isText = !!raw.isText;
    if (isText && !String(raw.textFamily || "").trim()) warnings.push("« " + name + " » : famille typographique non lisible.");
    return {
      id: "item-" + index,
      objectType: normalizeType(raw.objectType),
      name: name,
      layerName: layerName,
      bounds: bounds,
      locked: !!raw.locked,
      hidden: !!raw.hidden,
      isText: isText,
      filled: !!raw.filled,
      stroked: !!raw.stroked,
      textInfo: makeTextInfo(raw),
      fill: raw.fill === undefined ? null : raw.fill,
      stroke: raw.stroke === undefined ? null : raw.stroke,
      warnings: warnings,
      usable: width > 0 && height > 0
    };
  }

  function analyzeSelection(raw) {
    var items = raw.map(analyzeItem);
    var usable = items.filter(function (it) { return it.usable; });
    var warnings = [];
    if (items.length === 0) warnings.push("Aucun objet sélectionné.");
    if (items.length > 0 && usable.length === 0) warnings.push("Aucun objet sélectionné n'a de dimensions exploitables.");
    var locked = items.filter(function (it) { return it.locked; }).length;
    if (locked > 0) warnings.push(locked + " objet(s) verrouillé(s) : déverrouillez-les pour les utiliser pleinement.");
    return { count: items.length, usableCount: usable.length, items: items, warnings: warnings };
  }

  function layerSummary(layer) {
    var counts = {};
    for (var i = 0; i < layer.items.length; i++) {
      var t = layer.items[i].type || "other";
      counts[t] = (counts[t] || 0) + 1;
    }
    return {
      name: layer.name,
      itemCount: layer.itemCount,
      locked: !!layer.locked,
      hidden: !!layer.hidden,
      counts: counts
    };
  }

  function analyzeDocument(raw) {
    var counts = {}, layers = [], candidates = [];
    for (var li = 0; li < raw.layers.length; li++) {
      var layer = raw.layers[li];
      layers.push(layerSummary(layer));
      for (var ii = 0; ii < layer.items.length; ii++) {
        var it = layer.items[ii];
        var t = it.type || "other";
        counts[t] = (counts[t] || 0) + 1;
        if (CANDIDATE_TYPES[t] && it.width > 0 && it.height > 0) {
          candidates.push({
            name: String(it.name || "").trim() || "(sans nom)",
            type: t,
            width: it.width,
            height: it.height,
            area: it.width * it.height
          });
        }
      }
    }
    candidates.sort(function (a, b) { return b.area - a.area; });
    var top = candidates.slice(0, MAX_CANDIDATES);
    var warnings = [];
    if (layers.length === 0) warnings.push("Aucun calque dans le document.");
    if (raw.totalItems === 0) warnings.push("Document vide : aucun objet détecté.");
    var lockedLayers = layers.filter(function (l) { return l.locked; });
    var hiddenLayers = layers.filter(function (l) { return l.hidden; });
    if (lockedLayers.length > 0) warnings.push(lockedLayers.length + " calque(s) verrouillé(s) : " + lockedLayers.map(function (l) { return l.name; }).join(", ") + ".");
    if (hiddenLayers.length > 0) warnings.push(hiddenLayers.length + " calque(s) masqué(s) : " + hiddenLayers.map(function (l) { return l.name; }).join(", ") + ".");
    return {
      layerCount: raw.layerCount,
      totalItems: raw.totalItems,
      counts: counts,
      layers: layers,
      candidates: top,
      warnings: warnings
    };
  }

  var api = {
    normalizeType: normalizeType,
    analyzeItem: analyzeItem,
    analyzeSelection: analyzeSelection,
    analyzeDocument: analyzeDocument
  };

  global.LGG_Analyzer = api;
  try {
    if (typeof module !== "undefined" && module.exports) module.exports = api;
  } catch (e) { /* browser: no module */ }
})(typeof globalThis !== "undefined" ? globalThis : this);
