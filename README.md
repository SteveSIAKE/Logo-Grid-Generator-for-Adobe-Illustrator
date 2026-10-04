# Logo Grid Generator for Adobe Illustrator

> Extension professionnelle pour Adobe Illustrator permettant de générer automatiquement des grilles de construction géométriques à partir d'un ou plusieurs objets sélectionnés.

---

## 1. Présentation du projet

**Logo Grid Generator** est une extension destinée aux graphistes, designers, créateurs d'identités visuelles et professionnels du branding utilisant Adobe Illustrator.

L'objectif principal de l'extension est d'automatiser la création de **grilles de construction de logos** directement dans Illustrator.

Traditionnellement, la création d'une grille de construction nécessite de :

1. sélectionner un logo ;
2. identifier son centre géométrique ;
3. mesurer ses dimensions ;
4. créer manuellement des cercles, lignes ou carrés ;
5. dupliquer les formes ;
6. respecter des espacements réguliers ;
7. aligner les différents éléments ;
8. organiser les éléments sur un calque ;
9. ajuster manuellement l'opacité et les contours ;
10. nettoyer ou supprimer la grille lorsque le travail est terminé.

Logo Grid Generator automatise ces opérations.

L'utilisateur sélectionne simplement un objet ou un groupe dans Illustrator, choisit le type de grille souhaité, configure quelques paramètres puis clique sur **Generate Grid**.

L'extension crée alors automatiquement une grille propre, organisée et non destructive autour du logo.

---

# 2. Objectifs

## 2.1 Objectif principal

Permettre à un designer de générer en quelques secondes une grille géométrique professionnelle autour d'un logo sélectionné.

## 2.2 Objectifs secondaires

L'extension doit également permettre de :

- générer différents types de grilles ;
- personnaliser les paramètres géométriques ;
- contrôler l'épaisseur des lignes ;
- contrôler la couleur ;
- contrôler l'opacité ;
- créer automatiquement un calque dédié ;
- préserver l'œuvre originale ;
- régénérer rapidement une grille ;
- supprimer une grille existante ;
- gérer plusieurs objets sélectionnés ;
- fonctionner avec différentes unités Illustrator ;
- éviter les manipulations manuelles répétitives ;
- conserver une organisation propre du document.

---

# 3. Philosophie de conception

L'extension doit suivre trois principes fondamentaux.

### 3.1 Non-destructivité

Le logo original ne doit jamais être modifié par la génération de la grille.

La grille doit être créée dans un calque ou groupe indépendant.

Exemple :

```text
DOCUMENT
│
├── Logo
│   └── Logo original
│
└── LOGO GRID
    └── Grid
        ├── Circles
        ├── Radial Lines
        └── Guides
```

---

### 3.2 Simplicité

L'utilisateur doit pouvoir générer une grille en quelques clics.

Flux principal :

```text
Sélectionner le logo
        ↓
Ouvrir Logo Grid Generator
        ↓
Choisir le type de grille
        ↓
Configurer les paramètres
        ↓
Generate Grid
        ↓
Grille créée
```

---

### 3.3 Précision

Les grilles doivent être générées à partir de calculs géométriques précis et non à partir d'approximations visuelles.

---

# 4. Public cible

L'extension est destinée principalement aux :

- graphistes ;
- brand designers ;
- designers UI/UX ;
- agences de communication ;
- freelances ;
- étudiants en design graphique ;
- créateurs de logos ;
- directeurs artistiques ;
- studios de branding.

---

# 5. Technologie

## 5.1 Technologie recommandée

L'extension doit être développée avec les technologies modernes supportées par la version ciblée d'Adobe Illustrator.

Architecture recommandée :

```text
HTML
CSS
JavaScript / TypeScript
        │
        ▼
Adobe UXP
        │
        ▼
Illustrator API
        │
        ▼
Adobe Illustrator
```

TypeScript est recommandé pour améliorer :

- la sécurité du code ;
- l'autocomplétion ;
- la maintenance ;
- la détection d'erreurs ;
- l'organisation du projet.

---

# 6. Architecture générale

L'extension est composée de plusieurs couches.

```text
┌───────────────────────────────┐
│       USER INTERFACE          │
│                               │
│ HTML / CSS / TypeScript       │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│       APPLICATION LOGIC       │
│                               │
│ Configuration                 │
│ Validation                    │
│ State Management              │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│       GRID ENGINE             │
│                               │
│ Circular Grid                 │
│ Modular Grid                  │
│ Radial Grid                   │
│ Golden Ratio                  │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│       ILLUSTRATOR ADAPTER     │
│                               │
│ Document                      │
│ Selection                     │
│ Layers                        │
│ Groups                        │
│ Paths                         │
│ Appearance                    │
└───────────────────────────────┘
```

---

# 7. Structure du projet

Une structure recommandée :

