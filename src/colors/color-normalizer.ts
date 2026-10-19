import { ColorKind, ColorRef } from "../model/selection-info";

/**
 * Normalize color representations and deduplicate (spec 9.2 / 9.3).
 * Pure: no Illustrator access. Near colors are NEVER auto-merged — a small
 * difference can be intentional in a brand identity.
 */

export function colorToKey(c: ColorRef): string {
    switch (c.kind) {
        case "rgb":
            return c.hex ? c.hex.toLowerCase() : `rgb:${(c.rgb || []).join(",")}`;
        case "cmyk":
            return `cmyk:${(c.cmyk || []).join(",")}`;
        case "gray":
            return `gray:${(c.rgb || []).join(",")}`;
        case "spot":
            return `spot:${(c.name || "?").toLowerCase()}`;
        case "gradient":
            return `gradient:${(c.gradientStops || []).map(colorToKey).join("|")}`;
        case "pattern":
            return "pattern";
        case "none":
            return "none";
        default:
            return "unknown";
    }
}

export interface NormalizedColor {
    key: string;
    kind: ColorKind;
    hex?: string;
    rgb?: [number, number, number];
    cmyk?: [number, number, number, number];
    name?: string;
    label: string;
}

export function normalizeColor(c: ColorRef): NormalizedColor {
    return {
        key: colorToKey(c),
        kind: c.kind,
        hex: c.hex,
        rgb: c.rgb,
        cmyk: c.cmyk,
        name: c.name,
        label: c.name || c.hex || c.kind,
    };
}

export interface DedupedColor extends NormalizedColor {
    occurrences: number;
}

/** Skip colors that carry no usable value. */
function isSkip(c: ColorRef | null | undefined): boolean {
    return !c || c.kind === "none" || c.kind === "unknown";
}

export function dedupeColors(colors: ColorRef[]): DedupedColor[] {
    const map = new Map<string, DedupedColor>();
    for (const c of colors) {
        if (isSkip(c)) continue;
        const n = normalizeColor(c);
        const existing = map.get(n.key);
        if (existing) {
            existing.occurrences += 1;
        } else {
            map.set(n.key, { ...n, occurrences: 1 });
        }
    }
    return Array.from(map.values());
}
