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
  it("radialLines: N=4 rotation=0 gives axis-aligned cross", () => {
    const { angleStep, lines } = G.radialLines(10, 20, 50, 4, 0);
    assert.equal(angleStep, 90);
    assert.equal(lines.length, 4);
    assert.deepEqual([lines[0].x1, lines[0].y1], [10, 20]);
    assert.ok(Math.abs(lines[0].x2 - 60) < 1e-9 && Math.abs(lines[0].y2 - 20) < 1e-9);
    assert.ok(Math.abs(lines[1].x2 - 10) < 1e-9 && Math.abs(lines[1].y2 - 70) < 1e-9);
  });
  it("radialLines: rotation=90 shifts first line up", () => {
    const { lines } = G.radialLines(0, 0, 50, 4, 90);
    assert.ok(Math.abs(lines[0].x2 - 0) < 1e-9 && Math.abs(lines[0].y2 - 50) < 1e-9);
  });
  it("centerMarker: crosshair + dot", () => {
    const m = G.centerMarker(0, 0, 12);
    assert.equal(m.dotRadius, 2.5);
    assert.equal(m.lines.length, 2);
    assert.deepEqual(m.lines[0], { x1: -12, y1: 0, x2: 12, y2: 0 });
  });
});

describe("modular", () => {
  it("2x2 over 100x100, no spacing/padding -> 50x50 cells covering bounds", () => {
    const b = G.makeBounds(0, 100, 100, 100);
    const { cellW, cellH, rects } = G.modularRects(b, 2, 2, 0, 0);
    assert.equal(cellW, 50);
    assert.equal(cellH, 50);
    assert.equal(rects.length, 4);
    assert.deepEqual(rects[0], { left: 0, top: 100, width: 50, height: 50 });
    assert.deepEqual(rects[3], { left: 50, top: 50, width: 50, height: 50 });
  });
  it("padding inflates area, spacing shrinks cells", () => {
    const b = G.makeBounds(0, 100, 100, 100);
    const { cellW, rects } = G.modularRects(b, 2, 2, 10, 5);
    // area 110 wide -> (110-10)/2 = 50
    assert.equal(cellW, 50);
    assert.equal(rects[0].left, -5);
    assert.equal(rects[1].left, -5 + 50 + 10);
  });
});

describe("square", () => {
  it("2x2 size 40 spacing 10 centered on origin", () => {
    const { totalW, totalH, rects } = G.squareRects(0, 0, 40, 2, 2, 10);
    assert.equal(totalW, 90);
    assert.equal(totalH, 90);
    assert.equal(rects.length, 4);
    // symmetric around center
    const cx = (rects[0].left + rects[3].left + rects[3].width) / 2;
    const cy = (rects[0].top + rects[3].top - rects[3].height) / 2;
    assert.ok(Math.abs(cx - 0) < 1e-9);
    assert.ok(Math.abs(cy - 0) < 1e-9);
    assert.ok(rects.every((r) => r.width === 40 && r.height === 40));
  });
});

describe("golden", () => {
  it("levels grow by PHI and alternate orientation", () => {
    const { phi, rects } = G.goldenRects(0, 0, 100, 4);
    assert.ok(Math.abs(phi - 1.618033988749895) < 1e-12);
    assert.equal(rects.length, 4);
    // level 0 landscape: w=100, h=100/PHI
    assert.equal(rects[0].width, 100);
    assert.ok(Math.abs(rects[0].height - 100 / phi) < 1e-9);
    // level 1 portrait: w=100*PHI/PHI=100... check growth instead
    assert.ok(Math.abs(rects[1].height - 100 * phi) < 1e-9);
    assert.ok(Math.abs(rects[2].width - 100 * phi * phi) < 1e-9);
    // all centered on origin
    for (const r of rects) {
      assert.ok(Math.abs(r.left + r.width / 2) < 1e-9);
      assert.ok(Math.abs(r.top - r.height / 2) < 1e-9);
    }
  });
  it("w/h ratio is PHI", () => {
    const { rects } = G.goldenRects(10, 20, 50, 3);
    for (const r of rects) {
      const ratio = Math.max(r.width, r.height) / Math.min(r.width, r.height);
      assert.ok(Math.abs(ratio - G.PHI) < 1e-9);
    }
  });
});