```text
logo-grid-generator/
│
├── src/
│   │
│   ├── main/
│   │   ├── app.ts
│   │   ├── illustrator.ts
│   │   ├── document.ts
│   │   ├── selection.ts
│   │   └── layers.ts
│   │
│   ├── grid/
│   │   ├── grid-engine.ts
│   │   ├── circular-grid.ts
│   │   ├── modular-grid.ts
│   │   ├── radial-grid.ts
│   │   ├── golden-ratio-grid.ts
│   │   └── custom-grid.ts
│   │
│   ├── geometry/
│   │   ├── bounds.ts
│   │   ├── center.ts
│   │   ├── dimensions.ts
│   │   ├── circles.ts
│   │   ├── lines.ts
│   │   └── geometry-utils.ts
│   │
│   ├── ui/
│   │   ├── components/
│   │   ├── controls/
│   │   ├── panels/
│   │   └── notifications/
│   │
│   ├── state/
│   │   └── settings-store.ts
│   │
│   ├── presets/
│   │   └── preset-manager.ts
│   │
│   └── utils/
│       ├── validation.ts
│       ├── units.ts
│       └── constants.ts
│
├── assets/
│   ├── icons/
│   └── logo/
│
├── index.html
├── styles.css
├── manifest.json
├── package.json
├── tsconfig.json
└── README.md
```

---

# 8. Interface utilisateur

L'interface doit être compacte et adaptée à l'utilisation dans Illustrator.

Exemple conceptuel :

```text
┌───────────────────────────────────┐
│  LOGO GRID GENERATOR          ⚙   │
├───────────────────────────────────┤
│                                   │
│  GRID TYPE                        │
│  ┌─────────────────────────────┐  │
│  │ Circular Grid            ▼  │  │
│  └─────────────────────────────┘  │
│                                   │
│  PARAMETERS                       │
│                                   │
│  Radius       [ 120 ]      px     │
│                                   │
│  Rings        [ 6 ]               │
│                                   │
│  Spacing      [ 20 ]       px     │
│                                   │
│  Stroke       [ 1 ]        pt     │
│                                   │
│  Opacity      [ 40 ]       %      │
│                                   │
│  Color        [ ■ ]               │
│                                   │
├───────────────────────────────────┤
│                                   │
│       [ GENERATE GRID ]           │
│                                   │
│       [ CLEAR GRID ]              │
│                                   │
└───────────────────────────────────┘
```

---

# 9. En-tête de l'interface

L'interface doit afficher :

```text
LOGO GRID GENERATOR
```

avec éventuellement :

```text
v1.0.0
```

Un bouton de paramètres peut être présent dans le coin supérieur droit.

---

# 10. Sélection du type de grille

Le composant principal est un sélecteur :

```text
Grid Type
```

Options :

```text
Circular
Modular
Square
Radial
Golden Ratio
Custom
```

---

# 11. Grille circulaire

La grille circulaire est le mode principal.

Elle génère plusieurs cercles concentriques autour du centre du logo.

Exemple conceptuel :

```text
           ○
      ○         ○
   ○               ○
  ○       LOGO      ○
   ○               ○
      ○         ○
           ○
```

## Paramètres

```text
Radius
Number of rings
Ring spacing
Stroke width
Opacity
Color
```

---

# 12. Calcul de la grille circulaire

Le système doit d'abord récupérer les dimensions du logo.

Supposons :

```text
width  = W
height = H
```

Le centre est calculé par :

```text
centerX = left + width / 2
centerY = top - height / 2
```

La dimension maximale du logo est :

```text
maxDimension = max(width, height)
```

Le rayon initial peut être défini comme :

```text
baseRadius = maxDimension / 2
```

Puis un facteur d'expansion peut être appliqué :

```text
radius = baseRadius × scale
```

Pour plusieurs anneaux :

```text
radius(i) = baseRadius + i × spacing
```

avec :

```text
i = 0 ... numberOfRings - 1
```

---

# 13. Grille modulaire

La grille modulaire divise la zone du logo en cellules régulières.

Exemple :

```text
┌───┬───┬───┬───┐
│   │   │   │   │
├───┼───┼───┼───┤
│   │LOG│   │   │
├───┼───┼───┼───┤
│   │   │   │   │
└───┴───┴───┴───┘
```

Paramètres :

```text
Columns
Rows
Cell Size
Spacing
Padding
Stroke
Opacity
Color
```

---

# 14. Grille carrée

La grille carrée est une variante simple destinée aux constructions géométriques.

Paramètres :

```text
Size
Columns
Rows
Spacing
Padding
```

Elle doit pouvoir être centrée automatiquement sur le logo.

---

# 15. Grille radiale

La grille radiale génère plusieurs lignes partant du centre.

Exemple :

```text
             │
          \  │  /
           \ │ /
      ────── ● ──────
           / │ \
          /  │  \
             │
```

Paramètres :

```text
Number of divisions
Radius
Rotation
Stroke
Opacity
Color
```

---

# 16. Algorithme radial

Pour un nombre de divisions `N` :

```text
angleStep = 360 / N
```

Pour chaque division :

```text
angle = i × angleStep
```

Les coordonnées finales sont :

```text
x = centerX + radius × cos(angle)
y = centerY + radius × sin(angle)
```

Une ligne est alors créée :

```text
(centerX, centerY)
        →
(x, y)
```

---

# 17. Golden Ratio Grid

Une grille basée sur le nombre d'or doit être disponible.

Le nombre d'or :

```text
φ = 1.618033988749895
```

