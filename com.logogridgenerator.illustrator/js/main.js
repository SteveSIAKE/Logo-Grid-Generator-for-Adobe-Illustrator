/* Panel controller: UI -> validation -> geometry -> host. No math in handlers. */
(function () {
  "use strict";
  function $(id) { return document.getElementById(id); }
  function setStatus(msg, kind) {
    var el = $("status");
    el.textContent = msg || "";
    el.className = "lgg-status" + (kind ? " " + kind : "");
  }
  function readSettings() {
    var selMode = "global";
    var radios = document.getElementsByName("selMode");
    for (var i = 0; i < radios.length; i++) { if (radios[i].checked) selMode = radios[i].value; }
    return {
      type: $("gridType").value,
      rings: parseInt($("rings").value, 10),
      spacing: parseFloat($("spacing").value),
      stroke: parseFloat($("stroke").value),
      opacity: parseFloat($("opacity").value),
      color: $("color").value,
      selectionMode: selMode
    };
  }
  function setBusy(b) {
    $("btnGenerate").disabled = b;
    $("btnClear").disabled = b;
  }

  async function onGenerate() {
    setStatus("");
    var s = readSettings();
    var errs = window.LGG_Geometry.validateCircular(s);
    if (errs.length) { setStatus(errs.join(" "), "error"); return; }
    setBusy(true);
    try {
      var doc = await window.LGG_Host.call("lgg_hasDocument", []);
      if (!doc.ok || !doc.hasDocument) { setStatus("No Illustrator document is open. Please open a document first.", "error"); return; }
      var sel = await window.LGG_Host.call("lgg_getSelectionInfo", []);
      if (!sel.ok) { setStatus(sel.error === "NO_HOST" ? sel.detail : "Host error: " + sel.error, "error"); return; }
      if (!sel.items || sel.items.length === 0) { setStatus("Please select a logo or object first.", "error"); return; }

      var targets = s.selectionMode === "perObject" ? sel.items : [window.LGG_Geometry.globalBounds(sel.items)];
      var style = { stroke: s.stroke, opacity: s.opacity, color: s.color };
      var made = 0;
      for (var t = 0; t < targets.length; t++) {
        var b = targets[t];
        var bounds = (b.centerX === undefined)
          ? window.LGG_Geometry.makeBounds(b.left, b.top, b.width, b.height) : b;
        var circ = window.LGG_Geometry.circularRadii(bounds, s.rings, s.spacing);
        var res = await window.LGG_Host.call("lgg_drawCircles", [bounds.centerX, bounds.centerY, circ.radii, style]);
        if (!res.ok) { setStatus("Illustrator error: " + (res.detail || res.error), "error"); return; }
        made += circ.radii.length;
      }
      setStatus("Grid created: " + made + " circle(s).", "ok");
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

  document.addEventListener("DOMContentLoaded", function () {
    $("btnGenerate").addEventListener("click", onGenerate);
    $("btnClear").addEventListener("click", onClear);
    if (!window.LGG_Host.available()) {
      setStatus("Dev preview: open via Window > Extensions in Illustrator for live host.", "");
    }
  });
})();
