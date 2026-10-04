/* Single host-comms module — the ONLY file to replace on UXP migration.
 * All evalScript calls go through Host.call(fn, argsArray). */
(function (global) {
  "use strict";
  var PLUGIN_ID = "com.logogridgenerator.grid";

  function escapeArg(v) {
    if (typeof v === "string") return '"' + v.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
    if (typeof v === "number" || typeof v === "boolean") return String(v);
    return JSON.stringify(v);
  }

  function buildCall(fn, args) {
    var list = (args || []).map(escapeArg).join(", ");
    return fn + "(" + list + ")";
  }

  var Host = {
    PLUGIN_ID: PLUGIN_ID,
    available: function () {
      try { return !!(window.cep || window.__adobe_cep__); } catch (e) { return false; }
    },
    call: function (fn, args) {
      var script = buildCall(fn, args);
      return new Promise(function (resolve) {
        try {
          var cs = new global.CSInterface();
          cs.evalScript(script, function (raw) {
            try { resolve(JSON.parse(raw)); }
            catch (e) { resolve({ ok: false, error: "BAD_JSON", detail: String(raw) }); }
          });
        } catch (e) {
          resolve({ ok: false, error: "NO_CSI", detail: String(e && e.message || e) });
        }
      });
    }
  };

  global.LGG_Host = Host;
})(typeof window !== "undefined" ? window : this);