La grille peut utiliser des rectangles proportionnels :

```text
width / height ≈ 1.618
```

ou une succession de tailles :

```text
r
r × φ
r × φ²
r × φ³
```

Cette fonctionnalité est particulièrement utile pour les logos construits autour de proportions harmonieuses.

---

# 18. Grille personnalisée

Le mode `Custom` permet à l'utilisateur de contrôler :

```text
Width
Height
Columns
Rows
Horizontal spacing
Vertical spacing
Offset X
Offset Y
Rotation
```

Cela permet de construire des systèmes de grille spécifiques.

---

# 19. Gestion du centre

Le moteur doit déterminer automatiquement le centre de la sélection.

Pour une sélection simple :

```text
bounds = getSelectionBounds()
```

Puis :

```text
centerX = bounds.centerX
centerY = bounds.centerY
```

Pour une sélection multiple, deux comportements sont possibles :

### Mode A — bounding box globale

Tous les objets sont considérés comme une seule composition.

```text
Selection
    ↓
Global Bounds
    ↓
Global Center
    ↓
One Grid
```

### Mode B — une grille par objet

```text
Object 1 → Grid 1
Object 2 → Grid 2
Object 3 → Grid 3
```

L'interface doit prévoir un choix :

```text
Multiple Selection

(•) One grid for entire selection
( ) One grid per object
```

---

# 20. Gestion des bounds

Le moteur doit utiliser les limites réelles de l'objet.

Informations nécessaires :

```text
left
top
right
bottom
width
height
centerX
centerY
```

Structure interne :

```typescript
interface Bounds {
    left: number;
    top: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
    centerX: number;
    centerY: number;
}
```

---

# 21. Système de coordonnées

Illustrator utilise son propre système de coordonnées.

Le moteur doit donc centraliser toutes les opérations géométriques.

Exemple :

```text
UI coordinates
      ↓
Grid Engine coordinates
      ↓
Illustrator coordinates
```

Il ne faut pas disperser les conversions dans le code.

Créer un module :

```text
geometry/
└── coordinates.ts
```

---

# 22. Gestion des unités

L'extension doit supporter au minimum :

```text
px
pt
mm
cm
in
```

Les valeurs saisies par l'utilisateur doivent être converties avant génération.

Exemple :

```text
10 mm
```

devient une valeur interne standard.

Toutes les opérations géométriques doivent idéalement être effectuées dans une unité interne unique.

---

# 23. Calque automatique

Lors de la génération, l'extension doit créer ou réutiliser un calque :

```text
LOGO GRID
```

Si le calque existe déjà :

```text
LOGO GRID
```

il peut être réutilisé.

Une préférence peut permettre de choisir :

```text
(•) Reuse existing grid layer
( ) Create new grid layer
```

---

# 24. Organisation des objets

La grille doit être structurée proprement.

Exemple :

```text
LOGO GRID
│
└── GRID
    │
    ├── Rings
    │   ├── Circle 01
    │   ├── Circle 02
    │   └── Circle 03
    │
    ├── Radial Lines
    │   ├── Line 01
    │   ├── Line 02
    │   └── Line 03
    │
    └── Guides
```

Cette organisation facilite :

- la sélection ;
- la modification ;
- la suppression ;
- la maintenance ;
- le debugging.

---

# 25. Style graphique par défaut

Valeurs recommandées :

```text
Fill: None
Stroke: #000000
Stroke Width: 1 pt
Opacity: 40%
```

La grille ne doit jamais remplir les cercles ou rectangles par défaut.

---

# 26. Personnalisation du style

Paramètres :

```text
Stroke Color
Stroke Width
Opacity
Dash
```

Exemple :

```text
Stroke:
[ #000000 ]

Width:
[ 1.0 ]

Opacity:
[ 40% ]
```

Une palette rapide peut être proposée :

```text
Black
White
Red
Blue
Custom
```

---

# 27. Preview

Une fonction de prévisualisation peut être intégrée.

Lorsque l'utilisateur modifie :

```text
Radius
Spacing
Rings
Opacity
```

l'extension peut mettre à jour la grille.

Cependant, pour éviter des performances médiocres, les modifications rapides doivent être traitées avec un mécanisme de debounce.

Exemple conceptuel :

```text
User moves slider
       ↓
wait 100–200 ms
       ↓
update preview
```

---

# 28. Bouton Generate Grid

Le bouton principal :

```text
GENERATE GRID
```

déclenche :

1. validation de la sélection ;
2. récupération des bounds ;
3. calcul du centre ;
4. récupération des paramètres ;
5. création/récupération du calque ;
6. création du groupe ;
7. génération des formes ;
8. application du style ;
9. sélection éventuelle de la grille ;
10. notification de réussite.

---

# 29. Bouton Clear Grid

Le bouton :

```text
CLEAR GRID
```

doit supprimer uniquement les éléments générés par l'extension.

Il ne doit jamais supprimer le logo.

La suppression doit rechercher :

```text
LOGO GRID
```

ou un identifiant interne associé à l'extension.

---

# 30. Identification interne

Pour éviter de supprimer accidentellement des éléments créés manuellement par l'utilisateur, l'extension doit utiliser un système d'identification.

