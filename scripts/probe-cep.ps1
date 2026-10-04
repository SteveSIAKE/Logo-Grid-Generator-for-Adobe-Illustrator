#Requires -Version 5.1
<#
.SYNOPSIS
  Sonde CEP : versions CSXS declarees vs moteur embarque par Illustrator.
  Lecture seule.
#>
$ErrorActionPreference = "Continue"

Write-Output "===== CEP PROBE ====="
Write-Output ""

Write-Output "--- 1. Cles CSXS (HKCU) ---"
$base = "HKCU:\Software\Adobe"
$keys = Get-ChildItem -LiteralPath $base -ErrorAction SilentlyContinue |
  Where-Object { $_.PSChildName -like "CSXS*" } |
  Select-Object -ExpandProperty PSChildName
foreach ($k in $keys) {
  $pdm = "(absent)"
  try { $pdm = (Get-ItemProperty -LiteralPath (Join-Path $base $k) -Name "PlayerDebugMode" -ErrorAction Stop).PlayerDebugMode } catch {}
  Write-Output ("  " + $k + " : PlayerDebugMode = " + $pdm)
}
if (-not $keys) { Write-Output "  (aucune cle CSXS.*)" }
Write-Output ""

Write-Output "--- 2. Moteur CEP embarque par Illustrator ---"
$cefs = Get-ChildItem -LiteralPath "C:\Program Files\Adobe" -Directory -ErrorAction SilentlyContinue |
  Where-Object { $_.Name -like "Adobe Illustrator*" } |
  ForEach-Object { Join-Path $_.FullName "Support Files\Contents\Windows\CEPHtmlEngine\CEPHtmlEngine.exe" } |
  Where-Object { Test-Path -LiteralPath $_ }
foreach ($c in $cefs) {
  $v = (Get-Item -LiteralPath $c).VersionInfo
  Write-Output ("  " + $c)
  Write-Output ("    version fichier : " + $v.FileVersion + " | produit : " + $v.ProductVersion)
}
if (-not $cefs) { Write-Output "  (CEPHtmlEngine.exe introuvable)" }
Write-Output ""

Write-Output "--- 3. Manifests CEP officiels (reference) ---"
Write-Output "===== FIN ====="
