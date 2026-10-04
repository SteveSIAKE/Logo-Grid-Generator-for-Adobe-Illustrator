export interface GridPolygon {
    pts: [number, number][]; // 4 corners in order
}

/** Rotate point (px,py) around (cx,cy) by deg. */
export function rot2(
    px: number,
    py: number,
    cx: number,
    cy: number,
    deg: number
): [number, number] {
    const a = (deg * Math.PI) / 180;
    const c = Math.cos(a);
    const si = Math.sin(a);
    const dx = px - cx;
    const dy = py - cy;
    return [cx + dx * c - dy * si, cy + dx * si + dy * c];
}

/**
 * Custom grid: columns × rows cells over width × height, centered on
 * (centerX + offsetX, centerY + offsetY), rotated as a whole by rotationDeg.
 */
export function customPolygons(
    centerX: number,
    centerY: number,
    width: number,
    height: number,
    columns: number,
    rows: number,
    spacingH: number,
    spacingV: number,
    offsetX: number,
    offsetY: number,
    rotationDeg: number
): { cellW: number; cellH: number; polys: GridPolygon[] } {
    const cellW = (width - (columns - 1) * spacingH) / columns;
    const cellH = (height - (rows - 1) * spacingV) / rows;
    const gx = centerX + offsetX;
    const gy = centerY + offsetY;
    const startL = gx - width / 2;
    const startT = gy + height / 2;
    const polys: GridPolygon[] = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            const l = startL + c * (cellW + spacingH);
            const t = startT - r * (cellH + spacingV);
            const corners: [number, number][] = [
                [l, t],
                [l + cellW, t],
                [l + cellW, t - cellH],
                [l, t - cellH],
            ];
            polys.push({ pts: corners.map(([x, y]) => rot2(x, y, gx, gy, rotationDeg)) });
        }
    }
    return { cellW, cellH, polys };
}
