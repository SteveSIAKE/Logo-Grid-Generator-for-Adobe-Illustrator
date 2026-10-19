// Logo Presentation Studio — ExtendScript host layer (Illustrator).
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

function lgg_typeToKind(typename) {
    switch (typename) {
        case "PathItem": return "path";
        case "CompoundPathItem": return "compoundPath";
        case "GroupItem": return "group";
        case "TextFrame": return "text";
        case "PlacedItem": return "placed";
        case "RasterItem": return "raster";
        case "MeshItem": return "mesh";
        case "SymbolItem": return "symbol";
        default: return "other";
    }
}

function lgg_rgbToHex(r, g, b) {
    function h(x) { var s = Math.round(x).toString(16); return s.length < 2 ? "0" + s : s; }
    return "#" + h(r) + h(g) + h(b);
}

function lgg_spotToRgb(color) {
    // A spot color has no direct RGB value; approximate through its color model.
    try {
        if (color.spot && color.spot.color) {
            var inner = lgg_readColor(color.spot.color);
            return (inner && inner.rgb) ? inner.rgb : null;
        }
    } catch (e) {}
    return null;
}

// Read any Illustrator color into a JSON-safe ColorRef. Unsupported models are
// reported explicitly (spec 9.2) rather than silently flattened.
function lgg_readColor(color) {
    try {
        if (color === null || color === undefined) return null;
        var t = color.typename;
        if (t === "RGBColor") {
            return {
                kind: "rgb",
                hex: lgg_rgbToHex(color.red, color.green, color.blue),
                rgb: [Math.round(color.red), Math.round(color.green), Math.round(color.blue)]
            };
        }
        if (t === "CMYKColor") {
            return { kind: "cmyk", cmyk: [color.cyan, color.magenta, color.yellow, color.black] };
        }
        if (t === "GrayColor") {
            return { kind: "gray", rgb: [color.gray, color.gray, color.gray] };
        }
        if (t === "SpotColor") {
            var spotName = null;
            try { spotName = color.spot.name; } catch (e) {}
            return { kind: "spot", name: spotName, rgb: lgg_spotToRgb(color) };
        }
        if (t === "GradientColor") {
            var stops = [];
            try {
                var gs = color.gradient.gradientStops;
                for (var i = 0; i < gs.length && i < 8; i++) {
                    stops.push(lgg_readColor(gs[i].color));
                }
            } catch (e) {}
            return { kind: "gradient", gradientStops: stops };
        }
        if (t === "NoColor") return { kind: "none" };
        if (t === "PatternColor") return { kind: "pattern" };
        return { kind: "unknown" };
    } catch (e) {
        return { kind: "unknown" };
    }
}

function lgg_getSelectionInfo() {
    try {
        if (app.documents.length === 0) {
            return lgg_json({ ok: false, error: "NO_DOCUMENT", detail: "No Illustrator document is open." });
        }
        var doc = app.activeDocument;
        var sel = doc.selection;
        var items = [];
        for (var i = 0; i < sel.length; i++) {
            try {
                var it = sel[i];
                var b = it.geometricBounds; // [left, top, right, bottom]
                var rec = {
                    objectType: lgg_typeToKind(it.typename),
                    name: (it.name !== undefined && it.name !== null && it.name !== "") ? it.name : "",
                    layerName: (it.layer && it.layer.name) ? it.layer.name : "",
                    bounds: {
                        left: b[0], top: b[1], right: b[2], bottom: b[3],
                        width: b[2] - b[0], height: b[1] - b[3],
                        centerX: (b[0] + b[2]) / 2, centerY: (b[1] + b[3]) / 2
                    },
                    locked: !!it.locked,
                    hidden: (it.hidden === true),
                    isText: (it.typename === "TextFrame")
                };
                try { rec.filled = !!it.filled; } catch (eF) { /* non-path item */ }
                try { rec.stroked = !!it.stroked; } catch (eS) { /* non-path item */ }
                if (rec.isText) {
                    try {
                        var ca = it.textRange.characterAttributes;
                        rec.textFamily = (ca.textFont && ca.textFont.name) ? ca.textFont.name : "";
                        rec.textStyle = "";
                        try { rec.textStyle = (ca.textFont && ca.textFont.fontStyleName) ? ca.textFont.fontStyleName : ""; } catch (eSt) {}
                        rec.textSize = (ca.size !== undefined && ca.size !== null) ? ca.size : 0;
                    } catch (eT) { /* unreadable text attributes */ }
                }
                try { rec.fill = lgg_readColor(it.fillColor); } catch (eC) { rec.fill = null; }
                try { rec.stroke = lgg_readColor(it.strokeColor); } catch (eC2) { rec.stroke = null; }
                items.push(rec);
            } catch (e2) { /* skip unreadable selection entries */ }
        }
        return lgg_json({ ok: true, count: items.length, items: items });
    } catch (e) {
        return lgg_json({ ok: false, error: "HOST_ERROR", detail: String(e) });
    }
}

