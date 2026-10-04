/* Minimal CSInterface-compatible shim for local dev without Illustrator.
 * REPLACE this file with the official CSInterface.js from the Adobe CEP SDK
 * for production. The official file provides window.__adobe_cep__ bridging.
 * This shim exposes the same evalScript() surface and returns mock errors
 * so the panel logic can be exercised in a plain browser. */
(function (global) {
  "use strict";
  function CSInterface() {}
  CSInterface.prototype.evalScript = function (script, callback) {
    try {
      if (global.__adobe_cep__ && typeof global.__adobe_cep__.evalScript === "function") {
        global.__adobe_cep__.evalScript(script, callback);
        return;
      }
    } catch (e) { /* fall through to mock */ }
    // Mock: no host available (plain browser). Return host-style JSON error.
    var fn = (script || "").match(/^([A-Za-z0-9_]+)/);
    var name = fn ? fn[1] : "unknown";
    if (typeof callback === "function") {
      callback(JSON.stringify({ ok: false, error: "NO_HOST", detail: "Illustrator host not available for " + name + ". Open via Window > Extensions in Illustrator." }));
    }
  };
  CSInterface.prototype.getHostEnvironment = function () { return "{}"; };
  global.CSInterface = global.CSInterface || CSInterface;
})(typeof window !== "undefined" ? window : this);
