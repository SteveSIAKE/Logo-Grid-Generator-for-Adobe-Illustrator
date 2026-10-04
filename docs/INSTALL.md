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
| Panneau vide, sans message       | Voir §3.1 ci-dessous (cache, doublon, fichiers) |
| Bannière rouge `Load error: …`   | Le message indique le fichier en cause → §3.1 |

### 3.1 Panneau vide (l'onglet s'affiche, contenu gris)

Le panneau v0.3.1+ affiche une **bannière rouge** en cas d'erreur JS.
S'il reste totalement vide, le HTML ne charge pas du tout. Vérifier
dans l'ordre :

1. **Doublon d'installation** — une seule copie doit exister. Lister les
   deux emplacements et supprimer l'ancien :
   - `%APPDATA%\Adobe\CEP\extensions\`
   - `C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\`
   - (macOS : `~/Library/...` et `/Library/...`)
2. **Structure** — le dossier installé doit contenir à sa racine
   `index.html`, `styles.css`, `CSXS/`, `js/`, `jsx/`.
3. **Cache CEP** — Illustrator fermé, supprimer le cache du moteur web :
   - Windows : `%TEMP%\CEPHtmlEngineCache` (et tout dossier `CSXS*` du temp)
   - macOS : `~/Library/Caches/Adobe/CEP/`
   puis rouvrir Illustrator. Les `?v=0.3.1` sur les scripts forcent
   déjà le rechargement à chaque montée de version.
4. **Debug distant** — avec Illustrator ouvert, ouvrir
   `http://localhost:9222` dans Chrome (port déclaré dans `.debug`) :
   la page du panneau doit être listée, la console indique l'erreur exacte.
5. **Logs CEP** — `CEPHtmlEngine*.log` dans le dossier temp système.

## 4. Vérification rapide (sans Illustrator)

```bash
npm install
npm run check   # tsc --noEmit (moteur géométrique + presets)
npm test        # 30+ tests Node (géométrie, validation, presets, import/export)
npm run package # archive dev non signée dans dist/
```
