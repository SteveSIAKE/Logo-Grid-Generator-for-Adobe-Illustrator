/* Panel controller: UI -> validation -> geometry -> host. No math in handlers. */
(function () {
  "use strict";
  var LAST_KEY = "lgg.last.v1";

  function $(id) { return document.getElementById(id); }
  function setStatus(msg, kind) {
    var el = $("status");
    el.textContent = msg || "";
    el.className = "lgg-status" + (kind ? " " + kind : "");
  }
  function num(id, fallback) {
    var v = parseFloat($(id).value);
    return isFinite(v) ? v : fallback;
  }
  function readSettings() {
    var selMode = "global";
    var radios = document.getElementsByName("selMode");
    for (var i = 0; i < radios.length; i++) { if (radios[i].checked) selMode = radios[i].value; }
    return {
      type: $("gridType").value,
      rings: parseInt($("rings").value, 10),
      spacing: num("spacing", NaN),
      stroke: num("stroke", NaN),
      opacity: num("opacity", NaN),
      color: $("color").value,
      columns: parseInt($("columns").value, 10),
      rows: parseInt($("rows").value, 10),
      padding: num("padding", NaN),
      size: num("size", NaN),
      divisions: parseInt($("divisions").value, 10),
      radius: num("radius", NaN),
      rotation: num("rotation", 0),
      baseSize: num("base", NaN),
      levels: parseInt($("levels").value, 10),
      gridW: num("gwidth", NaN),
      gridH: num("gheight", NaN),
      spacingV: num("spacingV", NaN),
      offsetX: num("offX", 0),
      offsetY: num("offY", 0),
      combine: $("combine").checked,
      combineDiv: parseInt($("combineDiv").value, 10),
      selectionMode: selMode,
      lock: $("lockGrid").checked,
      preview: $("preview").checked,      showCenter: $("showCenter").checked,
      showBounds: $("showBounds").checked
    };
  }
  function applySettings(s) {
    if (s.type) { $("gridType").value = s.type; updateParamVisibility(); }
    if (s.rings !== undefined) $("rings").value = s.rings;
    if (s.spacing !== undefined) $("spacing").value = s.spacing;
    if (s.stroke !== undefined) $("stroke").value = s.stroke;
    if (s.opacity !== undefined) $("opacity").value = s.opacity;
    if (s.color) $("color").value = s.color;
    if (s.columns !== undefined) $("columns").value = s.columns;
    if (s.rows !== undefined) $("rows").value = s.rows;
    if (s.padding !== undefined) $("padding").value = s.padding;
    if (s.size !== undefined) $("size").value = s.size;
    if (s.divisions !== undefined) $("divisions").value = s.divisions;
    if (s.radius !== undefined) $("radius").value = s.radius;
    if (s.rotation !== undefined) $("rotation").value = s.rotation;
    if (s.baseSize !== undefined) $("base").value = s.baseSize;
    if (s.levels !== undefined) $("levels").value = s.levels;
    if (s.gridW !== undefined) $("gwidth").value = s.gridW;
    if (s.gridH !== undefined) $("gheight").value = s.gridH;
    if (s.spacingV !== undefined) $("spacingV").value = s.spacingV;
    if (s.offsetX !== undefined) $("offX").value = s.offsetX;
    if (s.offsetY !== undefined) $("offY").value = s.offsetY;
  }
  function persistLast(s) {
    try {
      window.localStorage.setItem(LAST_KEY, JSON.stringify({
        type: s.type, rings: s.rings, spacing: s.spacing,
        stroke: s.stroke, opacity: s.opacity, color: s.color,
        columns: s.columns, rows: s.rows, padding: s.padding, size: s.size,
        divisions: s.divisions, radius: s.radius, rotation: s.rotation,
        baseSize: s.baseSize, levels: s.levels,
        gridW: s.gridW, gridH: s.gridH, spacingV: s.spacingV,
        offsetX: s.offsetX, offsetY: s.offsetY,
        selectionMode: s.selectionMode, lock: s.lock,
        showCenter: s.showCenter, showBounds: s.showBounds,
        combine: s.combine, combineDiv: s.combineDiv,
        preview: s.preview
      }));
    } catch (e) { /* private mode etc. — persistence is best-effort */ }
  }
  function restoreLast() {
    try {
      var raw = window.localStorage.getItem(LAST_KEY);
      if (!raw) return;
      var s = JSON.parse(raw);
      applySettings(s);
      if (s.selectionMode) {
        var radios = document.getElementsByName("selMode");
        for (var i = 0; i < radios.length; i++) radios[i].checked = (radios[i].value === s.selectionMode);
      }
      if (s.lock !== undefined) $("lockGrid").checked = !!s.lock;
      if (s.showCenter !== undefined) $("showCenter").checked = !!s.showCenter;
      if (s.showBounds !== undefined) $("showBounds").checked = !!s.showBounds;
      if (s.combine !== undefined) $("combine").checked = !!s.combine;
      if (s.combineDiv !== undefined) $("combineDiv").value = s.combineDiv;
      if (s.preview !== undefined) $("preview").checked = !!s.preview;
    } catch (e) { /* corrupt -> keep defaults */ }
  }
  function setBusy(b) {
    $("btnGenerate").disabled = b;
    $("btnRegenerate").disabled = b;
    $("btnClear").disabled = b;
  }
  function presetStore() {
    return window.LGG_Presets.localStorageStore();
  }

  // Live preview: debounced auto-regenerate (README §27: 100–200 ms).
  var previewTimer = null;
  function schedulePreview() {
    if (!$("preview").checked) return;
    if (previewTimer) clearTimeout(previewTimer);
    previewTimer = setTimeout(function () {
      previewTimer = null;
      autoPreview();
    }, 180);
  }
  async function autoPreview() {
    if (previewTimer) return; // superseded
    var s = readSettings();
    if (window.LGG_Geometry.validateGrid(s).length) return; // invalid → stay silent
    setBusy(true);
    try {
      var cleared = await window.LGG_Host.call("lgg_clearGrid", []);
      if (!cleared.ok) return; // no host / no document → stay silent
      var r = await doGenerate(s);
      if (!r.ok) return;
      persistLast(s);
      setStatus("Preview: " + r.made + " " + r.kind + ".", "ok");
    } finally { setBusy(false); }
  }
  function watchPreview() {
    var ids = ["gridType", "rings", "spacing", "columns", "rows", "padding", "size",
      "divisions", "radius", "rotation", "base", "levels", "gwidth", "gheight",
      "spacingV", "offX", "offY", "stroke", "opacity", "color",
      "lockGrid", "showCenter", "showBounds", "combine", "combineDiv"];
    ids.forEach(function (id) {
      var el = $(id);
      if (!el) return;
      el.addEventListener("input", schedulePreview);
      el.addEventListener("change", schedulePreview);
    });
    var radios = document.getElementsByName("selMode");
    for (var i = 0; i < radios.length; i++) radios[i].addEventListener("change", schedulePreview);
  }
  function updateParamVisibility() {
    var t = $("gridType").value;
    var isRectGrid = (t === "modular" || t === "square" || t === "custom");
    $("params-circular").style.display = (t === "circular") ? "" : "none";
    $("row-spacing").style.display = (t === "circular" || isRectGrid) ? "" : "none";
    $("params-grid").style.display = isRectGrid ? "" : "none";
    $("params-modular").style.display = (t === "modular") ? "" : "none";
    $("params-square").style.display = (t === "square") ? "" : "none";
    $("params-radial").style.display = (t === "radial") ? "" : "none";
    $("params-rotation").style.display = (t === "radial" || t === "custom") ? "" : "none";
    $("params-golden").style.display = (t === "golden") ? "" : "none";
    $("params-custom").style.display = (t === "custom") ? "" : "none";
    $("row-combine").style.display = (t === "radial") ? "none" : "";
  }

  function toBounds(b) {
    return (b.centerX === undefined)
      ? window.LGG_Geometry.makeBounds(b.left, b.top, b.width, b.height) : b;
  }

  // Draw the main grid for one target bounds. Returns { ok, made, error, kind }.
  async function drawMain(s, bounds, style, options) {
    var cx = bounds.centerX, cy = bounds.centerY;
    if (s.type === "modular") {
      var m = window.LGG_Geometry.modularRects(bounds, s.columns, s.rows, s.spacing, s.padding);
      var rm = await window.LGG_Host.call("lgg_drawRects", [m.rects, style, options]);
      if (!rm.ok) return { ok: false, error: "Illustrator error: " + (rm.detail || rm.error) };
      return { ok: true, made: rm.created, kind: "cells" };
    }
    if (s.type === "square") {
      var q = window.LGG_Geometry.squareRects(cx, cy, s.size, s.columns, s.rows, s.spacing);
      var rq = await window.LGG_Host.call("lgg_drawRects", [q.rects, style, options]);
      if (!rq.ok) return { ok: false, error: "Illustrator error: " + (rq.detail || rq.error) };
      return { ok: true, made: rq.created, kind: "cells" };
    }
    if (s.type === "radial") {
      var radius = s.radius > 0 ? s.radius : window.LGG_Geometry.baseRadius(bounds);
      var rl = window.LGG_Geometry.radialLines(cx, cy, radius, s.divisions, s.rotation);
      var rr = await window.LGG_Host.call("lgg_drawLines", [rl.lines, style, options]);
      if (!rr.ok) return { ok: false, error: "Illustrator error: " + (rr.detail || rr.error) };
      return { ok: true, made: rr.created, kind: "lines" };
    }
    if (s.type === "golden") {
      var base = s.baseSize > 0 ? s.baseSize : window.LGG_Geometry.goldenAutoBase(bounds);
      var g = window.LGG_Geometry.goldenRects(cx, cy, base, s.levels);
      var rg = await window.LGG_Host.call("lgg_drawRects", [g.rects, style, options]);
      if (!rg.ok) return { ok: false, error: "Illustrator error: " + (rg.detail || rg.error) };
      return { ok: true, made: rg.created, kind: "rects" };
    }
    if (s.type === "custom") {
      var cp = window.LGG_Geometry.customPolygons(cx, cy, s.gridW, s.gridH, s.columns, s.rows,
        s.spacing, s.spacingV, s.offsetX, s.offsetY, s.rotation);
      var rp = await window.LGG_Host.call("lgg_drawPolygons", [cp.polys, style, options]);
      if (!rp.ok) return { ok: false, error: "Illustrator error: " + (rp.detail || rp.error) };
      return { ok: true, made: rp.created, kind: "cells" };
    }
    var circ = window.LGG_Geometry.circularRadii(bounds, s.rings, s.spacing);
    var rc = await window.LGG_Host.call("lgg_drawCircles", [cx, cy, circ.radii, style, options]);
    if (!rc.ok) return { ok: false, error: "Illustrator error: " + (rc.detail || rc.error) };
    return { ok: true, made: rc.created, kind: "circles" };
  }

  // Optional overlays: center marker + bounding box. Returns { ok, error }.
  async function drawOverlays(s, bounds, style, options) {
    if (s.showCenter) {
      var base = window.LGG_Geometry.baseRadius(bounds);
      var half = Math.max(12, base * 0.2);
      var marker = window.LGG_Geometry.centerMarker(bounds.centerX, bounds.centerY, half);
      var rl = await window.LGG_Host.call("lgg_drawLines", [marker.lines, style, options]);
      if (!rl.ok) return { ok: false, error: "Illustrator error: " + (rl.detail || rl.error) };
      var rd = await window.LGG_Host.call("lgg_drawCircles", [bounds.centerX, bounds.centerY, [marker.dotRadius], style, options]);
      if (!rd.ok) return { ok: false, error: "Illustrator error: " + (rd.detail || rd.error) };
    }
    if (s.showBounds) {
      var rb = await window.LGG_Host.call("lgg_drawRects", [[{
        left: bounds.left, top: bounds.top, width: bounds.width, height: bounds.height
      }], style, options]);
      if (!rb.ok) return { ok: false, error: "Illustrator error: " + (rb.detail || rb.error) };
    }
    return { ok: true };
  }

  // Core generation, shared by Generate and Regenerate. Returns { ok, made, kind, error }.
  async function doGenerate(s) {
    var doc = await window.LGG_Host.call("lgg_hasDocument", []);
    if (!doc.ok || !doc.hasDocument) {
      return { ok: false, error: "No Illustrator document is open. Please open a document first." };
    }
    var sel = await window.LGG_Host.call("lgg_getSelectionInfo", []);
    if (!sel.ok) return { ok: false, error: sel.error === "NO_HOST" ? sel.detail : "Host error: " + sel.error };
    if (!sel.items || sel.items.length === 0) {
      return { ok: false, error: "Please select a logo or object first." };
    }
    var targets = (s.selectionMode === "perObject" ? sel.items : [window.LGG_Geometry.globalBounds(sel.items)])
      .map(toBounds);
    var style = { stroke: s.stroke, opacity: s.opacity, color: s.color };
    var options = { lock: false }; // lock applied once at the end (overlays must stay editable)
    var made = 0, kind = "shapes";
    for (var t = 0; t < targets.length; t++) {
      var r = await drawMain(s, targets[t], style, options);
      if (!r.ok) return r;
      made += r.made;
      kind = r.kind;
      var ov = await drawOverlays(s, targets[t], style, options);
      if (!ov.ok) return ov;
      if (s.combine && s.type !== "radial") {
        var R = window.LGG_Geometry.overlayRadius(s, targets[t]);
        var combo = window.LGG_Geometry.radialLines(targets[t].centerX, targets[t].centerY, R, s.combineDiv, 0);
        var rc2 = await window.LGG_Host.call("lgg_drawLines", [combo.lines, style, options]);
        if (!rc2.ok) return { ok: false, error: "Illustrator error: " + (rc2.detail || rc2.error) };
        made += rc2.created;
      }
    }
    if (s.lock) {
      var lk = await window.LGG_Host.call("lgg_setGridLocked", [true]);
      if (!lk.ok) return { ok: false, error: "Illustrator error: " + (lk.detail || lk.error) };
    }
    return { ok: true, made: made, kind: kind };
  }

  async function onGenerate() {
    setStatus("");
    var s = readSettings();
    var errs = window.LGG_Geometry.validateGrid(s);
    if (errs.length) { setStatus(errs.join(" "), "error"); return; }
    setBusy(true);
    try {
      var r = await doGenerate(s);
      if (!r.ok) { setStatus(r.error, "error"); return; }
      persistLast(s);
      setStatus("Grid created: " + r.made + " " + r.kind + ".", "ok");
    } finally { setBusy(false); }
  }

  async function onRegenerate() {
    setStatus("");
    var s = readSettings();
    var errs = window.LGG_Geometry.validateGrid(s);
    if (errs.length) { setStatus(errs.join(" "), "error"); return; }
    setBusy(true);
    try {
      var cleared = await window.LGG_Host.call("lgg_clearGrid", []);
      if (!cleared.ok) {
        setStatus(cleared.error === "NO_HOST" ? cleared.detail : "Illustrator error: " + (cleared.detail || cleared.error), "error");
        return;
      }
      var r = await doGenerate(s);
      if (!r.ok) { setStatus(r.error, "error"); return; }
      persistLast(s);
      setStatus("Grid regenerated: " + r.made + " " + r.kind + ".", "ok");
    } finally { setBusy(false); }
  }

  async function onClear() {
    setStatus("");
    setBusy(true);
    try {
      var res = await window.LGG_Host.call("lgg_clearGrid", []);
      if (!res.ok) { setStatus(res.error === "NO_HOST" ? res.detail : "Illustrator error: " + (res.detail || res.error), "error"); return; }
      setStatus(res.removed ? "Grid removed. Logo intact." : "No grid layer to remove.", "ok");
    } finally { setBusy(false); }
  }

  function refreshPresetList(selectName) {
    var sel = $("presetSelect");
    sel.innerHTML = "";
    var items = window.LGG_Presets.list(presetStore());
    items.forEach(function (p) {
      var opt = document.createElement("option");
      opt.value = p.name;
      opt.textContent = p.name + (p.builtin ? "" : " (custom)");
      sel.appendChild(opt);
    });
    if (selectName) sel.value = selectName;
    updateDeleteButton();
  }
  function updateDeleteButton() {
    var name = $("presetSelect").value;
    $("btnDeletePreset").disabled = !name || window.LGG_Presets.isBuiltin(name);
  }
  function onPresetChange() {
    var s = window.LGG_Presets.get(presetStore(), $("presetSelect").value);
    if (s) { applySettings(s); setStatus("Preset applied: " + $("presetSelect").value + ".", ""); }
    updateDeleteButton();
  }
  function onSavePreset() {
    var name = $("presetName").value;
    var s = readSettings();
    var r = window.LGG_Presets.save(presetStore(), name, {
      type: s.type, rings: s.rings, spacing: s.spacing,
      stroke: s.stroke, opacity: s.opacity, color: s.color,
      columns: s.columns, rows: s.rows, padding: s.padding, size: s.size,
      divisions: s.divisions, radius: s.radius, rotation: s.rotation,
      baseSize: s.baseSize, levels: s.levels,
      gridW: s.gridW, gridH: s.gridH, spacingV: s.spacingV,
      offsetX: s.offsetX, offsetY: s.offsetY
    });
    if (!r.ok) { setStatus(r.error, "error"); return; }
    $("presetName").value = "";
    refreshPresetList(name.trim());
    setStatus("Preset saved.", "ok");
  }
  function onDeletePreset() {
    var name = $("presetSelect").value;
    var r = window.LGG_Presets.remove(presetStore(), name);
    if (!r.ok) { setStatus(r.error, "error"); return; }
    refreshPresetList();
    setStatus("Preset deleted.", "ok");
  }

  function onExport() {
    try {
      var json = window.LGG_Presets.exportJson(presetStore());
      var blob = new Blob([json], { type: "application/json" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "logo-grid-presets.json";
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
      setStatus("Presets exported.", "ok");
    } catch (e) {
      setStatus("Export failed.", "error");
    }
  }

  function onImportFile(ev) {
    var f = ev.target.files && ev.target.files[0];
    if (!f) return;
    var rd = new FileReader();
    rd.onload = function () {
      var res;
      try {
        res = window.LGG_Presets.importJson(presetStore(), String(rd.result));
      } catch (e) {
        setStatus("Invalid preset file.", "error");
        ev.target.value = "";
        return;
      }
      if (!res.ok) {
        setStatus(res.error, "error");
      } else {
        refreshPresetList();
        setStatus("Imported " + res.imported + " preset(s)" +
          (res.skipped.length ? " (" + res.skipped.length + " skipped)." : "."), "ok");
      }
      ev.target.value = "";
    };
    rd.readAsText(f);
  }

  document.addEventListener("DOMContentLoaded", function () {
    restoreLast();
    updateParamVisibility();
    refreshPresetList();
    watchPreview();
    $("gridType").addEventListener("change", updateParamVisibility);
    $("btnGenerate").addEventListener("click", onGenerate);
    $("btnRegenerate").addEventListener("click", onRegenerate);
    $("btnClear").addEventListener("click", onClear);
    $("presetSelect").addEventListener("change", onPresetChange);
    $("btnSavePreset").addEventListener("click", onSavePreset);
    $("btnDeletePreset").addEventListener("click", onDeletePreset);
    $("btnExport").addEventListener("click", onExport);
    $("importFile").addEventListener("change", onImportFile);
    if (!window.LGG_Host.available()) {
      setStatus("Dev preview: open via Window > Extensions in Illustrator for live host.", "");
    }
  });
})();