Exemple conceptuel :

```text
pluginId:
com.logo-grid-generator.grid
```

Chaque génération est associée à cet identifiant lorsque l'API Illustrator le permet.

---

# 31. Regenerate

Un bouton supplémentaire peut être ajouté :

```text
REGENERATE
```

Fonctionnement :

```text
ancienne grille
      ↓
suppression
      ↓
nouveaux paramètres
      ↓
nouvelle grille
```

Cela évite d'accumuler plusieurs grilles.

---

# 32. Verrouillage de la grille

Option :

```text
Lock Grid
```

permettant de verrouiller le calque ou le groupe généré.

---

# 33. Masquage de la grille

Option :

```text
Hide Grid
```

permettant de masquer temporairement la grille.

---

# 34. Gestion des cas d'erreur

## Aucun document ouvert

Afficher :

```text
No Illustrator document is open.
Please open a document first.
```

---

## Aucun objet sélectionné

Afficher :

```text
Please select a logo or object first.
```

---

## Sélection invalide

Afficher :

```text
The selected object cannot be used to generate a grid.
```

---

## Document verrouillé

Afficher :

```text
The document or target layer is locked.
Please unlock it before generating the grid.
```

---

# 35. Validation des paramètres

Les valeurs doivent être validées avant génération.

Exemple :

```text
Rings > 0
Radius > 0
Stroke Width >= 0
Opacity ∈ [0,100]
Columns > 0
Rows > 0
```

Si l'utilisateur saisit :

```text
Rings = -5
```

l'interface doit afficher une erreur.

---

# 36. Gestion des performances

Les grilles peuvent contenir beaucoup d'objets.

Il faut éviter de créer inutilement des milliers de paths.

Exemple :

```text
100 rings
+
360 radial divisions
=
460 objets
```

Cela reste raisonnable.

Mais :

```text
1000 rings
×
1000 divisions
```

peut devenir extrêmement lourd.

L'extension doit donc limiter certaines valeurs.

Exemple :

```text
Maximum rings: 100
Maximum radial divisions: 360
```

---

# 37. Undo

La génération doit idéalement pouvoir être annulée avec :

```text
Ctrl + Z
```

ou :

```text
Cmd + Z
```

dans Illustrator.

Toutes les opérations d'une génération doivent autant que possible être regroupées logiquement afin que l'utilisateur puisse annuler une génération sans devoir effectuer des dizaines d'annulations.

---

# 38. Presets

L'extension peut proposer des presets.

Exemple :

```text
Presets

○ Basic Logo
○ Circular Pro
○ Golden Ratio
○ Brand Construction
○ Radial
```

Chaque preset contient :

```json
{
    "gridType": "circular",
    "rings": 6,
    "spacing": 20,
    "strokeWidth": 1,
    "opacity": 40
}
```

---

# 39. Presets personnalisés

L'utilisateur peut enregistrer sa configuration :

```text
Save Preset
```

Exemple :

```text
My Branding Grid
```

Puis la retrouver :

```text
Presets
└── My Branding Grid
```

---

# 40. Import / Export des presets

Une version avancée peut permettre :

```text
Export Presets
Import Presets
```

Format recommandé :

```text
JSON
```

Exemple :

```json
{
    "name": "Brand Grid",
    "version": 1,
    "settings": {
        "type": "circular",
        "rings": 8,
        "spacing": 15,
        "stroke": 1,
        "opacity": 35
    }
}
```

---

# 41. Architecture du moteur de grille

Le moteur doit être indépendant de l'interface.

Exemple :

```typescript
interface GridSettings {
    type: GridType;
    strokeWidth: number;
    opacity: number;
    color: string;
}
```

Puis :

```typescript
interface GridGenerator {
    generate(
        bounds: Bounds,
        settings: GridSettings
    ): GridGeometry;
}
```

Chaque type de grille implémente son propre générateur.

---

# 42. Séparation UI / logique

Il ne faut pas écrire directement les calculs géométriques dans les événements UI.

À éviter :

```typescript
button.onclick = () => {
    // 300 lignes de calcul...
};
```

Préférer :

```text
UI
 ↓
Controller
 ↓
Grid Engine
 ↓
Illustrator Adapter
```

---

# 43. Algorithme général

```text
START

Check Illustrator document

IF no document
    show error
    STOP

Get current selection

IF selection is empty
    show error
    STOP

Validate selected objects

Get bounds

Calculate center

Read user settings

Validate settings

Create or find grid layer

Create grid group

SWITCH grid type

    CASE circular:
        generate circles

    CASE modular:
        generate rectangular grid

    CASE square:
        generate square grid

    CASE radial:
        generate radial lines

    CASE golden ratio:
        generate golden-ratio geometry

    CASE custom:
        generate custom grid

Apply stroke

Apply opacity

Apply color

Organize generated objects

Optionally lock grid

Notify user

END
```

---

# 44. Algorithme circulaire

```text
INPUT:
    bounds
    numberOfRings
    spacing
    scale

centerX = bounds.centerX
centerY = bounds.centerY

baseRadius =
    max(bounds.width, bounds.height) / 2

FOR i FROM 0 TO numberOfRings - 1

    radius =
        baseRadius + (i × spacing)

    createCircle(
        centerX,
        centerY,
        radius
    )

END FOR
```

