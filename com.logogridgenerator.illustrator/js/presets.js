/* Presets: built-ins + user customs (localStorage). Pure logic, testable in Node.
 * Settings shape: { rings, spacing, stroke, opacity, color } */
(function (global) {
  "use strict";

  var STORE_KEY = "lgg.presets.v1";

  var BUILTINS = [
    { name: "Basic Logo", builtin: true, settings: { rings: 4, spacing: 15, stroke: 0.75, opacity: 40, color: "#000000" } },
    { name: "Circular Pro", builtin: true, settings: { rings: 6, spacing: 20, stroke: 1, opacity: 40, color: "#000000" } },
    { name: "Fine Lines", builtin: true, settings: { rings: 8, spacing: 12, stroke: 0.5, opacity: 30, color: "#000000" } },
    { name: "Brand Construction", builtin: true, settings: { rings: 10, spacing: 25, stroke: 1, opacity: 50, color: "#ff0000" } }
  ];

  function clone(s) {
    return { rings: s.rings, spacing: s.spacing, stroke: s.stroke, opacity: s.opacity, color: s.color };
  }

  function normalizeName(n) {
    return String(n || "").trim();
  }

  // Store abstraction: { get(): object, set(obj): void }. Browser impl uses localStorage.
  function loadCustoms(store) {
    try {
      var raw = store.get();
      if (!raw) return {};
      var o = JSON.parse(raw);
      if (o && typeof o === "object") return o;
    } catch (e) { /* corrupt store -> ignore */ }
    return {};
  }

  function list(store) {
    var customs = loadCustoms(store);
    var out = BUILTINS.map(function (p) { return { name: p.name, builtin: true, settings: clone(p.settings) }; });
    Object.keys(customs).sort().forEach(function (name) {
      if (typeof customs[name] === "object" && customs[name] !== null) {
        out.push({ name: name, builtin: false, settings: clone(customs[name]) });
      }
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

  function save(store, name, settings) {
    name = normalizeName(name);
    if (!name) return { ok: false, error: "Name must not be empty." };
    if (isBuiltin(name)) return { ok: false, error: "This name is reserved by a built-in preset." };
    var errs = global.LGG_Geometry
      ? global.LGG_Geometry.validateCircular(settings)
      : [];
    if (errs.length) return { ok: false, error: errs.join(" ") };
    var customs = loadCustoms(store);
    customs[name] = clone(settings);
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
    BUILTINS: BUILTINS,
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
