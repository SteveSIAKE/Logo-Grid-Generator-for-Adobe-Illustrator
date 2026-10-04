export interface GridStyle {
    stroke: number;
    opacity: number; // 0-100
    color: string; // #RRGGBB
}

export type GridType = "circular" | "modular" | "square" | "radial";

export interface CircularSettings extends GridStyle {
    rings: number;
    spacing: number;
}

/** Canonical flat settings covering all grid types (shared `spacing`). */
export interface GridSettings extends GridStyle {
    type: GridType;
    rings: number;
    spacing: number;
    columns: number;
    rows: number;
    padding: number;
    size: number;
    divisions: number;
    radius: number; // 0 = auto (baseRadius)
    rotation: number;
}

export const MAX_RINGS = 100;
export const MAX_DIVISIONS = 360;
export const MAX_DIM = 50;
export const MAX_CELLS = 2500;

function isNum(x: unknown): x is number {
    return typeof x === "number" && isFinite(x);
}

function validateStyle(s: GridStyle, errs: string[]): void {
    if (!isNum(s.stroke) || s.stroke < 0) errs.push("Stroke must be >= 0.");
    if (!isNum(s.opacity) || s.opacity < 0 || s.opacity > 100) errs.push("Opacity must be 0–100.");
    if (!s.color || !/^#[0-9a-fA-F]{6}$/.test(s.color)) errs.push("Color must be #RRGGBB.");
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
    switch ((s && s.type) || "circular") {
        case "modular":
            return validateModular(s);
        case "square":
            return validateSquare(s);
        case "radial":
            return validateRadial(s);
        default:
            return validateCircular(s);
    }
}