---

# 45. Algorithme radial

```text
INPUT:
    center
    radius
    divisions

angleStep = 360 / divisions

FOR i FROM 0 TO divisions - 1

    angle = i × angleStep

    x =
        centerX +
        radius × cos(angle)

    y =
        centerY +
        radius × sin(angle)

    createLine(
        centerX,
        centerY,
        x,
        y
    )

END FOR
```

---

# 46. Combinaison de grilles

Une fonctionnalité avancée doit permettre de combiner plusieurs systèmes.

Exemple :

```text
Circular
+
Radial
```

Résultat :

```text
      \  |  /
    ───\ | /───
        \|/
    -----●-----
        /|\
    ───/ | \───
      /  |  \
```

Cela permet de construire des grilles beaucoup plus complexes.

---

# 47. Paramètres avancés

Section :

```text
Advanced
```

Paramètres :

```text
☑ Include center point
☑ Include radial lines
☑ Include bounding box
☑ Snap grid to selection
☑ Lock generated layer
☑ Hide original object during preview
☑ Create compound grid
```

---

# 48. Centre du logo

Option :

```text
Center Point
```

Lorsque activée, un petit cercle ou marqueur est placé au centre.

Exemple :

```text
        │
        │
────────●────────
        │
        │
```

Cela aide le designer à comprendre la construction.

---

# 49. Bounding Box

Option :

```text
Show Bounding Box
```

La grille peut afficher :

```text
┌─────────────────┐
│                 │
│      LOGO       │
│                 │
└─────────────────┘
```

---

# 50. Guides de construction

Une version avancée peut transformer certaines lignes en guides Illustrator si l'API utilisée le permet.

Deux modes :

```text
Artwork Grid
Guide Grid
```

### Artwork Grid

La grille est constituée de paths Illustrator normaux.

### Guide Grid

Les lignes sont converties en guides lorsque l'API Illustrator le permet.

---

# 51. Gestion du thème

L'interface doit respecter autant que possible l'apparence d'Illustrator.

Deux thèmes :

```text
Dark
Light
```

Le thème peut être déterminé automatiquement.

---

# 52. Design UI

L'interface doit être :

- compacte ;
- moderne ;
- professionnelle ;
- lisible ;
- sans surcharge ;
- adaptée à un panneau Illustrator.

Éviter :

- gros boutons inutiles ;
- couleurs excessives ;
- animations lourdes ;
- textes trop longs.

---

# 53. Navigation

Structure recommandée :

```text
Logo Grid Generator

[Grid]
[Style]
[Advanced]
[Presets]
```

### Grid

Contient les paramètres géométriques.

### Style

Contient :

```text
Color
Stroke
Opacity
Dash
```

### Advanced

Contient :

```text
Center
Bounds
Guides
Lock
Combination
```

### Presets

Contient les configurations sauvegardées.

---

# 54. État de l'application

L'application doit maintenir un état :

```typescript
interface AppState {
    gridType: GridType;
    selectionMode: SelectionMode;

    radius: number;
    rings: number;
    spacing: number;

    rows: number;
    columns: number;

    divisions: number;

    strokeWidth: number;
    opacity: number;
    color: string;

    showCenter: boolean;
    showBounds: boolean;
    lockGrid: boolean;
}
```

---

# 55. Persistance des paramètres

Lorsque l'utilisateur ferme puis rouvre l'extension, ses derniers paramètres peuvent être conservés.

Exemple :

```text
Last Grid Type:
Circular

Last Radius:
120

Last Rings:
6
```

Cela améliore considérablement l'expérience utilisateur.

---

# 56. Compatibilité

Le développement doit cibler une version précise d'Illustrator et vérifier les API réellement disponibles dans cette version.

Il ne faut pas supposer que toutes les versions d'Illustrator supportent exactement les mêmes mécanismes d'extension.

Le projet doit donc définir :

```text
Minimum supported Illustrator version
Recommended Illustrator version
Maximum tested version
```

Exemple de documentation :

```text
Supported:
Illustrator XX+
Tested:
Illustrator XX / XX / XX
```

Les numéros exacts doivent être définis au moment de l'implémentation.

---

# 57. Installation

Le projet doit prévoir deux modes.

## Développement

L'extension est chargée via l'environnement de développement Adobe correspondant à la technologie utilisée.

## Distribution

Le projet doit être empaqueté selon le format attendu par la technologie d'extension et la version d'Illustrator ciblée.

---

# 58. Important concernant le "dossier Extensions"

Il ne faut pas considérer :

```text
Copier le dossier
→ Extensions
→ Illustrator
```

comme une méthode universelle.

Les anciennes extensions Adobe basées sur CEP et les extensions modernes basées sur UXP n'utilisent pas nécessairement le même système d'installation.

Le README final doit donc fournir **la procédure exacte correspondant à la version et à la technologie choisies**.

L'objectif utilisateur reste cependant :

```text
Installation
    ↓
Lancement d'Illustrator
    ↓
Window
    ↓
Extensions / Plugins
    ↓
Logo Grid Generator
```

