import {
    Bounds,
    ColorRef,
    ObjectType,
    RawSelectionItem,
    SelectionAnalysis,
    SelectionItem,
    TextInfo,
} from "../model/selection-info";

/** Map a host type string (or object) to the normalized ObjectType union. */
export function normalizeType(raw?: string): ObjectType {
    switch ((raw || "").toLowerCase()) {
        case "path":
        case "pathitem":
            return "path";
        case "compoundpath":
        case "compoundpathitem":
            return "compoundPath";
        case "group":
        case "groupitem":
            return "group";
        case "text":
        case "textframe":
            return "text";
        case "placed":
        case "placeditem":
            return "placed";
        case "raster":
        case "rasteritem":
            return "raster";
        case "mesh":
        case "meshitem":
            return "mesh";
        case "symbol":
        case "symbolitem":
            return "symbol";
        default:
            return "other";
    }
}

function makeTextInfo(raw: RawSelectionItem): TextInfo | undefined {
    if (!raw.isText) return undefined;
    const family = (raw.textFamily || "").trim();
    const size = typeof raw.textSize === "number" && isFinite(raw.textSize) ? raw.textSize : 0;
    if (!family && size === 0) return undefined;
    return { family: family || "inconnue", style: (raw.textStyle || "").trim(), size };
}

/**
 * Normalize one raw host item. Pure: no Illustrator access.
 */
export function analyzeItem(raw: RawSelectionItem, index: number): SelectionItem {
    const warnings: string[] = [];
    const name = (raw.name || "").trim() || "(sans nom)";
    const layerName = (raw.layerName || "").trim() || "(calque inconnu)";
    const bounds: Bounds = raw.bounds;
    const width = bounds ? bounds.width : 0;
    const height = bounds ? bounds.height : 0;

    if (!(width > 0) || !(height > 0)) {
        warnings.push(`« ${name} » : dimensions nulles ou négatives (non exploitable).`);
    }
    if (raw.hidden) warnings.push(`« ${name} » : objet masqué.`);
    if (raw.locked) warnings.push(`« ${name} » : objet verrouillé.`);

    const isText = !!raw.isText;
    if (isText && !(raw.textFamily || "").trim()) {
        warnings.push(`« ${name} » : famille typographique non lisible.`);
    }

    return {
        id: `item-${index}`,
        objectType: normalizeType(raw.objectType),
        name,
        layerName,
        bounds,
        locked: !!raw.locked,
        hidden: !!raw.hidden,
        isText,
        filled: !!raw.filled,
        stroked: !!raw.stroked,
        textInfo: makeTextInfo(raw),
        fill: (raw.fill ?? null) as ColorRef | null,
        stroke: (raw.stroke ?? null) as ColorRef | null,
        warnings,
        usable: width > 0 && height > 0,
    };
}

/**
 * Analyze a raw selection. Returns normalized items plus aggregated warnings.
 * Pure and testable without Illustrator.
 */
export function analyzeSelection(raw: RawSelectionItem[]): SelectionAnalysis {
    const items = raw.map((r, i) => analyzeItem(r, i));
    const usable = items.filter((it) => it.usable);
    const warnings: string[] = [];

    if (items.length === 0) {
        warnings.push("Aucun objet sélectionné.");
    }
    if (items.length > 0 && usable.length === 0) {
        warnings.push("Aucun objet sélectionné n'a de dimensions exploitables.");
    }
    const locked = items.filter((it) => it.locked).length;
    if (locked > 0) warnings.push(`${locked} objet(s) verrouillé(s) : déverrouillez-les pour les utiliser pleinement.`);

    return { count: items.length, usableCount: usable.length, items, warnings };
}
