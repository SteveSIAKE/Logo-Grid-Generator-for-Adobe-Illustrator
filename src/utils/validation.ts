import { Unit, isKnownUnit } from "../geometry/units";

export interface GridStyle {
    stroke: number;
    opacity: number; // 0-100
    color: string; // #RRGGBB
    dash?: string; // space-separated lengths, e.g. "4 2"; empty = solid
}

export type GridType = "circular" | "modular" | "square" | "radial" | "golden" | "custom";

export interface CircularSettings extends GridStyle {
    rings: number;
    spacing: number;
}

/** Canonical flat settings covering all grid types (shared `spacing`). */
export interface GridSettings extends GridStyle {
    type: GridType;
    unit: Unit;
    rings: number;
    spacing: number;
    columns: number;
    rows: number;
    padding: number;
    size: number;
    divisions: number;
    radius: number; // 0 = auto (baseRadius)
    rotation: number;
    baseSize: number; // golden, 0 = auto
    levels: number; // golden
    gridW: number; // custom
    gridH: number; // custom
    spacingV: number; // custom vertical gap
    offsetX: number; // custom
    offsetY: number; // custom
    combine: boolean; // radial overlay on top of the main grid
    combineDiv: number;
}

export const MAX_RINGS = 100;
export const MAX_DIVISIONS = 360;
export const MAX_DIM = 50;
export const MAX_CELLS = 2500;
export const MAX_LEVELS = 10;

function isNum(x: unknown): x is number {
    return typeof x === "number" && isFinite(x);
}

function validateStyle(s: GridStyle, errs: string[]): void {
    if (!isNum(s.stroke) || s.stroke < 0) errs.push("Stroke must be >= 0.");
    if (!isNum(s.opacity) || s.opacity < 0 || s.opacity > 100) errs.push("Opacity must be 0–100.");
    if (!s.color || !/^#[0-9a-fA-F]{6}$/.test(s.color)) errs.push("Color must be #RRGGBB.");
    if (s.dash !== undefined && s.dash !== null && String(s.dash).trim() !== "") {
        const pd = parseDash(s.dash);
        if (!pd.ok) errs.push(`Dash: ${pd.error} (e.g. "4 2", empty = solid).`);
    }
}

/** Space-separated dash lengths, e.g. "4 2". Empty = solid line. */
export function parseDash(str: string): { ok: boolean; dashes?: number[]; error?: string } {
    if (str === undefined || str === null || String(str).trim() === "") {
        return { ok: true, dashes: [] };
    }
    const parts = String(str).trim().split(/\s+/);
    if (parts.length > 6) return { ok: false, error: "At most 6 dash values." };
    const out: number[] = [];
    for (const p of parts) {
        const v = parseFloat(p);
        if (!isFinite(v) || v < 0) return { ok: false, error: "Dash values must be numbers >= 0." };
        out.push(v);
    }
    return { ok: true, dashes: out };
}

/** Validate before any host call. Returns a list of human-readable errors. */
export function validateCircular(s: CircularSettings): string[] {
    const errs: string[] = [];
    if (!isNum(s.rings) || s.rings < 1 || s.rings > MAX_RINGS) errs.push(`Rings must be 1–${MAX_RINGS}.`);
    if (!isNum(s.spacing) || s.spacing < 0) errs.push("Spacing must be >= 0.");
    validateStyle(s, errs);
    return errs;
}

function validateGridDims(s: GridSettings, errs: string[]): void {
    if (!isNum(s.columns) || s.columns < 1 || s.columns > MAX_DIM) errs.push(`Columns must be 1–${MAX_DIM}.`);
    if (!isNum(s.rows) || s.rows < 1 || s.rows > MAX_DIM) errs.push(`Rows must be 1–${MAX_DIM}.`);
    if (isNum(s.columns) && isNum(s.rows) && s.columns * s.rows > MAX_CELLS) {
        errs.push(`Columns × Rows must be ≤ ${MAX_CELLS}.`);
    }
    if (!isNum(s.spacing) || s.spacing < 0) errs.push("Spacing must be >= 0.");
}

export function validateModular(s: GridSettings): string[] {
    const errs: string[] = [];
    validateGridDims(s, errs);
    if (!isNum(s.padding) || s.padding < 0) errs.push("Padding must be >= 0.");
    validateStyle(s, errs);
    return errs;
}

export function validateSquare(s: GridSettings): string[] {
    const errs: string[] = [];
    if (!isNum(s.size) || s.size <= 0) errs.push("Size must be > 0.");
    validateGridDims(s, errs);
    validateStyle(s, errs);
    return errs;
}

export function validateRadial(s: GridSettings): string[] {
    const errs: string[] = [];
    if (!isNum(s.divisions) || s.divisions < 1 || s.divisions > MAX_DIVISIONS) {
        errs.push(`Divisions must be 1–${MAX_DIVISIONS}.`);
    }
    if (!isNum(s.radius) || s.radius < 0) errs.push("Radius must be >= 0 (0 = auto).");
    if (!isNum(s.rotation)) errs.push("Rotation must be a number.");
    validateStyle(s, errs);
    return errs;
}

/** Dispatch validation by grid type (unknown type → circular). */
export function validateGrid(s: GridSettings): string[] {
    let errs: string[];
    if (s && (s.unit === undefined || s.unit === null || !isKnownUnit(s.unit))) {
        errs = ["Unknown unit (px, pt, mm, cm, in)."];
        validateStyle(s, errs);
        return errs;
    }
    switch ((s && s.type) || "circular") {
        case "modular":
            errs = validateModular(s);
            break;
        case "square":
            errs = validateSquare(s);
            break;
        case "radial":
            errs = validateRadial(s);
            break;
        case "golden":
            errs = validateGolden(s);
            break;
        case "custom":
            errs = validateCustom(s);
            break;
        default:
            errs = validateCircular(s);
            break;
    }
    if (s && s.combine && (!isNum(s.combineDiv) || s.combineDiv < 1 || s.combineDiv > MAX_DIVISIONS)) {
        errs.push(`Combine divisions must be 1–${MAX_DIVISIONS}.`);
    }
    return errs;
}

export function validateGolden(s: GridSettings): string[] {
    const errs: string[] = [];
    if (!isNum(s.baseSize) || s.baseSize < 0) errs.push("Base must be >= 0 (0 = auto).");
    if (!isNum(s.levels) || s.levels < 1 || s.levels > MAX_LEVELS) {
        errs.push(`Levels must be 1–${MAX_LEVELS}.`);
    }
    validateStyle(s, errs);
    return errs;
}

export function validateCustom(s: GridSettings): string[] {
    const errs: string[] = [];
    if (!isNum(s.gridW) || s.gridW <= 0) errs.push("Width must be > 0.");
    if (!isNum(s.gridH) || s.gridH <= 0) errs.push("Height must be > 0.");
    validateGridDims(s, errs); // columns / rows / cells + horizontal spacing
    if (!isNum(s.spacingV) || s.spacingV < 0) errs.push("V spacing must be >= 0.");
    if (!isNum(s.offsetX)) errs.push("Offset X must be a number.");
    if (!isNum(s.offsetY)) errs.push("Offset Y must be a number.");
    if (!isNum(s.rotation)) errs.push("Rotation must be a number.");
    validateStyle(s, errs);
    return errs;
}
