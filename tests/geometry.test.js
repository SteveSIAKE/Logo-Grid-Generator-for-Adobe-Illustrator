"use strict";
// Phase 1+2 geometry tests — run with: node --test tests/
const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const G = require("../com.logogridgenerator.illustrator/js/geometry.js");

describe("bounds", () => {
  it("center = left + W/2, top - H/2", () => {
    const b = G.makeBounds(0, 100, 200, 100);
    assert.equal(b.centerX, 100);
    assert.equal(b.centerY, 50);
    assert.equal(b.right, 200);
    assert.equal(b.bottom, 0);
  });
  it("global bounds over two boxes", () => {
    const g = G.globalBounds([
      { left: 0, top: 100, width: 50, height: 50 },
      { left: 100, top: 80, width: 60, height: 40 },
    ]);
    assert.equal(g.left, 0);
    assert.equal(g.right, 160);
    assert.equal(g.centerX, 80);
  });
  it("empty selection -> null", () => {
    assert.equal(G.globalBounds([]), null);
  });
});

describe("circular", () => {
  it("README example: W=200 H=100 -> base=100", () => {
    const b = G.makeBounds(0, 100, 200, 100);
    const { baseRadius, radii } = G.circularRadii(b, 3, 20);
    assert.equal(baseRadius, 100);
    assert.deepEqual(radii, [100, 120, 140]);
  });
  it("constant spacing between rings", () => {
    const b = G.makeBounds(0, 50, 100, 100);
    const { radii } = G.circularRadii(b, 4, 15);
    for (let i = 1; i < radii.length; i++) {
      assert.equal(radii[i] - radii[i - 1], 15);
    }
  });
});

describe("radial", () => {
  it("N=8 -> 45deg steps", () => {
    const { angleStep, points } = G.radialEndpoints(0, 0, 100, 8);
    assert.equal(angleStep, 45);
    assert.equal(points.length, 8);
    assert.ok(Math.abs(points[0].x - 100) < 1e-9);
  });
});

describe("validation", () => {
  it("rejects Rings=-5", () => {
    const errs = G.validateCircular({ rings: -5, spacing: 20, stroke: 1, opacity: 40, color: "#000000" });
    assert.ok(errs.length > 0);
  });
  it("accepts README defaults", () => {
    const errs = G.validateCircular({ rings: 6, spacing: 20, stroke: 1, opacity: 40, color: "#000000" });
    assert.deepEqual(errs, []);
  });
  it("rejects opacity out of range", () => {
    assert.ok(G.validateCircular({ rings: 6, spacing: 20, stroke: 1, opacity: 150, color: "#000000" }).length > 0);
  });
});

describe("units", () => {
  it("10mm converts to points", () => {
    const pt = G.toPoints(10, "mm");
    assert.ok(Math.abs(pt - 28.3465) < 0.01);
  });
});
