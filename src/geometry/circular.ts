import { Bounds } from "./bounds";

export const MAX_RINGS = 100;
export const MAX_DIVISIONS = 360;

/** radius(i) = baseRadius + i * spacing, baseRadius = max(W,H)/2 */
export function circularRadii(
    bounds: Bounds,
    rings: number,
    spacing: number
): { baseRadius: number; radii: number[] } {
    const baseRadius = Math.max(bounds.width, bounds.height) / 2;
    const radii: number[] = [];
    for (let i = 0; i < rings; i++) radii.push(baseRadius + i * spacing);
    return { baseRadius, radii };
}

export interface RadialPoint {
    x: number;
    y: number;
    angle: number;
}

/** angleStep = 360 / N (v0.2 radial grid, tested here from P1). */
export function radialEndpoints(
    centerX: number,
    centerY: number,
    radius: number,
    divisions: number
): { angleStep: number; points: RadialPoint[] } {
    const angleStep = 360 / divisions;
    const points: RadialPoint[] = [];
    for (let i = 0; i < divisions; i++) {
        const a = ((i * angleStep) * Math.PI) / 180;
        points.push({
            x: centerX + radius * Math.cos(a),
            y: centerY + radius * Math.sin(a),
            angle: i * angleStep,
        });
    }
    return { angleStep, points };
}