---

# 59. Manifest

L'extension doit posséder un fichier de configuration/manifest correspondant au système d'extension utilisé.

Il doit définir notamment :

```text
Extension ID
Name
Version
Description
Author
Entry Point
UI
Host Application
Minimum Version
Permissions
```

Exemple conceptuel :

```json
{
    "id": "com.company.logogridgenerator",
    "name": "Logo Grid Generator",
    "version": "1.0.0",
    "description": "Professional logo construction grid generator",
    "host": "Adobe Illustrator"
}
```

Le format exact doit être adapté à la technologie choisie.

---

# 60. Sécurité

L'extension ne doit pas :

- modifier des documents arbitrairement ;
- supprimer des objets non générés par elle ;
- envoyer les documents utilisateur vers un serveur sans consentement ;
- collecter inutilement des données personnelles ;
- exécuter du code distant non vérifié.

Le fonctionnement de base doit être local.

---

# 61. Pas de dépendance serveur

Le cœur de l'extension doit fonctionner hors ligne.

```text
Illustrator
    │
    └── Logo Grid Generator
             │
             └── Grid Engine
```

Aucun serveur n'est nécessaire pour :

- calculer la géométrie ;
- créer les grilles ;
- modifier les paramètres ;
- gérer les presets locaux.

---

# 62. Architecture finale recommandée

```text
┌──────────────────────────────────────┐
│       LOGO GRID GENERATOR            │
├──────────────────────────────────────┤
│                                      │
│              UI                      │
│         HTML / CSS / TS              │
│                                      │
├──────────────────────────────────────┤
│                                      │
│          APPLICATION CORE            │
│                                      │
│  State                               │
│  Validation                          │
│  Presets                             │
│                                      │
├──────────────────────────────────────┤
│                                      │
│          GRID ENGINE                 │
│                                      │
│  Circular                            │
│  Modular                             │
│  Square                              │
│  Radial                              │
│  Golden Ratio                        │
│  Custom                              │
│                                      │
├──────────────────────────────────────┤
│                                      │
│       GEOMETRY ENGINE                │
│                                      │
│  Bounds                              │
│  Center                              │
│  Coordinates                         │
│  Units                               │
│                                      │
├──────────────────────────────────────┤
│                                      │
│      ILLUSTRATOR ADAPTER             │
│                                      │
│  Document                            │
│  Selection                           │
│  Layers                              │
│  Paths                               │
│  Groups                              │
│                                      │
└──────────────────────────────────────┘
```

---

# 63. Version 0.1 — MVP

La première version doit rester simple.

Fonctionnalités obligatoires :

```text
✓ Détection du document
✓ Détection de la sélection
✓ Calcul des bounds
✓ Calcul du centre
✓ Grille circulaire
✓ Nombre d'anneaux
✓ Espacement
✓ Stroke
✓ Opacité
✓ Couleur
✓ Calque LOGO GRID
✓ Generate
✓ Clear
✓ Gestion des erreurs
```

---

# 64. Version 0.2

Ajouter :

```text
✓ Grille carrée
✓ Grille modulaire
✓ Grille radiale
✓ Centre
✓ Bounding Box
✓ Lock Grid
✓ Presets
```

---

# 65. Version 0.3

Ajouter :

```text
✓ Golden Ratio
✓ Custom Grid
✓ Multiple selection
✓ One grid per object
✓ Grid combination
✓ Guide mode
```

---

# 66. Version 1.0

Version professionnelle :

```text
✓ UI finalisée
✓ Tous les types de grilles
✓ Presets
✓ Import/export
✓ Preview
✓ Undo optimisé
✓ Gestion avancée des calques
✓ Documentation
✓ Tests
✓ Compatibilité vérifiée
✓ Packaging
✓ Installation simplifiée
```

---

# 67. Tests fonctionnels

Chaque fonctionnalité doit être testée.

## Test 1 — Aucun document

Résultat attendu :

```text
Message d'erreur.
Aucune modification.
```

## Test 2 — Aucun objet sélectionné

Résultat attendu :

```text
Message demandant de sélectionner un objet.
```

## Test 3 — Logo simple

Résultat attendu :

```text
Grille créée autour du logo.
```

## Test 4 — Logo groupé

Résultat attendu :

```text
Bounding box du groupe utilisée.
```

## Test 5 — Plusieurs objets

Résultat attendu :

```text
Comportement correspondant au mode choisi.
```

## Test 6 — Clear Grid

Résultat attendu :

```text
Grille supprimée.
Logo intact.
```

---

# 68. Tests géométriques

Pour chaque générateur, vérifier :

```text
centerX
centerY
radius
spacing
angles
dimensions
```

Exemple :

```text
Input:

width = 200
height = 100

Expected:

maxDimension = 200
baseRadius = 100
```

---

# 69. Tests de précision

Les grilles doivent respecter :

```text
distance constante entre les anneaux
angles réguliers
symétrie
alignement
proportions
```

Pour une grille radiale avec :

```text
N = 8
```

on doit obtenir :

```text
45°
```

entre chaque ligne.

---

# 70. Tests de non-destruction

