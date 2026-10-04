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

function lgg_drawCircles(centerX, centerY, radii, style) {
    try {
        if (app.documents.length === 0) {
            return lgg_json({ ok: false, error: "NO_DOCUMENT", detail: "No Illustrator document is open." });
        }
        var doc = app.activeDocument;
        if (doc.selection.length === 0) {
            return lgg_json({ ok: false, error: "NO_SELECTION", detail: "Please select a logo or object first." });
        }
        var layer = lgg_getGridLayer(doc);
        if (layer.locked) {
            return lgg_json({ ok: false, error: "LOCKED", detail: "The document or target layer is locked. Please unlock it before generating the grid." });
        }
        var group = layer.groupItems.add();
        group.name = LGG_GROUP_NAME;

        var strokeW = (style && style.stroke !== undefined) ? style.stroke : 1;
        var opacity = (style && style.opacity !== undefined) ? style.opacity : 40;
        var colorHex = (style && style.color) ? style.color : "#000000";
        var rgb = lgg_hexToRGBColor(colorHex);

        var created = 0;
        for (var i = 0; i < radii.length; i++) {
            var r = radii[i];
            // ellipse(top, left, width, height, ...) — centered on (centerX, centerY)
            var e = group.pathItems.ellipse(centerY + r, centerX - r, r * 2, r * 2, false, false);
            e.filled = false;
            e.stroked = true;
            e.strokeWidth = strokeW;
            e.strokeColor = rgb;
            e.opacity = opacity;
            e.name = "Circle " + (i + 1 < 10 ? "0" : "") + (i + 1);
            created++;
        }
        return lgg_json({ ok: true, created: created });
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
        layer.remove();
        return lgg_json({ ok: true, removed: true });
    } catch (e) {
        return lgg_json({ ok: false, error: "HOST_ERROR", detail: String(e) });
    }
}
