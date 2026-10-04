import { GridSettings } from "../utils/validation";

export type Unit = "px" | "pt" | "mm" | "cm" | "in";

export const UNIT_TO_PT: Record<Unit, number> = {
    pt: 1,
    px: 1,
    in: 72,
    mm: 72 / 25.4,
    cm: 72 / 2.54,
};

export function isKnownUnit(u: unknown): u is Unit {
    return typeof u === "string" && (UNIT_TO_PT as Record<string, number>)[u] !== undefined;
}

/** Convert a user-entered value to internal points (Illustrator scripting unit). */
export function toPoints(value: number, unit: Unit): number {
    const f = UNIT_TO_PT[unit];
    if (f === undefined) throw new Error(`Unsupported unit: ${unit}`);
    return value * f;
}

/**
 * Linear settings keys converted to points. Unitless keys
 * (rings, levels, divisions, columns, rows, rotation) are untouched.
 * Stroke/dash stay in points by convention (Illustrator stroke unit).
 */
const LINEAR_KEYS: (keyof GridSettings)[] = [
    "spacing",
    "padding",
    "size",
    "radius",
    "baseSize",
    "gridW",
    "gridH",
    "spacingV",
    "offsetX",
    "offsetY",
];

/** Return a copy of the settings with linear values converted to points. */
export function convertToPoints(s: GridSettings): GridSettings {
    const f = toPoints(1, s.unit || "px"); // throws on unknown unit
    const out: GridSettings = { ...s };
    for (const k of LINEAR_KEYS) {
        const v = out[k];
        if (typeof v === "number" && isFinite(v)) {
            (out[k] as number) = v * f;
        }
    }
    return out;
}
