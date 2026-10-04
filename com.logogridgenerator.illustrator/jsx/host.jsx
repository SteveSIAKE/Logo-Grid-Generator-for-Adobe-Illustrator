// Logo Grid Generator — ExtendScript host layer (Illustrator).
// Keep thin: only direct Illustrator DOM access. All math lives in the panel.
// Every function returns a JSON string: { ok: bool, ... }.

var LGG_LAYER_NAME = "LOGO GRID";
var LGG_GROUP_NAME = "GRID";

function lgg_json(o) {
    // ExtendScript has no JSON in older engines; build minimal serializer.
    return lgg_serialize(o);
}
function lgg_serialize(v) {
    if (v === null || v === undefined) return "null";
    if (typeof v === "number" || typeof v === "boolean") return String(v);
    if (typeof v === "string") return '"' + v.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
    if (v instanceof Array) {
        var parts = [];
        for (var i = 0; i < v.length; i++) parts.push(lgg_serialize(v[i]));
        return "[" + parts.join(",") + "]";
    }
    var kv = [];
    for (var k in v) {
        if (v.hasOwnProperty(k)) kv.push(lgg_serialize(k) + ":" + lgg_serialize(v[k]));
    }
    return "{" + kv.join(",") + "}";
}

function lgg_hasDocument() {
    try {
        var has = (app.documents.length > 0);
        return lgg_json({ ok: true, hasDocument: has });
    } catch (e) {
        return lgg_json({ ok: false, error: "HOST_ERROR", detail: String(e) });
    }
}

function lgg_getSelectionInfo() {
    try {
        if (app.documents.length === 0) {
            return lgg_json({ ok: false, error: "NO_DOCUMENT", detail: "No Illustrator document is open." });
        }
        var sel = app.activeDocument.selection;
        var items = [];
        for (var i = 0; i < sel.length; i++) {
            try {
                var b = sel[i].geometricBounds; // [left, top, right, bottom]
                items.push({
                    left: b[0], top: b[1],
                    width: b[2] - b[0], height: b[1] - b[3]
                });
            } catch (e2) { /* skip unreadable selection entries */ }
        }
        return lgg_json({ ok: true, count: items.length, items: items });
    } catch (e) {
        return lgg_json({ ok: false, error: "HOST_ERROR", detail: String(e) });
    }
}

function lgg_hexToRGBColor(hex) {
    var c = new RGBColor();
    c.red = parseInt(hex.substr(1, 2), 16);
    c.green = parseInt(hex.substr(3, 2), 16);
    c.blue = parseInt(hex.substr(5, 2), 16);
    return c;
}

function lgg_getGridLayer(doc) {
    var layer = null;
    try { layer = doc.layers.getByName(LGG_LAYER_NAME); } catch (e) { layer = null; }
    if (layer === null || layer === undefined) {
        layer = doc.layers.add();
        layer.name = LGG_LAYER_NAME;
    }
    return layer;
}

function lgg_applyStyle(item, style) {
    var strokeW = (style && style.stroke !== undefined) ? style.stroke : 1;
    var opacity = (style && style.opacity !== undefined) ? style.opacity : 40;
    var colorHex = (style && style.color) ? style.color : "#000000";
    item.filled = false;
    item.stroked = true;
    item.strokeWidth = strokeW;
    item.strokeColor = lgg_hexToRGBColor(colorHex);
    item.opacity = opacity;
}

// Shared prelude: checks + layer + fresh group. Returns { doc, layer, group }
// or { err, detail } on failure.
function lgg_beginGrid() {
    if (app.documents.length === 0) {
        return { err: "NO_DOCUMENT", detail: "No Illustrator document is open." };
    }
    var doc = app.activeDocument;
    if (doc.selection.length === 0) {
        return { err: "NO_SELECTION", detail: "Please select a logo or object first." };
    }
    var layer = lgg_getGridLayer(doc);
    layer.locked = false; // ensure we can draw even after a previous locked generation
    var group = layer.groupItems.add();
    group.name = LGG_GROUP_NAME;
    return { doc: doc, layer: layer, group: group };
}

function lgg_maybeLock(layer, options) {
    if (options && options.lock) {
        layer.locked = true;
    }
}

// NOTE: each generation runs inside a single evalScript call, so Illustrator
// treats it as one undo unit (single Ctrl/Cmd+Z). There is no ExtendScript
// API for explicit undo grouping — one host call is the grouping mechanism.