Avant génération :

```text
Original logo
```

Après génération :

```text
Original logo
+
Grid
```

Le logo doit être identique.

---

# 71. Tests de suppression

Après :

```text
Clear Grid
```

le résultat doit être :

```text
Original logo
```

et non :

```text
Document vide
```

---

# 72. Tests de performances

Tester avec :

```text
10 rings
50 rings
100 rings
```

et :

```text
8 divisions
36 divisions
72 divisions
180 divisions
360 divisions
```

L'interface ne doit pas devenir inutilisable.

---

# 73. Gestion des documents complexes

Tester avec :

- objets vectoriels ;
- groupes ;
- compound paths ;
- textes convertis ;
- symboles ;
- clipping masks ;
- objets avec rotation ;
- objets avec transformation ;
- logos très grands ;
- logos très petits.

---

# 74. Rotation

Le système doit définir clairement si les bounds utilisés sont :

```text
AABB
```

ou des bounds tenant compte de la rotation.

Le comportement doit être documenté afin d'éviter des résultats inattendus.

---

# 75. Architecture orientée extensibilité

Le moteur doit permettre d'ajouter facilement de nouvelles grilles.

Exemple :

```text
GridGenerator
       │
       ├── CircularGrid
       ├── SquareGrid
       ├── ModularGrid
       ├── RadialGrid
       ├── GoldenRatioGrid
       └── FutureGrid
```

Ajouter une nouvelle grille ne doit pas nécessiter de réécrire toute l'application.

---

# 76. Exemple d'API interne

```typescript
interface GridContext {
    bounds: Bounds;
    center: Point;
    settings: GridSettings;
}
```

Puis :

```typescript
class CircularGridGenerator {

    generate(
        context: GridContext
    ): GridGeometry {
        // calculate circles
    }

}
```

---

# 77. Géométrie intermédiaire

Il est recommandé que le moteur ne crée pas immédiatement des objets Illustrator.

Il devrait d'abord produire une représentation abstraite :

```typescript
type GridGeometry =
    | CircleGeometry
    | LineGeometry
    | RectangleGeometry;
```

Exemple :

```typescript
interface CircleGeometry {
    type: "circle";
    cx: number;
    cy: number;
    radius: number;
}
```

Puis :

```text
Grid Engine
     ↓
Grid Geometry
     ↓
Illustrator Adapter
     ↓
Illustrator Paths
```

Cette architecture facilite énormément les tests.

---

# 78. Pourquoi cette architecture ?

Elle permet de séparer :

```text
Mathématiques
```

de :

```text
Illustrator
```

Ainsi, le calcul d'une grille peut être testé sans même ouvrir Illustrator.

C'est une bonne pratique importante pour la maintenance du projet.

---

# 79. Expérience utilisateur finale

L'utilisation idéale doit ressembler à ceci :

```text
1. Ouvrir Illustrator

2. Ouvrir un document

3. Dessiner ou importer un logo

4. Sélectionner le logo

5. Ouvrir :
   Window → Extensions/Plugins →
   Logo Grid Generator

6. Choisir :
   Circular

7. Régler :
   Rings = 6
   Spacing = 20
   Stroke = 1
   Opacity = 40%

8. Cliquer :
   Generate Grid

9. Illustrator crée :

   LOGO
   +
   LOGO GRID

10. Le designer continue son travail.
```

---

# 80. Résultat attendu

Le résultat final doit donner l'impression d'un outil natif d'Illustrator.

L'utilisateur ne doit pas avoir besoin de :

- créer manuellement des cercles ;
- calculer les rayons ;
- mesurer les distances ;
- dupliquer les objets ;
- aligner les lignes ;
- organiser manuellement les calques.

Une seule action doit suffire :

```text
GENERATE GRID
```

---

# 81. Critères d'acceptation

Le projet est considéré comme fonctionnel lorsque :

- [ ] l'extension peut être installée selon la procédure documentée ;
- [ ] Illustrator détecte l'extension ;
- [ ] l'extension peut être ouverte depuis Illustrator ;
- [ ] l'interface fonctionne sans erreur ;
- [ ] un objet sélectionné est correctement détecté ;
- [ ] ses dimensions sont correctement récupérées ;
- [ ] son centre est correctement calculé ;
- [ ] une grille circulaire peut être générée ;
- [ ] une grille modulaire peut être générée ;
- [ ] une grille carrée peut être générée ;
- [ ] une grille radiale peut être générée ;
- [ ] une grille Golden Ratio peut être générée ;
- [ ] les paramètres sont respectés ;
- [ ] les styles sont correctement appliqués ;
- [ ] la grille est créée dans un calque dédié ;
- [ ] le logo original reste intact ;
- [ ] Clear Grid fonctionne ;
- [ ] les erreurs sont correctement gérées ;
- [ ] Undo fonctionne correctement ;
- [ ] les presets fonctionnent ;
- [ ] l'extension reste utilisable sur des documents réels ;
- [ ] les performances restent acceptables.

---

# 82. Roadmap de développement