// Scan the document: per-layer summary + raw item list (capped for perf, spec 22).
function lps_scanDocument() {
    try {
        if (app.documents.length === 0) {
            return lgg_json({ ok: false, error: "NO_DOCUMENT", detail: "No Illustrator document is open." });
        }
        var doc = app.activeDocument;
        var MAX_ITEMS = 2000;
        var layers = [];
        var total = 0;
        for (var li = 0; li < doc.layers.length; li++) {
            var layer = doc.layers[li];
            var pageItems = layer.pageItems;
            var layerItems = [];
            for (var ii = 0; ii < pageItems.length && total < MAX_ITEMS; ii++) {
                var it = pageItems[ii];
                total++;
                try {
                    var b = it.geometricBounds;
                    layerItems.push({
                        type: lgg_typeToKind(it.typename),
                        name: (it.name !== undefined && it.name !== null) ? it.name : "",
                        width: b[2] - b[0],
                        height: b[1] - b[3]
                    });
                } catch (e) { /* skip unreadable item */ }
            }
            layers.push({
                name: layer.name,
                locked: !!layer.locked,
                hidden: (layer.visible === false),
                itemCount: pageItems.length,
                items: layerItems
            });
        }
        return lgg_json({ ok: true, layerCount: layers.length, totalItems: total, layers: layers });
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
    if (style && style.dash && style.dash.length) {
        try { item.strokeDashes = style.dash; } catch (eD) { /* dash unsupported -> solid */ }
    }
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
    layer.visible = true; // a new generation is always shown; use Hide to conceal it
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

function lgg_gridInfo() {
    try {
        if (app.documents.length === 0) {
            return lgg_json({ ok: true, exists: false });
        }
        var layer = null;
        try { layer = app.activeDocument.layers.getByName(LGG_LAYER_NAME); } catch (e) { layer = null; }
        if (layer === null || layer === undefined) {
            return lgg_json({ ok: true, exists: false });
        }
        var guides = false;
        try {
            if (layer.groupItems.length > 0 && layer.groupItems[0].pathItems.length > 0) {
                guides = !!layer.groupItems[0].pathItems[0].guides;
            }
        } catch (e2) { /* keep default */ }
        return lgg_json({ ok: true, exists: true, locked: !!layer.locked, visible: layer.visible !== false, guides: guides });
    } catch (e) {
        return lgg_json({ ok: false, error: "HOST_ERROR", detail: String(e) });
    }
}

function lgg_setGridVisible(visible) {    try {
        if (app.documents.length === 0) {
            return lgg_json({ ok: false, error: "NO_DOCUMENT", detail: "No Illustrator document is open." });
        }
        var layer = null;
        try { layer = app.activeDocument.layers.getByName(LGG_LAYER_NAME); } catch (e) { layer = null; }
        if (layer === null || layer === undefined) {
            return lgg_json({ ok: true, exists: false, visible: false });
        }
        layer.visible = !!visible;
        return lgg_json({ ok: true, exists: true, visible: !!visible });
    } catch (e) {
        return lgg_json({ ok: false, error: "HOST_ERROR", detail: String(e) });
    }
}

// Artwork <-> Guide conversion for everything the extension generated.
// guidesOn=true turns grid paths into Illustrator guides, false reverts to artwork.
function lgg_setGuideMode(guidesOn) {
    try {
        if (app.documents.length === 0) {
            return lgg_json({ ok: false, error: "NO_DOCUMENT", detail: "No Illustrator document is open." });
        }
        var layer = null;
        try { layer = app.activeDocument.layers.getByName(LGG_LAYER_NAME); } catch (e) { layer = null; }
        if (layer === null || layer === undefined) {
            return lgg_json({ ok: true, exists: false, count: 0 });
        }
        var count = 0;
        for (var gi = 0; gi < layer.groupItems.length; gi++) {
            var gr = layer.groupItems[gi];
            for (var pi = 0; pi < gr.pathItems.length; pi++) {
                try { gr.pathItems[pi].guides = !!guidesOn; count++; } catch (e2) { /* skip */ }
            }
        }
        return lgg_json({ ok: true, exists: true, guides: !!guidesOn, count: count });
    } catch (e) {
        return lgg_json({ ok: false, error: "HOST_ERROR", detail: String(e) });
    }
}

function lgg_setGridLocked(locked) {    try {
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
