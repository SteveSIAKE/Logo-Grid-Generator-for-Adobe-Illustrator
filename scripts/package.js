"use strict";
// Dev packaging: zips the CEP extension folder into dist/.
// NOTE: this produces an UNSIGNED archive for local testing only.
// Production distribution requires signing with Adobe ZXPSignCmd
// (see docs/INSTALL.md) — a signed file is typically renamed to .zxp.
const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const src = path.join(root, "com.logogridgenerator.illustrator");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const outDir = path.join(root, "dist");
const out = path.join(outDir, `logo-grid-generator-${pkg.version}.zip`);

if (!fs.existsSync(src)) {
  console.error("Missing extension folder: " + src);
  process.exit(1);
}
fs.mkdirSync(outDir, { recursive: true });
if (fs.existsSync(out)) fs.unlinkSync(out);

if (process.platform === "win32") {
  execSync(
    `powershell -NoProfile -Command "Compress-Archive -Path '${src}' -DestinationPath '${out}'"`,
    { stdio: "inherit" }
  );
} else {
  execSync(`zip -qr "${out}" "com.logogridgenerator.illustrator"`, { cwd: root, stdio: "inherit" });
}
console.log("Wrote " + out + " (unsigned — dev only, see docs/INSTALL.md)");
