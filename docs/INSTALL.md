# Installation — Logo Grid Generator (CEP, Illustrator 2024+)

> Techno figée : **CEP + ExtendScript**. UXP n'est pas public pour Illustrator
> en 2026 (interne Adobe uniquement). Le jour où UXP s'ouvrira, seul le module
> `js/host-comm.js` + `jsx/host.jsx` sera à réécrire (logique déjà isolée).

## 1. Installation développeur (non signée)

### 1.1 Activer le mode debug (extensions non signées)

**Windows** (PowerShell admin) :

```powershell
reg add "HKCU\Software\Adobe\CSXS.11" /v PlayerDebugMode /t REG_SZ /d 1 /f
```

**macOS** :

```bash
defaults write com.adobe.CSXS.11 PlayerDebugMode 1
```

### 1.2 Copier l'extension

Copier le dossier `com.logogridgenerator.illustrator` dans :

| OS      | Dossier                                                        |
| ------- | -------------------------------------------------------------- |
| Windows | `C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\`    |
| macOS   | `/Library/Application Support/Adobe/CEP/extensions/`          |

Variante par utilisateur (sans droits admin) :

| OS      | Dossier                                                        |
| ------- | -------------------------------------------------------------- |
| Windows | `%APPDATA%\Adobe\CEP\extensions\`                              |
| macOS   | `~/Library/Application Support/Adobe/CEP/extensions/`         |

### 1.3 Lancer

1. Redémarrer Illustrator (2024+, v28+).
2. `Window > Extensions > Logo Grid Generator`.
3. DevTools : ouvrir Chrome sur le port du fichier `.debug` (9222 par défaut).

## 2. Distribution (signée)

1. Remplacer `js/CSInterface.js` (shim de dev) par le fichier officiel du SDK CEP.
2. Obtenir un certificat, puis signer avec l'outil Adobe :

```bash
ZXPSignCmd -sign <dossier> <archive.zxp> <cert.p12> <motdepasse> -tsa http://time.apple.com
```

3. Installer le `.zxp` via un gestionnaire compatible (ex. Unified Plugin
   Installer Agent d'Adobe, ZXPInstaller, Anastasiy Extension Manager).
4. Sans signature valide, Illustrator refuse le panneau hors mode debug.

## 3. Dépannage

| Symptôme                         | Cause probable                              |
| -------------------------------- | ------------------------------------------- |
| Panneau absent du menu           | `PlayerDebugMode` non activé / mauvais dossier / Illustrator < 2024 |
| `Please select a logo…`          | Aucun objet vectoriel sélectionné           |
| `The document or target… locked` | Calque `LOGO GRID` verrouillé (option Lock) → Clear le déverrouille |
| Panneau vide                     | `CSXS/manifest.xml` invalide → valider le XML |

## 4. Vérification rapide (sans Illustrator)

```bash
npm install
npm run check   # tsc --noEmit (moteur géométrique + presets)
npm test        # 30+ tests Node (géométrie, validation, presets, import/export)
npm run package # archive dev non signée dans dist/
```
