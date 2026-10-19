# Installation — Logo Presentation Studio (CEP, Illustrator 2024+)

> Techno figée : **CEP + ExtendScript**. UXP n'est pas public pour Illustrator
> en 2026 (interne Adobe uniquement). Le jour où UXP s'ouvrira, seul le module
> `js/host-comm.js` + `jsx/host.jsx` sera à réécrire (logique déjà isolée).
>
> Testé sur : **Illustrator 2026 (v30.7) + CEP 12**, Windows.
>
> ## 0. État du produit — MVP v0.1
>
> Logo Presentation Studio est la refonte de Logo Grid Generator : il devient
> un assistant de présentation de marque intégré à Illustrator. Le périmètre
> MVP couvre le Module Construction Grid (6 grilles : Circular, Modular,
> Square, Radial, Golden Ratio, Custom), la combinaison radiale, les presets +
> import/export JSON, la preview live, la persistance, les unités
> (px/pt/mm/cm/in), lock / hide / guides, Clear/Regenerate, l'undo en une
> étape, 43 tests Node + `tsc` strict.
>
> Les modules Logo Showcase, Color Palette, Typography System, Clear Space et
> le Brand Board Generator (mise en page automatique) sont en cours de
> développement pour le MVP.
>
> Limitations connues :
>
> - Distribution non signée : le packaging produit une archive dev ;
>   la production exige un certificat + `ZXPSignCmd` (§2).
> - `js/CSInterface.js` est un shim de dev : remplacer par le fichier officiel
>   du SDK CEP avant signature.
> - Bounds = boîte englobante alignée aux axes (`geometricBounds`) : un logo
>   pivoté donne le AABB, pas la boîte orientée (choix documenté).
> - `MAKE ARTWORK` après `MAKE GUIDES` dépend du support `guides=false`
>   d'Illustrator : si la reconversion échoue, régénérer la grille.
> - macOS non testé (chemins fournis par analogie).
> - L'ancienne extension `com.logogridgenerator.illustrator` doit être
>   désinstallée avant d'installer celle-ci (§1.4).

## 1. Installation développeur (non signée)

### 1.1 Activer le mode debug (extensions non signées)

Choisir la clé selon le runtime CEP d'Illustrator (**les deux si doute**) :
Illustrator 2026 = CEP 12 (`CSXS.12`), Illustrator 2024 = CEP 11 (`CSXS.11`).

**Windows** (PowerShell admin) :

```powershell
reg add "HKCU\Software\Adobe\CSXS.12" /v PlayerDebugMode /t REG_SZ /d 1 /f
reg add "HKCU\Software\Adobe\CSXS.11" /v PlayerDebugMode /t REG_SZ /d 1 /f
```

**macOS** :

```bash
defaults write com.adobe.CSXS.12 PlayerDebugMode 1
defaults write com.adobe.CSXS.11 PlayerDebugMode 1
```

> Sans la clé correspondant au runtime, le panneau peut afficher son onglet
> mais rester vide (contenu jamais démarré, port `.debug` fermé).

### 1.2 Copier l'extension

Copier le dossier `com.logopresentationstudio.illustrator` dans :

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
2. `Window > Extensions > Logo Presentation Studio`.
3. DevTools : ouvrir Chrome sur le port du fichier `.debug` (9222 par défaut).

### 1.4 Désinstaller l'ancienne extension (Logo Grid Generator)

L'ancienne extension `com.logogridgenerator.illustrator` est distincte de
celle-ci (autre ID, autre dossier). Illustrator fermé, supprimer son dossier
des emplacements CEP (§1.2) puis vider le cache CEP (§3.1) avant de rouvrir.

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

Le panneau v0.1.0+ affiche une **bannière rouge** en cas d'erreur JS.
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
   puis rouvrir Illustrator. Les `?v=0.1.0` sur les scripts forcent
   déjà le rechargement à chaque montée de version.
4. **Debug distant** — avec Illustrator ouvert, ouvrir
   `http://localhost:9222` dans Chrome (port déclaré dans `.debug`) :
   la page du panneau doit être listée, la console indique l'erreur exacte.
5. **Logs CEP** — `CEPHtmlEngine*.log` dans le dossier temp système.

## 4. Vérification rapide (sans Illustrator)

```bash
npm install
npm run check   # tsc --noEmit (moteur géométrique + presets)
npm test        # 43 tests Node (géométrie, validation, presets, import/export)
npm run package # archive dev non signée dans dist/
```
