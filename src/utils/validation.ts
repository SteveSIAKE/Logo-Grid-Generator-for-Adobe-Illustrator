export interface GridStyle {
    stroke: number;
    opacity: number; // 0-100
    color: string; // #RRGGBB
}

export interface CircularSettings extends GridStyle {
    rings: number;
    spacing: number;
}

export const MAX_RINGS = 100;

/** Validate before any host call. Returns a list of human-readable errors. */
export function validateCircular(s: CircularSettings): string[] {
    const errs: string[] = [];
    if (!(s.rings >= 1 && s.rings <= MAX_RINGS)) errs.push(`Rings must be 1–${MAX_RINGS}.`);
    if (!(s.spacing >= 0)) errs.push("Spacing must be >= 0.");
    if (!(s.stroke >= 0)) errs.push("Stroke must be >= 0.");
    if (!(s.opacity >= 0 && s.opacity <= 100)) errs.push("Opacity must be 0–100.");
    if (!s.color || !/^#[0-9a-fA-F]{6}$/.test(s.color)) errs.push("Color must be #RRGGBB.");
    return errs;
}
