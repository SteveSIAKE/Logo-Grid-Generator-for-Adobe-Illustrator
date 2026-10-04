import { Bounds } from "./bounds";

export const MAX_DIM = 50;
export const MAX_CELLS = 2500;

export interface GridRect {
    left: number;
    top: number; // max Y (Illustrator coordinates)
    width: number;
    height: number;
}

/** Modular grid: split (bounds + padding) into columns × rows cells. */
export function modularRects(
    bounds: Bounds,
    columns: number,
    rows: number,
    spacing: number,
    padding: number
): { cellW: number; cellH: number; rects: GridRect[] } {
    const ax = bounds.left - padding;
    const at = bounds.top + padding;
    const aw = bounds.width + padding * 2;
    const ah = bounds.height + padding * 2;
    const cellW = (aw - (columns - 1) * spacing) / columns;
    const cellH = (ah - (rows - 1) * spacing) / rows;
    const rects: GridRect[] = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            rects.push({
                left: ax + c * (cellW + spacing),
                top: at - r * (cellH + spacing),
                width: cellW,
                height: cellH,
            });
        }
    }
    return { cellW, cellH, rects };
}

/** Square grid: columns × rows cells of size × size, centered on (centerX, centerY). */
export function squareRects(
    centerX: number,
    centerY: number,
    size: number,
    columns: number,
    rows: number,
    spacing: number
): { totalW: number; totalH: number; rects: GridRect[] } {
    const totalW = columns * size + (columns - 1) * spacing;
    const totalH = rows * size + (rows - 1) * spacing;
    const startL = centerX - totalW / 2;
    const startT = centerY + totalH / 2;
    const rects: GridRect[] = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            rects.push({
                left: startL + c * (size + spacing),
                top: startT - r * (size + spacing),
                width: size,
                height: size,
            });
        }
    }
    return { totalW, totalH, rects };
}
