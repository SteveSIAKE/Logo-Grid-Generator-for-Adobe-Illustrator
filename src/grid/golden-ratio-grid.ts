import { GridRect } from "../geometry/rectangular";

export const PHI = 1.618033988749895;
export const MAX_LEVELS = 10;

/**
 * Golden-ratio grid: concentric rectangles centered on (centerX, centerY).
 * Level i size: base * PHI^i, alternating landscape (w=s, h=s/PHI)
 * and portrait (w=s/PHI, h=s) orientations.
 */
export function goldenRects(
    centerX: number,
    centerY: number,
    base: number,
    levels: number
): { phi: number; rects: GridRect[] } {
    const rects: GridRect[] = [];
    let s = base;
    for (let i = 0; i < levels; i++) {
        const w = i % 2 === 0 ? s : s / PHI;
        const h = i % 2 === 0 ? s / PHI : s;
        rects.push({ left: centerX - w / 2, top: centerY + h / 2, width: w, height: h });
        s *= PHI;
    }
    return { phi: PHI, rects };
}

/** Auto base = half of the smallest logo dimension. */
export function goldenAutoBase(bounds: { width: number; height: number }): number {
    return Math.min(bounds.width, bounds.height) / 2;
}
