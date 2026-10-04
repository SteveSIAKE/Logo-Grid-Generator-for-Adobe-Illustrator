import { Bounds } from "../geometry/bounds";
import { circularRadii } from "../geometry/circular";
import { squareRects } from "../geometry/rectangular";
import { GridSettings } from "../utils/validation";
import { PHI } from "./golden-ratio-grid";

/**
 * Outermost extent radius for the radial combination overlay (Circular + Radial).
 * Each grid type reports the radius its geometry reaches from the logo center.
 */
export function overlayRadius(s: GridSettings, bounds: Bounds): number {
    switch (s.type) {
        case "modular": {
            const aw = bounds.width + s.padding * 2;
            const ah = bounds.height + s.padding * 2;
            return Math.sqrt(aw * aw + ah * ah) / 2;
        }
        case "square": {
            const q = squareRects(bounds.centerX, bounds.centerY, s.size, s.columns, s.rows, s.spacing);
            return Math.sqrt(q.totalW * q.totalW + q.totalH * q.totalH) / 2;
        }
        case "golden": {
            const base = s.baseSize > 0 ? s.baseSize : Math.min(bounds.width, bounds.height) / 2;
            const outer = base * Math.pow(PHI, s.levels - 1);
            return Math.sqrt(outer * outer + (outer / PHI) * (outer / PHI)) / 2;
        }
        case "custom": {
            return Math.sqrt(s.gridW * s.gridW + s.gridH * s.gridH) / 2;
        }
        default: {
            // circular
            const c = circularRadii(bounds, s.rings, s.spacing);
            return c.radii.length ? c.radii[c.radii.length - 1] : c.baseRadius;
        }
    }
}
