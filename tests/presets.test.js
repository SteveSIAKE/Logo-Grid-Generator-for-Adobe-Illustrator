"use strict";
// Phase 5 preset tests (multi-type) — run with: node --test tests/presets.test.js
const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

require("../com.logogridgenerator.illustrator/js/geometry.js");
const P = require("../com.logogridgenerator.illustrator/js/presets.js");

function memStore(initial) {
  let v = initial === undefined ? null : initial;
  return { get: () => v, set: (nv) => { v = nv; } };
}

const CIRCULAR = P.withDefaults({ type: "circular", rings: 6, spacing: 20, stroke: 1, opacity: 40, color: "#000000" });
const RADIAL = P.withDefaults({ type: "radial", divisions: 12, radius: 0, rotation: 15 });

describe("presets", () => {
  it("lists 8 built-ins with empty store", () => {
    const all = P.list(memStore());
    assert.equal(all.length, 8);
    assert.ok(all.every((p) => p.builtin));
  });
  it("get returns a copy of Circular Pro", () => {
    const s = P.get(memStore(), "Circular Pro");
    assert.deepEqual(s, CIRCULAR);
    s.rings = 99;
    assert.equal(P.get(memStore(), "Circular Pro").rings, 6);
  });
  it("built-in golden/custom presets carry their type", () => {
    const g = P.get(memStore(), "Golden Progression");
    assert.equal(g.type, "golden");
    assert.equal(g.levels, 5);
    const c = P.get(memStore(), "Custom 3x2");
    assert.equal(c.type, "custom");
    assert.equal(c.columns, 3);
    assert.equal(c.rows, 2);
  });
  it("save + list + get custom radial", () => {
    const st = memStore();
    assert.deepEqual(P.save(st, "My Star", RADIAL), { ok: true });
    const all = P.list(st);
    assert.equal(all.length, 9);
    assert.deepEqual(P.get(st, "My Star"), RADIAL);
  });
  it("rejects empty name and builtin names", () => {
    const st = memStore();
    assert.equal(P.save(st, "   ", CIRCULAR).ok, false);
    assert.equal(P.save(st, "Basic Logo", CIRCULAR).ok, false);
  });
  it("rejects invalid settings per type", () => {
    const st = memStore();
    assert.equal(P.save(st, "Bad", { ...CIRCULAR, rings: -5 }).ok, false);
    assert.equal(P.save(st, "Bad2", { ...RADIAL, divisions: 500 }).ok, false);
    assert.equal(P.save(st, "Bad3", { ...CIRCULAR, type: "square", size: 0 }).ok, false);
    assert.equal(P.save(st, "Bad4", { ...CIRCULAR, type: "golden", levels: 99 }).ok, false);
    assert.equal(P.save(st, "Bad5", { ...CIRCULAR, type: "custom", gridW: 0 }).ok, false);
    assert.equal(P.list(st).length, 8);
  });
  it("backfills v0.1 circular-only customs", () => {
    const st = memStore(JSON.stringify({ Legacy: { rings: 5, spacing: 10, stroke: 1, opacity: 40, color: "#000000" } }));
    const s = P.get(st, "Legacy");
    assert.equal(s.type, "circular");
    assert.equal(s.rings, 5);
    assert.equal(s.divisions, 12); // default filled in
  });
  it("remove custom, protects built-ins", () => {
    const st = memStore();
    P.save(st, "Temp", CIRCULAR);
    assert.equal(P.remove(st, "Basic Logo").ok, false);
    assert.deepEqual(P.remove(st, "Temp"), { ok: true });
    assert.equal(P.get(st, "Temp"), null);
  });
  it("corrupt store JSON is ignored", () => {
    const all = P.list(memStore("{not json"));
    assert.equal(all.length, 8);
  });
  it("export/import round-trip", () => {
    const a = memStore();
    P.save(a, "Alpha", CIRCULAR);
    P.save(a, "Beta", RADIAL);
    const json = P.exportJson(a);
    const file = JSON.parse(json);
    assert.equal(file.app, "logo-grid-generator");
    assert.equal(file.version, 1);
    assert.equal(file.presets.length, 2);
    const b = memStore();
    const res = P.importJson(b, json);
    assert.deepEqual([res.ok, res.imported, res.skipped.length], [true, 2, 0]);
    assert.deepEqual(P.get(b, "Beta"), RADIAL);
  });
  it("import accepts single-preset format, skips invalid", () => {
    const st = memStore();
    const single = JSON.stringify({ name: "Solo", version: 1, settings: CIRCULAR });
    assert.deepEqual(P.importJson(st, single).imported, 1);
    const bad = JSON.stringify({ app: "logo-grid-generator", version: 1, presets: [
      { name: "OK", settings: CIRCULAR },
      { name: "Nope", settings: { ...CIRCULAR, rings: -2 } },
      { name: "", settings: CIRCULAR },
    ]});
    const res = P.importJson(st, bad);
    assert.equal(res.imported, 1);
    assert.equal(res.skipped.length, 2);
  });
  it("import rejects garbage", () => {
    assert.equal(P.importJson(memStore(), '{"nope":true}').ok, false);
    assert.throws(() => P.importJson(memStore(), "{invalid"), SyntaxError);
  });
});
