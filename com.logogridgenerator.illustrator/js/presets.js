/* Presets: built-ins + user customs (localStorage). Pure logic, testable in Node.
 * Canonical settings shape:
 * { type, rings, spacing, stroke, opacity, color,
 *   columns, rows, padding, size, divisions, radius, rotation } */
(function (global) {
  "use strict";

  var STORE_KEY = "lgg.presets.v1";

  var DEFAULTS = {
    type: "circular",
    rings: 6, spacing: 20, stroke: 1, opacity: 40, color: "#000000",
    columns: 4, rows: 4, padding: 20, size: 40,
    divisions: 12, radius: 0, rotation: 0
  };

  function full(o) {
    var d = {}, k;
    for (k in DEFAULTS) d[k] = DEFAULTS[k];
    if (o) for (k in o) { if (o[k] !== undefined) d[k] = o[k]; }
    return d;
  }

  var BUILTINS = [
    { name: "Basic Logo", builtin: true, settings: full({ type: "circular", rings: 4, spacing: 15, stroke: 0.75, opacity: 40, color: "#000000" }) },
    { name: "Circular Pro", builtin: true, settings: full({ type: "circular", rings: 6, spacing: 20, stroke: 1, opacity: 40, color: "#000000" }) },
    { name: "Fine Lines", builtin: true, settings: full({ type: "circular", rings: 8, spacing: 12, stroke: 0.5, opacity: 30, color: "#000000" }) },
    { name: "Brand Construction", builtin: true, settings: full({ type: "circular", rings: 10, spacing: 25, stroke: 1, opacity: 50, color: "#ff0000" }) },
    { name: "Radial Star 12", builtin: true, settings: full({ type: "radial", divisions: 12, radius: 0, rotation: 0, stroke: 0.75, opacity: 40, color: "#000000" }) },
    { name: "Modular 4x4", builtin: true, settings: full({ type: "modular", columns: 4, rows: 4, spacing: 10, padding: 20, stroke: 0.75, opacity: 40, color: "#000000" }) }
  ];

  function clone(s) { return full(s); }

  function normalizeName(n) {
    return String(n || "").trim();
  }

  function isGridType(t) {
    return t === "circular" || t === "modular" || t === "square" || t === "radial";
  }

  // Store abstraction: { get(): string|null, set(str): void }. Browser impl uses localStorage.
  function loadCustoms(store) {
    try {
      var raw = store.get();
      if (!raw) return {};
      var o = JSON.parse(raw);
      if (o && typeof o === "object") {
        var out = {};
        Object.keys(o).forEach(function (k) {
          if (typeof o[k] === "object" && o[k] !== null) out[k] = full(o[k]);
        });
        return out;
      }
    } catch (e) { /* corrupt store -> ignore */ }
    return {};
  }

  function list(store) {
    var customs = loadCustoms(store);
    var out = BUILTINS.map(function (p) { return { name: p.name, builtin: true, settings: clone(p.settings) }; });
    Object.keys(customs).sort().forEach(function (name) {
      out.push({ name: name, builtin: false, settings: clone(customs[name]) });
    });
    return out;
  }

  function get(store, name) {
    name = normalizeName(name);
    for (var i = 0; i < BUILTINS.length; i++) {
      if (BUILTINS[i].name === name) return clone(BUILTINS[i].settings);
    }
    var customs = loadCustoms(store);
    if (customs[name]) return clone(customs[name]);
    return null;
  }

  function isBuiltin(name) {
    name = normalizeName(name);
    for (var i = 0; i < BUILTINS.length; i++) {
      if (BUILTINS[i].name === name) return true;
    }
    return false;
  }

  function validate(settings) {
    var G = global.LGG_Geometry;
    if (G && G.validateGrid) return G.validateGrid(settings);
    if (G && G.validateCircular) return G.validateCircular(settings);
    return [];
  }

  function save(store, name, settings) {
    name = normalizeName(name);
    if (!name) return { ok: false, error: "Name must not be empty." };
    if (isBuiltin(name)) return { ok: false, error: "This name is reserved by a built-in preset." };
    var s = full(settings);
    if (!isGridType(s.type)) return { ok: false, error: "Unknown grid type." };
    var errs = validate(s);
    if (errs.length) return { ok: false, error: errs.join(" ") };
    var customs = loadCustoms(store);
    customs[name] = clone(s);
    try { store.set(JSON.stringify(customs)); }
    catch (e) { return { ok: false, error: "Could not persist preset." }; }
    return { ok: true };
  }

  function remove(store, name) {
    name = normalizeName(name);
    if (isBuiltin(name)) return { ok: false, error: "Built-in presets cannot be deleted." };
    var customs = loadCustoms(store);
    if (!customs[name]) return { ok: false, error: "Preset not found." };
    delete customs[name];
    try { store.set(JSON.stringify(customs)); }
    catch (e) { return { ok: false, error: "Could not persist preset." }; }
    return { ok: true };
  }

  function localStorageStore(key) {
    key = key || STORE_KEY;
    return {
      get: function () {
        try { return global.localStorage.getItem(key); }
        catch (e) { return null; }
      },
      set: function (v) {
        try { global.localStorage.setItem(key, v); }
        catch (e) { throw e; }
      }
    };
  }

  var api = {
    STORE_KEY: STORE_KEY,
    DEFAULTS: DEFAULTS,
    BUILTINS: BUILTINS,
    withDefaults: full,
    list: list,
    get: get,
    save: save,
    remove: remove,
    isBuiltin: isBuiltin,
    localStorageStore: localStorageStore
  };

  global.LGG_Presets = api;
  try {
    if (typeof module !== "undefined" && module.exports) module.exports = api;
  } catch (e) { /* browser: no module */ }
})(typeof globalThis !== "undefined" ? globalThis : this);
