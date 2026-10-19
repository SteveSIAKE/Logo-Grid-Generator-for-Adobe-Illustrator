/**
 * Modèle de données de sélection (spec §18.1).
 * Structures pures, indépendantes d'Illustrator : les valeurs brutes sont
 * lues par la couche hôte (jsx/host.jsx) puis normalisées par les analyseurs.
 */

export interface Bounds {
    left: number;
    top: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
    centerX: number;
    centerY: number;
}

export type ObjectType =
    | "path"
    | "compoundPath"
    | "group"
    | "text"
    | "placed"
    | "raster"
    | "mesh"
    | "symbol"
    | "other";

export type ColorKind =
    | "rgb"
    | "cmyk"
    | "gray"
    | "spot"
    | "gradient"
    | "pattern"
    | "none"
    | "unknown";

export interface ColorRef {
    kind: ColorKind;
    /** #RRGGBB when representable */
    hex?: string;
    rgb?: [number, number, number];
    cmyk?: [number, number, number, number];
    /** spot / swatch name when available */
    name?: string;
    /** only for gradients: one entry per stop */
    gradientStops?: ColorRef[];
}

export interface TextInfo {
    family: string;
    style: string;
    size: number;
}

/**
 * Raw item as returned by the host layer. Optional fields reflect the fact
 * that some properties may be unreadable on certain object types.
 */
export interface RawSelectionItem {
    objectType?: string;
    name?: string;
    layerName?: string;
    bounds: Bounds;
    locked?: boolean;
    hidden?: boolean;
    isText?: boolean;
    filled?: boolean;
    stroked?: boolean;
    textFamily?: string;
    textStyle?: string;
    textSize?: number;
    fill?: ColorRef | null;
    stroke?: ColorRef | null;
}

/** Normalized selection item with a temporary id and per-item warnings. */
export interface SelectionItem extends RawSelectionItem {
    id: string;
    objectType: ObjectType;
    name: string;
    layerName: string;
    locked: boolean;
    hidden: boolean;
    isText: boolean;
    textInfo?: TextInfo;
    warnings: string[];
    usable: boolean;
}

export interface SelectionAnalysis {
    count: number;
    usableCount: number;
    items: SelectionItem[];
    warnings: string[];
}

/** One layer as scanned by the host layer. */
export interface RawLayerScan {
    name: string;
    locked: boolean;
    hidden: boolean;
    itemCount: number;
    items: { type: string; name: string; width: number; height: number }[];
}

export interface RawDocumentScan {
    layerCount: number;
    totalItems: number;
    layers: RawLayerScan[];
}

export interface LayerSummary {
    name: string;
    itemCount: number;
    locked: boolean;
    hidden: boolean;
    counts: Record<string, number>;
}

export interface CandidateItem {
    name: string;
    type: string;
    width: number;
    height: number;
    area: number;
}

export interface DocumentAnalysis {
    layerCount: number;
    totalItems: number;
    counts: Record<string, number>;
    layers: LayerSummary[];
    candidates: CandidateItem[];
    warnings: string[];
}
