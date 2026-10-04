#Requires -Version 5.1
<#
.SYNOPSIS
  Diagnostic d'installation - Logo Grid Generator (CEP / Illustrator).
  A executer sur la machine avec Illustrator : clic droit > Executer avec PowerShell.
  Copier-coller TOUTE la sortie dans le rapport de bug.
#>
$ErrorActionPreference = "Continue"

Write-Output "===== LGG DOCTOR v0.3.2 ====="
Write-Output ""

Write-Output "--- 1. Illustrator detecte ---"
$aiDirs = Get-ChildItem -LiteralPath "C:\Program Files\Adobe" -Directory -ErrorAction SilentlyContinue |
  Where-Object { $_.Name -like "Adobe Illustrator*" } | Select-Object -ExpandProperty FullName
if (-not $aiDirs) { Write-Output "(aucun dossier Adobe Illustrator* dans C:\Program Files\Adobe)" }
foreach ($d in $aiDirs) {
  Write-Output "dossier : $d"
  $exe = Join-Path $d "Support Files\Contents\Windows\Illustrator.exe"
  if (Test-Path -LiteralPath $exe) {
    $v = (Get-Item -LiteralPath $exe).VersionInfo.FileVersion
    Write-Output "Illustrator.exe version : $v"
  } else {
    Write-Output "(Illustrator.exe introuvable dans ce dossier)"
  }
}
Write-Output ""

Write-Output "--- 2. PlayerDebugMode (CSXS.11 + CSXS.12) ---"
foreach ($k in @("CSXS.11", "CSXS.12")) {
  try {
    $v = (Get-ItemProperty -LiteralPath "HKCU:\Software\Adobe\$k" -Name "PlayerDebugMode" -ErrorAction Stop).PlayerDebugMode
    Write-Output ("  " + $k + " : PlayerDebugMode = " + $v)
  } catch {
    Write-Output ("  " + $k + " : ABSENT (requis si Illustrator utilise ce runtime CEP)")
  }
}
Write-Output ""

Write-Output "--- 3. Emplacements CEP ---"
$roots = @(
  (Join-Path $env:APPDATA "Adobe\CEP\extensions"),
  "C:\Program Files (x86)\Common Files\Adobe\CEP\extensions"
)
$copies = @()
foreach ($r in $roots) {
  Write-Output "dossier : $r"
  if (-not (Test-Path -LiteralPath $r)) { Write-Output "  (dossier absent)"; continue }
  $hits = Get-ChildItem -LiteralPath $r -Directory -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -like "*logo*" -or $_.Name -like "*grid*" -or $_.Name -like "*Logo*" }
  if (-not $hits) { Write-Output "  (aucune copie LGG)"; continue }
  foreach ($h in $hits) {
    Write-Output ("  copie : " + $h.FullName + "  [" + $h.LastWriteTime + "]")
    $copies += $h.FullName
  }
}
if ($copies.Count -gt 1) { Write-Output "!! DOUBLON : plusieurs copies, Illustrator peut charger l'ancienne." }
Write-Output ""

Write-Output "--- 4. Contenu de chaque copie ---"
foreach ($c in $copies) {
  Write-Output "copie : $c"
  $idx = Join-Path $c "index.html"
  Write-Output ("  index.html : " + ($(if (Test-Path -LiteralPath $idx) {
    $f = Get-Item -LiteralPath $idx; "PRESENT, " + $f.Length + " octets"
  } else { "MANQUANT <-- cause probable du panneau vide" })))
  if (Test-Path -LiteralPath $idx) {
    $hit = Select-String -LiteralPath $idx -Pattern "v0\.[0-9.]+" -SimpleMatch:$false |
      Select-Object -First 1 -ExpandProperty Matches |
      Select-Object -First 1 -ExpandProperty Value
    Write-Output ("  version affichee : " + $(if ($hit) { $hit } else { "(introuvable)" }))
  }
  foreach ($rel in @("styles.css", "CSXS\manifest.xml", "js\main.js", "js\geometry.js", "js\presets.js", "js\host-comm.js", "js\CSInterface.js", "jsx\host.jsx", ".debug")) {
    $p = Join-Path $c $rel
    $st = if (Test-Path -LiteralPath $p) { "ok (" + (Get-Item -LiteralPath $p).Length + " o)" } else { "MANQUANT" }
    Write-Output ("  " + $rel + " : " + $st)
  }
}
Write-Output ""

Write-Output "--- 5. Cache CEP ---"
$cache = Join-Path $env:TEMP "CEPHtmlEngineCache"
Write-Output ("CEPHtmlEngineCache : " + $(if (Test-Path -LiteralPath $cache) { "PRESENT (a vider, Illustrator ferme)" } else { "(absent)" }))
Write-Output ""

Write-Output "--- 6. Port debug 9222 ---"
$il = Get-Process -Name "Illustrator" -ErrorAction SilentlyContinue
Write-Output ("Illustrator en cours : " + $(if ($il) { "OUI" } else { "NON" }))
try {
  $tcp = Get-NetTCPConnection -LocalPort 9222 -ErrorAction Stop
  Write-Output "Port 9222 ecoute : OUI (le debug distant devrait repondre sur http://localhost:9222)"
} catch {
  Write-Output "Port 9222 ecoute : NON (Illustrator ferme, ou .debug non pris en compte)"
}
Write-Output ""
Write-Output "===== FIN - copier toute cette sortie ====="
