"use strict";
// Phase 3 color tests — run with: node --test tests/colors.test.js
const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const C = require("../com.logopresentationstudio.illustrator/js/colors.js");

function item(fill, stroke, usable) {
  return { usable: usable !== false, fill: fill || null, stroke: stroke || null };
}
const RGB = (hex) => ({ kind: "rgb", hex, rgb: [0, 0, 0] });

describe("colorToKey", () => {
  it("keys rgb by hex (case-insensitive)", () => {
    assert.equal(C.colorToKey(RGB("#AABBCC")), "#aabbcc");
    assert.equal(C.colorToKey(RGB("#aabbcc")), "#aabbcc");
  });
  it("keys cmyk, spot and gradient explicitly", () => {
    assert.equal(C.colorToKey({ kind: "cmyk", cmyk: [10, 20, 30, 40] }), "cmyk:10,20,30,40");
    assert.equal(C.colorToKey({ kind: "spot", name: "PANTONE 185 C" }), "spot:pantone 185 c");
    assert.equal(C.colorToKey({ kind: "gradient", gradientStops: [RGB("#000000"), RGB("#ffffff")] }), "gradient:#000000|#ffffff");
  });
});

describe("dedupeColors", () => {
  it("groups identical colors and counts occurrences", () => {
    const d = C.dedupeColors([RGB("#ff0000"), RGB("#ff0000"), RGB("#00ff00")]);
    assert.equal(d.length, 2);
    const red = d.find((c) => c.hex === "#ff0000");
    assert.equal(red.occurrences, 2);
  });
  it("never merges near colors", () => {
    const d = C.dedupeColors([RGB("#ff0000"), RGB("#fe0000")]);
    assert.equal(d.length, 2);
  });
  it("skips none and unknown", () => {
    const d = C.dedupeColors([{ kind: "none" }, { kind: "unknown" }, RGB("#123456")]);
    assert.equal(d.length, 1);
    assert.equal(d[0].hex, "#123456");
  });
});

describe("extractPalette", () => {
  it("extracts, dedupes and suggests roles by occurrence", () => {
    const items = [
      item(RGB("#111111"), null),
      item(RGB("#111111"), null),
      item(RGB("#111111"), null),
      item(RGB("#222222"), null),
      item(RGB("#222222"), null),
      item(RGB("#333333"), null),
    ];
    const p = C.extractPalette(items);
    assert.equal(p.count, 3);
    assert.equal(p.colors[0].hex, "#111111");
    assert.equal(p.colors[0].suggestedRole, "principale");
    assert.equal(p.colors[1].suggestedRole, "secondaire");
    assert.equal(p.colors[2].suggestedRole, "accent");
  });
  it("includes stroke colors and ignores unusable items", () => {
    const items = [
      item(RGB("#000000"), RGB("#ffffff")),
      item(RGB("#abcdef"), null, false),
    ];
    const p = C.extractPalette(items);
    assert.equal(p.count, 2);
    assert.deepEqual(p.colors.map((c) => c.hex).sort(), ["#000000", "#ffffff"]);
  });
  it("warns about gradients and empty palettes", () => {
    const grad = C.extractPalette([item({ kind: "gradient", gradientStops: [RGB("#000000")] }, null)]);
    assert.ok(grad.warnings.some((w) => /dégradé/.test(w)));

    const empty = C.extractPalette([]);
    assert.equal(empty.count, 0);
    assert.ok(empty.warnings.some((w) => /Aucune couleur/.test(w)));
  });
});

describe("layoutPalette", () => {
  it("lays out a grid with computed columns and rows", () => {
    const l = C.layoutPalette(5, { cellSize: 40, gap: 10, maxColumns: 3 });
    assert.equal(l.columns, 3);
    assert.equal(l.rows, 2);
    assert.equal(l.placements.length, 5);
    assert.equal(l.totalWidth, 3 * 40 + 2 * 10);
    assert.equal(l.totalHeight, 2 * 40 + 1 * 10);
  });
  it("places swatches row by row", () => {
    const l = C.layoutPalette(4, { cellSize: 40, gap: 10, maxColumns: 2 });
    assert.deepEqual(l.placements[0], { index: 0, x: 0, y: 0, width: 40, height: 40 });
    assert.deepEqual(l.placements[1], { index: 1, x: 50, y: 0, width: 40, height: 40 });
    assert.deepEqual(l.placements[2], { index: 2, x: 0, y: 50, width: 40, height: 40 });
  });
  it("handles empty and single-color palettes", () => {
    assert.equal(C.layoutPalette(0).placements.length, 0);
    const one = C.layoutPalette(1, { cellSize: 20, gap: 5 });
    assert.equal(one.columns, 1);
    assert.equal(one.rows, 1);
    assert.equal(one.totalWidth, 20);
  });
});