function lgg_drawCircles(centerX, centerY, radii, style, options) {
    try {
        var g = lgg_beginGrid();
        if (g.err) {
            return lgg_json({ ok: false, error: g.err, detail: g.detail });
        }
        var created = 0;
        for (var i = 0; i < radii.length; i++) {
            var r = radii[i];
            // ellipse(top, left, width, height, ...) — centered on (centerX, centerY)
            var e = g.group.pathItems.ellipse(centerY + r, centerX - r, r * 2, r * 2, false, false);
            lgg_applyStyle(e, style);
            e.name = "Circle " + (i + 1 < 10 ? "0" : "") + (i + 1);
            created++;
        }
        lgg_maybeLock(g.layer, options);
        return lgg_json({ ok: true, created: created });
    } catch (e) {
        return lgg_json({ ok: false, error: "HOST_ERROR", detail: String(e) });
    }
}

// rects: [{ left, top, width, height }] with top = max Y.
function lgg_drawRects(rects, style, options) {
    try {
        var g = lgg_beginGrid();
        if (g.err) {
            return lgg_json({ ok: false, error: g.err, detail: g.detail });
        }
        var created = 0;
        for (var i = 0; i < rects.length; i++) {
            var rc = rects[i];
            var p = g.group.pathItems.rectangle(rc.top, rc.left, rc.width, rc.height);
            lgg_applyStyle(p, style);
            p.name = "Rect " + (i + 1 < 10 ? "0" : "") + (i + 1);
            created++;
        }
        lgg_maybeLock(g.layer, options);
        return lgg_json({ ok: true, created: created });
    } catch (e) {
        return lgg_json({ ok: false, error: "HOST_ERROR", detail: String(e) });
    }
}

// lines: [{ x1, y1, x2, y2 }]
function lgg_drawLines(lines, style, options) {
    try {
        var g = lgg_beginGrid();
        if (g.err) {
            return lgg_json({ ok: false, error: g.err, detail: g.detail });
        }
        var created = 0;
        for (var i = 0; i < lines.length; i++) {
            var ln = lines[i];
            var p = g.group.pathItems.add();
            p.setEntirePath([[ln.x1, ln.y1], [ln.x2, ln.y2]]);
            lgg_applyStyle(p, style);
            p.name = "Line " + (i + 1 < 10 ? "0" : "") + (i + 1);
            created++;
        }
        lgg_maybeLock(g.layer, options);
        return lgg_json({ ok: true, created: created });
    } catch (e) {
        return lgg_json({ ok: false, error: "HOST_ERROR", detail: String(e) });
    }
}

// polys: [{ pts: [[x,y] x4] }] — used by the Custom grid (rotated cells).
function lgg_drawPolygons(polys, style, options) {
    try {
        var g = lgg_beginGrid();
        if (g.err) {
            return lgg_json({ ok: false, error: g.err, detail: g.detail });
        }
        var created = 0;
        for (var i = 0; i < polys.length; i++) {
            var p = g.group.pathItems.add();
            p.setEntirePath(polys[i].pts);
            p.closed = true;
            lgg_applyStyle(p, style);
            p.name = "Poly " + (i + 1 < 10 ? "0" : "") + (i + 1);
            created++;
        }
        lgg_maybeLock(g.layer, options);
        return lgg_json({ ok: true, created: created });
    } catch (e) {
        return lgg_json({ ok: false, error: "HOST_ERROR", detail: String(e) });
    }
}

function lgg_setGridLocked(locked) {
    try {
        if (app.documents.length === 0) {
            return lgg_json({ ok: false, error: "NO_DOCUMENT", detail: "No Illustrator document is open." });
        }
        var doc = app.activeDocument;
        var layer = null;
        try { layer = doc.layers.getByName(LGG_LAYER_NAME); } catch (e) { layer = null; }
        if (layer === null || layer === undefined) {
            return lgg_json({ ok: true, locked: false });
        }
        layer.locked = !!locked;
        return lgg_json({ ok: true, locked: !!locked });
    } catch (e) {
        return lgg_json({ ok: false, error: "HOST_ERROR", detail: String(e) });
    }
}

function lgg_clearGrid() {
    try {
        if (app.documents.length === 0) {
            return lgg_json({ ok: false, error: "NO_DOCUMENT", detail: "No Illustrator document is open." });
        }
        var doc = app.activeDocument;
        var layer = null;
        try { layer = doc.layers.getByName(LGG_LAYER_NAME); } catch (e) { layer = null; }
        if (layer === null || layer === undefined) {
            return lgg_json({ ok: true, removed: false });
        }
        layer.locked = false; // a locked grid layer must still be removable by Clear
        layer.remove();
        return lgg_json({ ok: true, removed: true });
    } catch (e) {
        return lgg_json({ ok: false, error: "HOST_ERROR", detail: String(e) });
    }
}