```text
PHASE 1
│
├── Initialisation projet
├── Configuration extension
└── Hello World Illustrator

        ↓

PHASE 2
│
├── Détection document
├── Détection sélection
├── Bounds
└── Centre

        ↓

PHASE 3
│
├── Grid Engine
├── Circular Grid
└── Illustrator Adapter

        ↓

PHASE 4
│
├── UI complète
├── Styles
├── Clear
└── Undo

        ↓

PHASE 5
│
├── Modular Grid
├── Square Grid
└── Radial Grid

        ↓

PHASE 6
│
├── Golden Ratio
├── Custom Grid
└── Grid Combination

        ↓

PHASE 7
│
├── Presets
├── Preview
├── Persistence
└── Advanced Settings

        ↓

PHASE 8
│
├── Tests
├── Optimisation
├── Packaging
└── Documentation

        ↓

VERSION 1.0
```

---

# 83. Évolutions futures

Après la version 1.0, plusieurs fonctionnalités peuvent être envisagées.

## Smart Grid

Analyse automatique du logo afin de proposer une grille adaptée.

```text
Logo
 ↓
Analyse géométrique
 ↓
Détection formes dominantes
 ↓
Suggestion de grille
```

---

## Symmetry Detector

Détection automatique :

```text
symétrie horizontale
symétrie verticale
symétrie radiale
```

---

## Logo Construction Assistant

L'extension pourrait analyser le logo et proposer :

```text
Possible construction:

Circle 120 px
Circle 80 px
Golden ratio 1.618
Radial division: 8
```

---

## Shape Analysis

Analyse :

```text
Circles
Lines
Rectangles
Angles
Curves
```

---

## Smart Recommendations

Exemple :

```text
This logo appears to use
a circular construction.

Recommended:
6 concentric circles
8 radial divisions
```

---

# 84. Positionnement du produit

Logo Grid Generator ne doit pas être conçu comme un simple script.

Il doit être pensé comme un véritable **outil professionnel de construction de logos pour Illustrator**.

La différence fondamentale est :

```text
Script simple
        ↓
Une action automatisée

Logo Grid Generator
        ↓
Un véritable système
        ↓
UI
+
Grid Engine
+
Geometry Engine
+
Presets
+
Illustrator Integration
+
Workflow
```

---

# 85. Architecture cible finale

```text
                    USER
                      │
                      ▼
             ┌────────────────┐
             │ Illustrator UI │
             └───────┬────────┘
                     │
                     ▼
        ┌─────────────────────────┐
        │  LOGO GRID GENERATOR    │
        │                         │
        │  UI / Controller        │
        └────────────┬────────────┘
                     │
             ┌───────▼────────┐
             │  State Manager │
             └───────┬────────┘
                     │
             ┌───────▼────────┐
             │ Grid Engine     │
             └───────┬────────┘
                     │
       ┌─────────────┼──────────────┐
       │             │              │
       ▼             ▼              ▼
   Circular       Modular        Radial
       │             │              │
       └─────────────┼──────────────┘
                     │
                     ▼
              Geometry Engine
                     │
                     ▼
             Illustrator Adapter
                     │
                     ▼
              Illustrator DOM/API
                     │
                     ▼
              Generated Artwork
```

---

# 86. Conclusion

**Logo Grid Generator** doit automatiser la création de systèmes géométriques destinés à la construction et à la présentation professionnelle de logos dans Adobe Illustrator.

Le cœur du projet repose sur quatre éléments :

```text
1. Une interface simple
2. Un moteur géométrique précis
3. Une intégration propre avec Illustrator
4. Une architecture extensible
```

La première priorité est de construire un **MVP stable avec la grille circulaire**, puis d'ajouter progressivement les autres systèmes de construction.

L'architecture doit dès le départ être suffisamment propre pour permettre l'évolution vers :

```text
Circular Grid
Modular Grid
Square Grid
Radial Grid
Golden Ratio
Custom Grid
Smart Grid
Logo Analysis
AI-assisted Construction
```

L'objectif final est de transformer une tâche qui demande normalement plusieurs manipulations manuelles en un workflow de quelques secondes :

```text
SELECT LOGO
     ↓
CHOOSE GRID
     ↓
CONFIGURE
     ↓
GENERATE
     ↓
PROFESSIONAL LOGO GRID
```

---

## Nom du projet

```text
Logo Grid Generator
```

## Identifiant recommandé

```text
com.logogridgenerator.illustrator
```

## Type

```text
Adobe Illustrator Extension
```

## Version initiale

```text
0.1.0
```

## Version cible

```text
1.0.0
```

## Priorité de développement

```text
1. Circular Grid
2. Illustrator Integration
3. Non-destructive Layers
4. UI
5. Clear / Regenerate
6. Modular Grid
7. Radial Grid
8. Golden Ratio
9. Presets
10. Advanced / Smart Features
```

> **Note d'implémentation :** avant de figer le code du manifest et la procédure d'installation, il faut choisir précisément la famille d'extension et la version minimale d'Illustrator supportée. Le système d'installation historique des extensions Adobe (notamment CEP) et le système moderne UXP ne sont pas interchangeables. La documentation d'installation doit donc être générée à partir de cette cible technique, et non supposer qu'un simple copier-coller dans un dossier `Extensions` fonctionne sur toutes les versions.