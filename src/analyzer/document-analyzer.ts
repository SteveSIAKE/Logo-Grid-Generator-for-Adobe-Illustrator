import {
    CandidateItem,
    DocumentAnalysis,
    LayerSummary,
    RawDocumentScan,
    RawLayerScan,
} from "../model/selection-info";

/** Types that can plausibly represent a logo and are worth surfacing as candidates. */
const CANDIDATE_TYPES = new Set(["path", "compoundPath", "group", "symbol"]);

const MAX_CANDIDATES = 8;

function layerSummary(layer: RawLayerScan): LayerSummary {
    const counts: Record<string, number> = {};
    for (const it of layer.items) {
        const t = it.type || "other";
        counts[t] = (counts[t] || 0) + 1;
    }
    return {
        name: layer.name,
        itemCount: layer.itemCount,
        locked: !!layer.locked,
        hidden: !!layer.hidden,
        counts,
    };
}

/**
 * Analyze a raw document scan: aggregate counts, summarize layers and surface
 * the largest plausible logo candidates. Pure and testable without Illustrator.
 */
export function analyzeDocument(raw: RawDocumentScan): DocumentAnalysis {
    const counts: Record<string, number> = {};
    const layers: LayerSummary[] = [];
    const candidates: CandidateItem[] = [];

    for (const layer of raw.layers) {
        layers.push(layerSummary(layer));
        for (const it of layer.items) {
            const t = it.type || "other";
            counts[t] = (counts[t] || 0) + 1;
            if (CANDIDATE_TYPES.has(t) && it.width > 0 && it.height > 0) {
                candidates.push({
                    name: (it.name || "").trim() || "(sans nom)",
                    type: t,
                    width: it.width,
                    height: it.height,
                    area: it.width * it.height,
                });
            }
        }
    }

    candidates.sort((a, b) => b.area - a.area);
    const top = candidates.slice(0, MAX_CANDIDATES);

    const warnings: string[] = [];
    if (layers.length === 0) warnings.push("Aucun calque dans le document.");
    if (raw.totalItems === 0) warnings.push("Document vide : aucun objet détecté.");
    const lockedLayers = layers.filter((l) => l.locked);
    const hiddenLayers = layers.filter((l) => l.hidden);
    if (lockedLayers.length > 0) {
        warnings.push(`${lockedLayers.length} calque(s) verrouillé(s) : ${lockedLayers.map((l) => l.name).join(", ")}.`);
    }
    if (hiddenLayers.length > 0) {
        warnings.push(`${hiddenLayers.length} calque(s) masqué(s) : ${hiddenLayers.map((l) => l.name).join(", ")}.`);
    }

    return {
        layerCount: raw.layerCount,
        totalItems: raw.totalItems,
        counts,
        layers,
        candidates: top,
        warnings,
    };
}
