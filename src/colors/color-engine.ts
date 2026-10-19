import { ColorRef, SelectionItem } from "../model/selection-info";
import { ColorRole, PaletteColor, PaletteResult } from "../model/palette";
import { dedupeColors } from "./color-normalizer";

/**
 * Extract a color palette from analyzed selection items (spec 9.1 / 9.2).
 * Pure: no Illustrator access.
 *
 * Roles are suggestions ordered by occurrence count. Per spec 9.5, the system
 * must NOT declare a color "official" just because it appears most often.
 */

const ROLE_ORDER: ColorRole[] = ["principale", "secondaire", "accent"];

function collectColors(items: SelectionItem[]): ColorRef[] {
    const raw: ColorRef[] = [];
    for (const it of items) {
        if (!it.usable) continue;
        if (it.fill) raw.push(it.fill);
        if (it.stroke) raw.push(it.stroke);
    }
    return raw;
}

export function extractPalette(items: SelectionItem[]): PaletteResult {
    const raw = collectColors(items);
    const deduped = dedupeColors(raw).sort((a, b) => b.occurrences - a.occurrences);

    const colors: PaletteColor[] = deduped.map((c, i) => ({
        key: c.key,
        kind: c.kind,
        hex: c.hex,
        rgb: c.rgb,
        cmyk: c.cmyk,
        name: c.name,
        occurrences: c.occurrences,
        suggestedRole: i < ROLE_ORDER.length ? ROLE_ORDER[i] : "neutre",
    }));

    const warnings: string[] = [];
    if (colors.length === 0) {
        warnings.push("Aucune couleur exploitable dans la sélection.");
    }
    const gradients = colors.filter((c) => c.kind === "gradient").length;
    if (gradients > 0) {
        warnings.push(
            `${gradients} couleur(s) en dégradé : présentées comme dégradés, jamais comme couleurs uniques.`
        );
    }
    const spots = colors.filter((c) => c.kind === "spot").length;
    if (spots > 0) {
        warnings.push(`${spots} couleur(s) ton direct : conversion RGB indicative uniquement.`);
    }

    return { count: colors.length, colors, warnings };
}