describe("custom", () => {
  it("2x2 no rotation/offset: axis-aligned cells", () => {
    const { cellW, cellH, polys } = G.customPolygons(0, 0, 100, 60, 2, 2, 10, 10, 0, 0, 0);
    assert.equal(cellW, 45);
    assert.equal(cellH, 25);
    assert.equal(polys.length, 4);
    assert.deepEqual(polys[0].pts, [[-50, 30], [-5, 30], [-5, 5], [-50, 5]]);
  });
  it("offset shifts the whole grid", () => {
    const a = G.customPolygons(0, 0, 100, 60, 1, 1, 0, 0, 0, 0, 0);
    const b = G.customPolygons(0, 0, 100, 60, 1, 1, 0, 0, 10, -5, 0);
    assert.deepEqual(b.polys[0].pts[0], [a.polys[0].pts[0][0] + 10, a.polys[0].pts[0][1] - 5]);
  });
  it("rotation=90 preserves extents, rotation=0 is identity", () => {
    const plain = G.customPolygons(0, 0, 100, 60, 1, 1, 0, 0, 0, 0, 0);
    assert.deepEqual(plain.polys[0].pts, [[-50, 30], [50, 30], [50, -30], [-50, -30]]);
    const rot = G.customPolygons(0, 0, 100, 60, 1, 1, 0, 0, 0, 0, 90);
    const xs = rot.polys[0].pts.map((p) => p[0]).sort((x, y) => x - y);
    assert.ok(Math.abs(xs[0] + 30) < 1e-9 && Math.abs(xs[3] - 30) < 1e-9);
  });
});

describe("combine", () => {
  it("overlayRadius matches outer ring for circular", () => {
    const b = G.makeBounds(0, 100, 200, 100);
    const s = { type: "circular", rings: 3, spacing: 20 };
    assert.equal(G.overlayRadius(s, b), 140);
  });
  it("overlayRadius covers custom grid diagonal", () => {
    const b = G.makeBounds(0, 0, 10, 10);
    const s = { type: "custom", gridW: 60, gridH: 80 };
    assert.equal(G.overlayRadius(s, b), 50);
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
  it("validateGrid dispatches per type", () => {
    const base = { stroke: 1, opacity: 40, color: "#000000" };
    assert.deepEqual(G.validateGrid({ type: "circular", rings: 6, spacing: 20, ...base }), []);
    assert.deepEqual(G.validateGrid({ type: "modular", columns: 4, rows: 4, spacing: 10, padding: 20, ...base }), []);
    assert.deepEqual(G.validateGrid({ type: "square", size: 40, columns: 3, rows: 3, spacing: 10, ...base }), []);
    assert.deepEqual(G.validateGrid({ type: "radial", divisions: 12, radius: 0, rotation: 0, ...base }), []);
    assert.deepEqual(G.validateGrid({ type: "golden", baseSize: 0, levels: 5, ...base }), []);
    assert.deepEqual(G.validateGrid({ type: "custom", gridW: 240, gridH: 120, columns: 3, rows: 2, spacing: 10, spacingV: 10, offsetX: 0, offsetY: 0, rotation: 0, ...base }), []);
    assert.ok(G.validateGrid({ type: "modular", columns: 0, rows: 4, spacing: 10, padding: 0, ...base }).length > 0);
    assert.ok(G.validateGrid({ type: "modular", columns: 51, rows: 51, spacing: 0, padding: 0, ...base }).length > 0);
    assert.ok(G.validateGrid({ type: "square", size: 0, columns: 2, rows: 2, spacing: 5, ...base }).length > 0);
    assert.ok(G.validateGrid({ type: "radial", divisions: 361, radius: 10, rotation: 0, ...base }).length > 0);
    assert.ok(G.validateGrid({ type: "radial", divisions: 8, radius: -1, rotation: 0, ...base }).length > 0);
    assert.ok(G.validateGrid({ type: "golden", baseSize: 10, levels: 99, ...base }).length > 0);
    assert.ok(G.validateGrid({ type: "custom", gridW: 0, gridH: 120, columns: 2, rows: 2, spacing: 5, spacingV: 5, offsetX: 0, offsetY: 0, rotation: 0, ...base }).length > 0);
    assert.ok(G.validateGrid({ type: "circular", rings: 6, spacing: 20, combine: true, combineDiv: 0, ...base }).length > 0);
    assert.deepEqual(G.validateGrid({ type: "circular", rings: 6, spacing: 20, combine: true, combineDiv: 12, ...base }), []);
  });
});

describe("units", () => {
  it("10mm converts to points", () => {
    const pt = G.toPoints(10, "mm");
    assert.ok(Math.abs(pt - 28.3465) < 0.01);
  });
});
