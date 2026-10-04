"use strict";
// Phase 3 preset tests — run with: node --test tests/presets.test.js
const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

require("../com.logogridgenerator.illustrator/js/geometry.js");
const P = require("../com.logogridgenerator.illustrator/js/presets.js");

function memStore(initial) {
  let v = initial === undefined ? null : initial;
  return { get: () => v, set: (nv) => { v = nv; } };
}

const GOOD = { rings: 6, spacing: 20, stroke: 1, opacity: 40, color: "#000000" };

describe("presets", () => {
  it("lists 4 built-ins with empty store", () => {
    const all = P.list(memStore());
    assert.equal(all.length, 4);
    assert.ok(all.every((p) => p.builtin));
  });
  it("get returns a copy of Circular Pro", () => {
    const s = P.get(memStore(), "Circular Pro");
    assert.deepEqual(s, GOOD);
    s.rings = 99;
    assert.equal(P.get(memStore(), "Circular Pro").rings, 6);
  });
  it("save + list + get custom", () => {
    const st = memStore();
    assert.deepEqual(P.save(st, "My Grid", GOOD), { ok: true });
    const all = P.list(st);
    assert.equal(all.length, 5);
    assert.deepEqual(P.get(st, "My Grid"), GOOD);
  });
  it("rejects empty name and builtin names", () => {
    const st = memStore();
    assert.equal(P.save(st, "   ", GOOD).ok, false);
    assert.equal(P.save(st, "Basic Logo", GOOD).ok, false);
  });
  it("rejects invalid settings (Rings=-5)", () => {
    const st = memStore();
    assert.equal(P.save(st, "Bad", { ...GOOD, rings: -5 }).ok, false);
    assert.equal(P.list(st).length, 4);
  });
  it("remove custom, protects built-ins", () => {
    const st = memStore();
    P.save(st, "Temp", GOOD);
    assert.equal(P.remove(st, "Basic Logo").ok, false);
    assert.deepEqual(P.remove(st, "Temp"), { ok: true });
    assert.equal(P.get(st, "Temp"), null);
  });
  it("corrupt store JSON is ignored", () => {
    const all = P.list(memStore("{not json"));
    assert.equal(all.length, 4);
  });
});
