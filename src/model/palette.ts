import { ColorKind } from "./selection-info";

/**
 * Palette data model (spec 9.4 / 9.5).
 * Roles are *suggestions* only: the designer must be able to change them.
 */
export type ColorRole = "principale" | "secondaire" | "accent" | "neutre";

export interface PaletteColor {
    /** normalized dedup key */
    key: string;
    kind: ColorKind;
    hex?: string;
    rgb?: [number, number, number];
    cmyk?: [number, number, number, number];
    name?: string;
    occurrences: number;
    suggestedRole: ColorRole;
}

export interface PaletteResult {
    count: number;
    colors: PaletteColor[];
    warnings: string[];
}

export interface SwatchPlacement {
    index: number;
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface PaletteLayoutResult {
    columns: number;
    rows: number;
    cellSize: number;
    gap: number;
    totalWidth: number;
    totalHeight: number;
    placements: SwatchPlacement[];
}
