import { CircularSettings, validateCircular } from "../utils/validation";

export interface Preset {
    name: string;
    builtin: boolean;
    settings: CircularSettings;
}

/** Minimal key/value store so the manager stays testable without localStorage. */
export interface PresetStore {
    get(): string | null;
    set(v: string): void;
}

export const STORE_KEY = "lgg.presets.v1";

export const BUILTINS: Preset[] = [
    { name: "Basic Logo", builtin: true, settings: { rings: 4, spacing: 15, stroke: 0.75, opacity: 40, color: "#000000" } },
    { name: "Circular Pro", builtin: true, settings: { rings: 6, spacing: 20, stroke: 1, opacity: 40, color: "#000000" } },
    { name: "Fine Lines", builtin: true, settings: { rings: 8, spacing: 12, stroke: 0.5, opacity: 30, color: "#000000" } },
    { name: "Brand Construction", builtin: true, settings: { rings: 10, spacing: 25, stroke: 1, opacity: 50, color: "#ff0000" } },
];

function clone(s: CircularSettings): CircularSettings {
    return { rings: s.rings, spacing: s.spacing, stroke: s.stroke, opacity: s.opacity, color: s.color };
}

export function loadCustoms(store: PresetStore): Record<string, CircularSettings> {
    try {
        const raw = store.get();
        if (!raw) return {};
        const o = JSON.parse(raw);
        if (o && typeof o === "object") return o as Record<string, CircularSettings>;
    } catch { /* corrupt store -> ignore */ }
    return {};
}

export function listPresets(store: PresetStore): Preset[] {
    const customs = loadCustoms(store);
    const out: Preset[] = BUILTINS.map((p) => ({ name: p.name, builtin: true, settings: clone(p.settings) }));
    Object.keys(customs).sort().forEach((name) => {
        if (typeof customs[name] === "object" && customs[name] !== null) {
            out.push({ name, builtin: false, settings: clone(customs[name]) });
        }
    });
    return out;
}

export function getPreset(store: PresetStore, name: string): CircularSettings | null {
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
    settings: CircularSettings
): { ok: boolean; error?: string } {
    const n = name.trim();
    if (!n) return { ok: false, error: "Name must not be empty." };
    if (isBuiltin(n)) return { ok: false, error: "This name is reserved by a built-in preset." };
    const errs = validateCircular(settings);
    if (errs.length) return { ok: false, error: errs.join(" ") };
    const customs = loadCustoms(store);
    customs[n] = clone(settings);
    try {
        store.set(JSON.stringify(customs));
    } catch {
        return { ok: false, error: "Could not persist preset." };
    }
    return { ok: true };
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
