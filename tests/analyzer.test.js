"use strict";
// Phase 2 analyzer tests — run with: node --test tests/analyzer.test.js
const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const A = require("../com.logopresentationstudio.illustrator/js/analyzer.js");

function bounds(left, top, width, height) {
  return { left, top, right: left + width, bottom: top - height, width, height, centerX: left + width / 2, centerY: top - height / 2 };
}

describe("normalizeType", () => {
  it("maps Illustrator typename and short kinds", () => {
    assert.equal(A.normalizeType("PathItem"), "path");
    assert.equal(A.normalizeType("TextFrame"), "text");
    assert.equal(A.normalizeType("GroupItem"), "group");
    assert.equal(A.normalizeType("group"), "group");
    assert.equal(A.normalizeType("PlacedItem"), "placed");
    assert.equal(A.normalizeType("RasterItem"), "raster");
    assert.equal(A.normalizeType("SymbolItem"), "symbol");
    assert.equal(A.normalizeType("MeshItem"), "mesh");
    assert.equal(A.normalizeType("CompoundPathItem"), "compoundPath");
  });
  it("falls back to other", () => {
    assert.equal(A.normalizeType(undefined), "other");
    assert.equal(A.normalizeType("Weird"), "other");
  });
});

describe("analyzeItem", () => {
  it("normalizes names, layer and computes usable", () => {
    const it = A.analyzeItem({ objectType: "PathItem", name: " Logo ", layerName: "Art", bounds: bounds(0, 100, 50, 40) }, 0);
    assert.equal(it.id, "item-0");
    assert.equal(it.objectType, "path");
    assert.equal(it.name, "Logo");
    assert.equal(it.layerName, "Art");
    assert.equal(it.usable, true);
    assert.deepEqual(it.warnings, []);
    assert.equal(it.isText, false);
  });
  it("flags zero dimensions as unusable", () => {
    const it = A.analyzeItem({ objectType: "PathItem", name: "Flat", bounds: bounds(0, 100, 0, 40) }, 1);
    assert.equal(it.usable, false);
    assert.ok(it.warnings.some((w) => /dimensions nulles/.test(w)));
  });
  it("flags hidden and locked", () => {
    const it = A.analyzeItem({ objectType: "GroupItem", name: "G", bounds: bounds(0, 10, 10, 10), hidden: true, locked: true }, 2);
    assert.ok(it.warnings.some((w) => /masqué/.test(w)));
    assert.ok(it.warnings.some((w) => /verrouillé/.test(w)));
  });
  it("extracts text info and warns when family missing", () => {
    const ok = A.analyzeItem({ objectType: "TextFrame", name: "T", isText: true, textFamily: "Helvetica", textStyle: "Bold", textSize: 24, bounds: bounds(0, 10, 40, 10) }, 3);
    assert.deepEqual(ok.textInfo, { family: "Helvetica", style: "Bold", size: 24 });
    assert.equal(ok.warnings.length, 0);

    const bad = A.analyzeItem({ objectType: "TextFrame", name: "Outlined", isText: true, bounds: bounds(0, 10, 40, 10) }, 4);
    assert.equal(bad.textInfo, undefined);
    assert.ok(bad.warnings.some((w) => /famille typographique/.test(w)));
  });
});

describe("analyzeSelection", () => {
  it("returns empty state with a warning", () => {
    const r = A.analyzeSelection([]);
    assert.equal(r.count, 0);
    assert.equal(r.usableCount, 0);
    assert.ok(r.warnings.some((w) => /Aucun objet sélectionné/.test(w)));
  });
  it("counts usable items", () => {
    const r = A.analyzeSelection([
      { objectType: "PathItem", name: "A", bounds: bounds(0, 10, 20, 20) },
      { objectType: "PathItem", name: "B", bounds: bounds(0, 10, 0, 0) },
    ]);
    assert.equal(r.count, 2);
    assert.equal(r.usableCount, 1);
  });
  it("warns when none is usable", () => {
    const r = A.analyzeSelection([
      { objectType: "PathItem", name: "B", bounds: bounds(0, 10, 0, 0) },
    ]);
    assert.equal(r.usableCount, 0);
    assert.ok(r.warnings.some((w) => /dimensions exploitables/.test(w)));
  });
  it("aggregates locked warning", () => {
    const r = A.analyzeSelection([
      { objectType: "PathItem", name: "A", bounds: bounds(0, 10, 20, 20), locked: true },
    ]);
    assert.ok(r.warnings.some((w) => /verrouillé/.test(w)));
  });
});

describe("analyzeDocument", () => {
  const scan = {
    layerCount: 3,
    totalItems: 5,
    layers: [
      { name: "Logo", locked: false, hidden: false, itemCount: 2, items: [
        { type: "path", name: "Big", width: 200, height: 100 },
        { type: "text", name: "Tag", width: 80, height: 20 },
      ] },
      { name: "Locked", locked: true, hidden: false, itemCount: 1, items: [
        { type: "group", name: "Small", width: 50, height: 50 },
      ] },
      { name: "Hidden", locked: false, hidden: true, itemCount: 2, items: [
        { type: "raster", name: "Photo", width: 300, height: 200 },
        { type: "path", name: "Tiny", width: 5, height: 5 },
      ] },
    ],
  };

  it("aggregates counts and layer summaries", () => {
    const r = A.analyzeDocument(scan);
    assert.equal(r.layerCount, 3);
    assert.equal(r.totalItems, 5);
    assert.equal(r.counts.path, 2);
    assert.equal(r.counts.text, 1);
    assert.equal(r.counts.group, 1);
    assert.equal(r.counts.raster, 1);
    assert.equal(r.layers[0].counts.path, 1);
    assert.equal(r.layers[1].locked, true);
  });

  it("surfaces the largest path/group candidates by area", () => {
    const r = A.analyzeDocument(scan);
    assert.deepEqual(r.candidates.map((c) => c.name), ["Big", "Small", "Tiny"]);
    assert.equal(r.candidates[0].area, 20000);
  });

  it("warns about locked and hidden layers", () => {
    const r = A.analyzeDocument(scan);
    assert.ok(r.warnings.some((w) => /1 calque\(s\) verrouillé/.test(w)));
    assert.ok(r.warnings.some((w) => /1 calque\(s\) masqué/.test(w)));
  });

  it("handles an empty document", () => {
    const r = A.analyzeDocument({ layerCount: 0, totalItems: 0, layers: [] });
    assert.ok(r.warnings.some((w) => /Aucun calque/.test(w)));
    assert.deepEqual(r.candidates, []);
  });
});
