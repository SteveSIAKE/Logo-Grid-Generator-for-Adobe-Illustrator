export type Unit = "px" | "pt" | "mm" | "cm" | "in";

const UNIT_TO_PT: Record<Unit, number> = {
    pt: 1,
    px: 1,
    in: 72,
    mm: 72 / 25.4,
    cm: 72 / 2.54,
};

/** Convert a user-entered value to internal points (Illustrator scripting unit). */
export function toPoints(value: number, unit: Unit): number {
    const f = UNIT_TO_PT[unit];
    if (f === undefined) throw new Error(`Unsupported unit: ${unit}`);
    return value * f;
}
