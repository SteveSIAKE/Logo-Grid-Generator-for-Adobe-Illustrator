import { GridSettings, GridType, validateGrid } from "../utils/validation";

export interface Preset {
    name: string;
    builtin: boolean;
    settings: GridSettings;
}

/** Minimal key/value store so the manager stays testable without localStorage. */
export interface PresetStore {
    get(): string | null;
    set(v: string): void;
}

export const STORE_KEY = "lgg.presets.v1";

export const DEFAULTS: GridSettings = {
    type: "circular",
    unit: "px",
    rings: 6,
    spacing: 20,
    stroke: 1,
    opacity: 40,
    color: "#000000",
    dash: "",
    columns: 4,
    rows: 4,
    padding: 20,
    size: 40,
    divisions: 12,
    radius: 0,
    rotation: 0,
    baseSize: 0,
    levels: 5,
    gridW: 240,
    gridH: 120,
    spacingV: 10,
    offsetX: 0,
    offsetY: 0,
    combine: false,
    combineDiv: 12,
};

/** Fill missing keys (e.g. presets saved by v0.1 circular-only builds). */
export function withDefaults(s: Partial<GridSettings>): GridSettings {
    return { ...DEFAULTS, ...s };
}

function full(o: Partial<GridSettings>): GridSettings {
    return withDefaults(o);
}

export const BUILTINS: Preset[] = [
    { name: "Basic Logo", builtin: true, settings: full({ type: "circular", rings: 4, spacing: 15, stroke: 0.75, opacity: 40, color: "#000000" }) },
    { name: "Circular Pro", builtin: true, settings: full({ type: "circular", rings: 6, spacing: 20, stroke: 1, opacity: 40, color: "#000000" }) },
    { name: "Fine Lines", builtin: true, settings: full({ type: "circular", rings: 8, spacing: 12, stroke: 0.5, opacity: 30, color: "#000000" }) },
    { name: "Brand Construction", builtin: true, settings: full({ type: "circular", rings: 10, spacing: 25, stroke: 1, opacity: 50, color: "#ff0000" }) },
    { name: "Radial Star 12", builtin: true, settings: full({ type: "radial", divisions: 12, radius: 0, rotation: 0, stroke: 0.75, opacity: 40, color: "#000000" }) },
    { name: "Modular 4x4", builtin: true, settings: full({ type: "modular", columns: 4, rows: 4, spacing: 10, padding: 20, stroke: 0.75, opacity: 40, color: "#000000" }) },
    { name: "Golden Progression", builtin: true, settings: full({ type: "golden", baseSize: 0, levels: 5, stroke: 0.75, opacity: 40, color: "#000000" }) },
    { name: "Custom 3x2", builtin: true, settings: full({ type: "custom", gridW: 240, gridH: 120, columns: 3, rows: 2, spacing: 10, spacingV: 10, offsetX: 0, offsetY: 0, rotation: 0, stroke: 0.75, opacity: 40, color: "#000000" }) },
];

function clone(s: GridSettings): GridSettings {
    return withDefaults(s);
}

export function loadCustoms(store: PresetStore): Record<string, GridSettings> {
    try {
        const raw = store.get();
        if (!raw) return {};
        const o = JSON.parse(raw);
        if (o && typeof o === "object") {
            const out: Record<string, GridSettings> = {};
            for (const k of Object.keys(o)) {
                if (typeof o[k] === "object" && o[k] !== null) out[k] = withDefaults(o[k]);
            }
            return out;
        }
    } catch { /* corrupt store -> ignore */ }
    return {};
}

export function listPresets(store: PresetStore): Preset[] {
    const customs = loadCustoms(store);
    const out: Preset[] = BUILTINS.map((p) => ({ name: p.name, builtin: true, settings: clone(p.settings) }));
    Object.keys(customs).sort().forEach((name) => {
        out.push({ name, builtin: false, settings: clone(customs[name]) });
    });
    return out;
}

export function getPreset(store: PresetStore, name: string): GridSettings | null {
    const n = name.trim();
    for (const b of BUILTINS) if (b.name === n) return clone(b.settings);
    const customs = loadCustoms(store);
    return customs[n] ? clone(customs[n]) : null;
}

export function isBuiltin(name: string): boolean {
    return BUILTINS.some((b) => b.name === name.trim());
}

export function savePreset(
    store: PresetStore,
    name: string,
    settings: GridSettings
): { ok: boolean; error?: string } {
    const n = name.trim();
    if (!n) return { ok: false, error: "Name must not be empty." };
    if (isBuiltin(n)) return { ok: false, error: "This name is reserved by a built-in preset." };
    const fullSettings = withDefaults(settings);
    if (!isGridType(fullSettings.type)) return { ok: false, error: "Unknown grid type." };
    const errs = validateGrid(fullSettings);
    if (errs.length) return { ok: false, error: errs.join(" ") };
    const customs = loadCustoms(store);
    customs[n] = clone(fullSettings);
    try {
        store.set(JSON.stringify(customs));
    } catch {
        return { ok: false, error: "Could not persist preset." };
    }
    return { ok: true };
}

function isGridType(t: unknown): t is GridType {
    return (
        t === "circular" || t === "modular" || t === "square" ||
        t === "radial" || t === "golden" || t === "custom"
    );
}

export interface PresetFileEntry {
    name: string;
    settings: GridSettings;
}

export interface PresetFile {
    app: string;
    version: number;
    presets: PresetFileEntry[];
}

/** JSON exchange format: { app, version: 1, presets: [{ name, settings }] }. */
export function exportJson(store: PresetStore): string {
    const customs = loadCustoms(store);
    const names = Object.keys(customs).sort();
    const file: PresetFile = {
        app: "logo-grid-generator",
        version: 1,
        presets: names.map((n) => ({ name: n, settings: clone(customs[n]) })),
    };
    return JSON.stringify(file, null, 2);
}

export interface ImportResult {
    ok: boolean;
    error?: string;
    imported?: number;
    skipped?: { name: string; error?: string }[];
}

/** Accepts a multi-preset file or a single-preset { name, version, settings } file. */
export function importJson(store: PresetStore, text: string): ImportResult {
    const o = JSON.parse(text) as Partial<PresetFile> & { name?: string; settings?: GridSettings };
    const list = o && Array.isArray(o.presets)
        ? o.presets
        : o && o.settings
          ? [{ name: o.name as string, settings: o.settings }]
          : null;
    if (!Array.isArray(list)) return { ok: false, error: "Invalid preset file." };
    let imported = 0;
    const skipped: { name: string; error?: string }[] = [];
    for (const p of list) {
        const r = savePreset(store, (p && p.name) as string, (p && p.settings) as GridSettings);
        if (r.ok) imported++;
        else skipped.push({ name: (p && p.name) || "?", error: r.error });
    }
    return { ok: true, imported, skipped };
}

export function removePreset(store: PresetStore, name: string): { ok: boolean; error?: string } {
    const n = name.trim();
    if (isBuiltin(n)) return { ok: false, error: "Built-in presets cannot be deleted." };
    const customs = loadCustoms(store);
    if (!customs[n]) return { ok: false, error: "Preset not found." };
    delete customs[n];
    try {
        store.set(JSON.stringify(customs));
    } catch {
        return { ok: false, error: "Could not persist preset." };
    }
    return { ok: true };
}
