import { PaletteLayoutResult, SwatchPlacement } from "../model/palette";

export interface LayoutOptions {
    cellSize?: number;
    gap?: number;
    maxColumns?: number;
}

/**
 * Arrange palette swatches in a regular grid (spec 9.6).
 * Pure: no Illustrator access. Layout adapts to the number of colors.
 */
export function layoutPalette(count: number, opts: LayoutOptions = {}): PaletteLayoutResult {
    const cellSize = opts.cellSize ?? 40;
    const gap = opts.gap ?? 10;
    const maxColumns = opts.maxColumns ?? 6;
    const n = Math.max(0, Math.floor(count));

    const columns = Math.max(1, Math.min(maxColumns, n));
    const rows = Math.max(1, Math.ceil(n / columns));

    const placements: SwatchPlacement[] = [];
    for (let i = 0; i < n; i++) {
        const col = i % columns;
        const row = Math.floor(i / columns);
        placements.push({
            index: i,
            x: col * (cellSize + gap),
            y: row * (cellSize + gap),
            width: cellSize,
            height: cellSize,
        });
    }

    return {
        columns,
        rows,
        cellSize,
        gap,
        totalWidth: columns * cellSize + (columns - 1) * gap,
        totalHeight: rows * cellSize + (rows - 1) * gap,
        placements,
    };
}
