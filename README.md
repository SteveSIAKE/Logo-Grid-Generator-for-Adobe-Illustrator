# Logo Presentation Studio
## Spécification technique — Refonte du produit et évolution fonctionnelle

**Version du document :** 2.0.0  
**Version initiale du produit :** 0.1.0  
**Type de produit :** Extension professionnelle pour Adobe Illustrator  
**Catégorie :** Branding, identité visuelle, présentation graphique et automatisation créative  
**Statut :** Spécification fonctionnelle et technique  
**Nom de code :** Logo Presentation Studio  
**Identifiant envisagé :** `com.logopresentationstudio.illustrator`

---

# 1. Contexte et justification de la mise à jour

Le projet initial, nommé *Logo Grid Generator*, avait pour objectif principal d'automatiser la génération de grilles de construction géométriques autour de logos créés dans Adobe Illustrator.

Cette première approche permettait d'envisager la génération de cercles concentriques, de grilles modulaires, de lignes radiales, de rectangles proportionnels et d'autres formes géométriques destinées à illustrer la construction d'un logo.

Cependant, cette fonctionnalité, bien qu'utile, répond à un besoin relativement limité. Elle traite uniquement une partie du processus de présentation d'une identité visuelle.

Dans un véritable projet de branding, le travail du designer ne s'arrête pas à la création du logo. Il faut également présenter les différentes variantes, expliquer les choix géométriques, documenter les couleurs, montrer les typographies, définir les marges de protection et organiser l'ensemble dans une présentation professionnelle destinée au client.

La création de ces planches demande généralement de nombreuses manipulations manuelles : alignement des objets, création de cadres, organisation des sections, rédaction des légendes, récupération des couleurs, construction de grilles, gestion des espacements et harmonisation de la mise en page.

Cette nouvelle version du projet vise donc à automatiser une partie importante de ce travail.

## 1.1 Nouvelle vision du produit

Le projet évolue vers une extension capable de transformer un ensemble d'éléments graphiques en une présentation structurée d'identité visuelle.

Le produit ne doit plus être considéré comme un simple générateur de formes géométriques, mais comme un **assistant de présentation de marque intégré directement à Adobe Illustrator**.

L'extension devra permettre au designer de sélectionner ses éléments, de choisir les informations à présenter, de configurer un style de mise en page et de générer automatiquement une planche cohérente, organisée et entièrement modifiable.

Le moteur de grilles de construction reste une fonctionnalité importante, mais il devient un module parmi plusieurs autres.

## 1.2 Nouvelle proposition de valeur

La proposition de valeur est la suivante :

> Transformer les éléments d'une identité visuelle en une présentation professionnelle, structurée et personnalisable, sans obliger le designer à construire manuellement chaque section de la planche.

L'extension doit réduire les tâches répétitives tout en préservant le contrôle créatif du designer.

Elle ne doit pas chercher à remplacer le travail de conception graphique, mais à faciliter la présentation et la documentation de ce travail.

---

# 2. Nouvel objectif général

Développer une extension pour Adobe Illustrator permettant de générer automatiquement des planches de présentation de logos et d'identités visuelles à partir des éléments disponibles dans un document Illustrator.

Le système doit combiner plusieurs moteurs fonctionnels :

- un moteur de composition de planches ;
- un moteur de grilles de construction ;
- un moteur d'extraction et de présentation des couleurs ;
- un moteur de présentation typographique ;
- un gestionnaire de variantes de logo ;
- un moteur de création de marges et de zones de protection ;
- un système de modèles de présentation ;
- un gestionnaire de paramètres et de configurations ;
- un module d'exportation adapté au document final.

L'ensemble doit être accessible depuis une interface unique dans Illustrator.

## 2.1 Objectifs spécifiques

L'extension devra permettre de :

1. Générer une planche de présentation à partir d'une sélection ou d'un ensemble d'éléments préparés.
2. Organiser automatiquement les éléments dans des sections cohérentes.
3. Présenter le logo principal et ses variantes.
4. Générer une grille géométrique adaptée aux dimensions du logo.
5. Extraire les couleurs des objets sélectionnés et les présenter sous forme de nuanciers.
6. Afficher les codes colorimétriques disponibles.
7. Documenter les familles typographiques et leurs graisses.
8. Créer des exemples de hiérarchie typographique.
9. Présenter les marges de protection et les règles de construction.
10. Proposer plusieurs styles de présentation.
11. Permettre la modification manuelle de tous les éléments générés.
12. Créer des calques organisés et identifiables.
13. Préserver les éléments originaux du document.
14. Régénérer une présentation après modification des paramètres.
15. Exporter la présentation finale selon les capacités d'Illustrator et les options disponibles.

---

# 3. Périmètre fonctionnel du produit

La nouvelle version doit être organisée autour de modules indépendants.

## 3.1 Modules principaux

### Module A — Logo Showcase

Ce module gère la présentation des logos et de leurs déclinaisons.

### Module B — Construction Grid

Ce module génère les grilles géométriques, les axes et les repères nécessaires à l'explication de la construction du logo.

### Module C — Color Palette

Ce module analyse les couleurs accessibles dans les objets concernés et génère des nuanciers documentés.

### Module D — Typography System

Ce module organise les informations typographiques et génère des spécimens de texte.

### Module E — Clear Space & Proportions

Ce module illustre les marges de protection, les axes et les proportions du logo.

### Module F — Brand Board Generator

Ce module assemble les sections précédentes dans une planche de présentation.

### Module G — Templates & Presets

Ce module gère les modèles de mise en page et les configurations réutilisables.

### Module H — Export & Delivery

Ce module prépare le document final et facilite son exportation.

### Module I — Brand Applications

Ce module permet de présenter les applications de l'identité visuelle, notamment la papeterie, les cartes de visite et les supports graphiques importés ou déjà présents dans Illustrator.

Ce dernier module pourra être développé progressivement après la stabilisation du cœur de l'application.

---

# 4. Principes fondamentaux de conception

## 4.1 Non-destructivité

L'extension ne doit jamais modifier ou supprimer silencieusement le logo original.

La génération d'une présentation doit créer une nouvelle zone de travail, un nouveau groupe ou une nouvelle planche, selon la stratégie retenue.

Les éléments sources doivent rester accessibles et modifiables.

## 4.2 Édition native

Les formes, textes, cadres, lignes et nuanciers générés doivent autant que possible être des objets natifs d'Illustrator.

L'utilisateur doit pouvoir modifier les couleurs, les dimensions, les textes, les contours et les positions après la génération.

Le résultat ne doit pas être une simple image aplatie.

## 4.3 Modularité

Chaque section doit pouvoir être activée ou désactivée indépendamment.

Le designer doit pouvoir générer uniquement une palette de couleurs, une présentation typographique ou une planche complète.

## 4.4 Personnalisation

Les modèles proposés constituent des points de départ, et non des compositions rigides.

Les dimensions, les espacements, les couleurs, les titres, les légendes et les styles doivent pouvoir être personnalisés.

## 4.5 Fiabilité

Les valeurs extraites automatiquement doivent être fondées sur les informations réellement accessibles dans le document.

L'extension ne doit pas inventer une typographie officielle, une couleur principale ou une règle de construction lorsqu'elle ne dispose pas d'informations suffisantes.

---

# 5. Parcours utilisateur général

Le parcours principal doit rester simple.

1. Le designer ouvre Adobe Illustrator.
2. Il ouvre un document contenant son logo et les éléments de son identité visuelle.
3. Il ouvre Logo Presentation Studio depuis l'interface d'Illustrator.
4. Il choisit le mode de création.
5. Il sélectionne les objets ou le document à analyser.
6. Il choisit les modules à inclure.
7. Il sélectionne un format de planche.
8. Il choisit un modèle visuel.
9. Il configure les paramètres.
10. Il lance la génération.
11. L'extension crée la présentation dans le document.
12. Le designer ajuste les détails.
13. Il exporte le résultat final.

Le nombre d'étapes doit être réduit au maximum sans supprimer les contrôles importants.

---

# 6. Modes de création

L'extension doit proposer trois modes de fonctionnement complémentaires.

## 6.1 Mode assisté par sélection

Dans ce mode, le designer sélectionne explicitement les objets qu'il souhaite intégrer.

L'extension récupère les éléments sélectionnés, analyse leurs propriétés accessibles et les répartit dans les modules appropriés lorsque leur rôle peut être déterminé.

Ce mode est le plus adapté à une première version, car il limite les ambiguïtés.

## 6.2 Mode d'analyse du document

Dans ce mode, l'extension parcourt le document actif afin d'identifier les éléments accessibles susceptibles d'être utilisés dans la présentation.

Elle peut rechercher :

- les objets vectoriels ;
- les groupes ;
- les textes ;
- les couleurs ;
- les noms des calques ;
- les objets placés ;
- les dimensions des éléments.

L'analyse doit respecter les restrictions de l'API Illustrator utilisée et tenir compte des objets masqués, verrouillés ou difficiles à interpréter.

L'extension doit afficher les résultats de l'analyse avant de les utiliser dans une composition automatique.

## 6.3 Mode par modèles

Dans ce mode, l'utilisateur choisit un modèle de présentation puis associe les éléments de son document aux zones prévues.

Exemple :

- Logo principal ;
- Logo secondaire ;
- Symbole ;
- Palette ;
- Typographie ;
- Construction géométrique.

Ce mode est utile lorsque le document contient beaucoup d'éléments ou lorsque le designer souhaite contrôler précisément le rôle de chaque objet.

---

# 7. Module Logo Showcase

## 7.1 Objectif

Le module Logo Showcase organise les différentes versions d'un logo et les présente dans une section claire de la planche.

## 7.2 Types de variantes

Le système doit pouvoir gérer :

- le logo principal ;
- le logo secondaire ;
- la version horizontale ;
- la version verticale ;
- le symbole seul ;
- le monogramme ;
- la version monochrome ;
- la version inversée pour fond sombre ;
- les variantes de couleur.

La détection automatique du rôle de chaque variante ne doit pas être considérée comme garantie.

Le designer doit pouvoir attribuer manuellement un rôle à chaque objet.

## 7.3 Fonctionnalités

L'utilisateur doit pouvoir :

- ajouter un objet à la section ;
- retirer un objet de la section ;
- modifier l'ordre des variantes ;
- définir un nom pour chaque variante ;
- ajouter une légende ;
- contrôler la taille maximale d'affichage ;
- choisir le fond de présentation ;
- définir l'espacement entre les variantes ;
- conserver les proportions originales.

## 7.4 Préservation des proportions

Les objets ne doivent jamais être déformés pour remplir une zone.

Le système doit utiliser un facteur d'échelle uniforme.

Pour une zone disponible de dimensions \(W_a\) et \(H_a\), et un objet de dimensions \(W_o\) et \(H_o\), le facteur d'échelle est :

\[
s = \min\left(\frac{W_a}{W_o},\frac{H_a}{H_o}\right)
\]

Les nouvelles dimensions sont :

\[
W_n=sW_o,\qquad H_n=sH_o
\]

Ce calcul permet de conserver les proportions du logo.

L'extension doit également gérer les objets dont la largeur ou la hauteur est nulle ou trop faible, afin d'éviter les divisions invalides.

---

# 8. Module Construction Grid

## 8.1 Objectif

Ce module reprend les fonctionnalités de l'ancien Logo Grid Generator et les intègre dans le système global de présentation.

La grille n'est plus une fin en soi : elle devient une section explicative de la planche d'identité visuelle.

## 8.2 Types de grilles

Le module doit proposer :

- la grille circulaire ;
- la grille concentrique ;
- la grille carrée ;
- la grille modulaire ;
- la grille radiale ;
- les lignes d'alignement ;
- les axes de symétrie ;
- les repères de proportion ;
- la grille personnalisée ;
- les constructions basées sur le nombre d'or.

## 8.3 Paramètres

Les paramètres comprennent :

- nombre d'anneaux ;
- rayon initial ;
- espacement ;
- nombre de divisions ;
- rotation ;
- nombre de colonnes ;
- nombre de lignes ;
- largeur et hauteur ;
- épaisseur des contours ;
- couleur ;
- opacité ;
- marge extérieure ;
- position du centre.

## 8.4 Génération à partir du logo

Le moteur doit récupérer les limites géométriques de l'objet ou du groupe concerné.

Les informations nécessaires sont :

- gauche ;
- droite ;
- haut ;
- bas ;
- largeur ;
- hauteur ;
- centre géométrique.

Il doit ensuite calculer les paramètres de construction à partir de ces informations et des préférences de l'utilisateur.

Une grille peut être générée autour du logo, derrière celui-ci ou dans une zone de présentation distincte.

## 8.5 Précision des constructions

Les grilles doivent être calculées mathématiquement.

Pour une grille radiale composée de \(N\) divisions :

\[
\Delta\theta=\frac{360^\circ}{N}
\]

Chaque ligne est calculée à partir du centre, de l'angle et de la longueur souhaitée.

Pour les grilles circulaires, les rayons doivent respecter les paramètres de départ et d'espacement.

## 8.6 Règles de présentation

Le module doit permettre de générer une grille visuellement propre, sans masquer excessivement le logo.

Il doit notamment gérer :

- les contours fins ;
- la transparence ;
- la hiérarchie des lignes ;
- la distinction entre axes principaux et secondaires ;
- les annotations ;
- la légende de la construction.

La présence d'une grille ne doit pas laisser entendre que le logo a nécessairement été conçu selon cette grille. Il s'agit d'une représentation de construction qui doit être cohérente avec le processus réel du designer.

---

# 9. Module Color Palette

## 9.1 Objectif

Le module Color Palette permet de récupérer les couleurs utilisées dans les éléments concernés, de les organiser et de générer une section de palette prête à être intégrée dans la planche.

## 9.2 Extraction des couleurs

L'extension doit analyser les couleurs accessibles dans les objets sélectionnés ou dans le périmètre choisi.

Les propriétés pertinentes peuvent inclure :

- les couleurs de remplissage ;
- les couleurs de contour ;
- les couleurs de texte ;
- les couleurs présentes dans les objets vectoriels ;
- les couleurs des groupes et sous-objets accessibles ;
- les couleurs issues des nuances Illustrator, lorsque l'API le permet.

Les dégradés, motifs, couleurs spéciales, tons directs et transparences doivent être traités explicitement.

Une couleur de dégradé ne doit pas être présentée comme une couleur unique si plusieurs couleurs sont présentes.

## 9.3 Déduplication

Les couleurs identiques doivent être regroupées.

Le moteur doit utiliser une représentation normalisée des couleurs afin d'éviter les doublons dus à des différences de format.

Les couleurs proches ne doivent pas être fusionnées automatiquement sans règle explicite, car une différence faible peut être volontaire dans une identité visuelle.

## 9.4 Affichage des couleurs

Chaque couleur peut être présentée avec :

- un échantillon visuel ;
- un nom défini par le designer ;
- une valeur HEX lorsque celle-ci est pertinente ;
- les valeurs RGB ;
- les valeurs CMYK lorsque la conversion est appropriée ;
- le nom de la nuance Illustrator, si disponible ;
- un libellé de rôle, par exemple « principale », « secondaire » ou « accent ».

Les valeurs doivent être calculées à partir de la couleur réelle et des profils ou conversions appropriés.

Les conversions CMYK et RGB ne doivent pas être considérées comme parfaitement réversibles.

## 9.5 Attribution des rôles

Le système peut suggérer un ordre de présentation, mais le designer doit pouvoir modifier les rôles des couleurs.

Exemple :

- Couleur principale ;
- Couleur secondaire ;
- Couleur d'accent ;
- Couleur de fond ;
- Couleur neutre.

Aucune couleur ne doit être déclarée officiellement principale uniquement parce qu'elle apparaît le plus souvent dans le document.

## 9.6 Génération de la palette

Le moteur doit créer des échantillons vectoriels organisés dans une grille.

Chaque échantillon peut comprendre :

- un rectangle de couleur ;
- un nom ;
- un code ;
- une légende.

La taille des échantillons et la disposition doivent dépendre du format de la planche et du nombre de couleurs.

---

# 10. Module Typography System

## 10.1 Objectif

Le module Typography System présente les familles typographiques utilisées dans l'identité visuelle.

Il doit permettre de générer une section documentaire comportant les familles, les graisses, les tailles de démonstration et les exemples de hiérarchie.

## 10.2 Détection des typographies

L'extension doit examiner les objets texte accessibles afin de récupérer les informations disponibles :

- famille typographique ;
- style ;
- graisse, lorsque l'information est accessible ;
- taille ;
- alignement ;
- couleur ;
- autres propriétés typographiques exposées par l'API.

Les informations doivent être regroupées lorsque plusieurs objets utilisent la même famille et le même style.

## 10.3 Gestion des polices indisponibles

L'extension doit détecter les situations dans lesquelles une police n'est pas accessible ou ne peut pas être identifiée de façon fiable.

Elle doit afficher un avertissement plutôt que remplacer silencieusement la typographie.

Les textes convertis en contours ne permettent généralement plus de retrouver avec certitude leur famille typographique d'origine. Ils doivent donc être traités comme des formes vectorielles, sauf si le designer fournit explicitement l'information.

## 10.4 Spécimens typographiques

L'extension peut générer des exemples comprenant :

- le nom de la famille ;
- les caractères majuscules ;
- les caractères minuscules ;
- les chiffres ;
- les signes de ponctuation ;
- un exemple de titre ;
- un exemple de sous-titre ;
- un exemple de texte courant.

Le texte de démonstration doit être configurable.

## 10.5 Hiérarchie typographique

Le designer doit pouvoir définir une hiérarchie telle que :

- H1 : titre principal ;
- H2 : sous-titre ;
- H3 : titre de section ;
- Body : texte courant ;
- Caption : légende.

Chaque niveau peut disposer de paramètres spécifiques :

- famille ;
- style ;
- taille ;
- interlignage ;
- approche ;
- couleur ;
- alignement.

Ces styles constituent des exemples de présentation et ne doivent pas être automatiquement interprétés comme des règles officielles de la marque.

---

# 11. Module Clear Space & Proportions

## 11.1 Objectif

Ce module présente les marges de protection et les proportions du logo.

Il doit générer des repères visuels permettant de comprendre l'espace minimal à conserver autour du logo et les dimensions relatives des éléments.

## 11.2 Paramètres

L'utilisateur peut définir :

- la marge supérieure ;
- la marge inférieure ;
- la marge gauche ;
- la marge droite ;
- une unité de référence ;
- une règle basée sur une partie du logo ;
- une règle personnalisée ;
- les lignes de repère ;
- les dimensions annotées.

## 11.3 Unité de référence

L'utilisateur peut définir une unité de référence, par exemple la largeur d'un élément du symbole ou la hauteur d'une lettre.

Le moteur utilise cette unité pour calculer les marges.

Si l'unité de référence vaut \(u\), une marge définie à \(k\) unités vaut :

\[
m=k\times u
\]

Le système doit afficher clairement cette règle dans la présentation.

## 11.4 Limite importante

Une marge de protection ne peut pas toujours être déduite automatiquement de la géométrie du logo.

L'extension peut calculer des marges mathématiques, mais le designer doit valider leur pertinence graphique.

---

# 12. Module Brand Board Generator

## 12.1 Objectif

Le Brand Board Generator constitue le cœur du nouveau produit.

Il assemble les modules sélectionnés dans une planche de présentation cohérente.

## 12.2 Responsabilités

Le moteur doit :

- calculer la structure globale ;
- réserver une zone à chaque section ;
- définir les marges ;
- calculer les colonnes ;
- organiser les rangées ;
- placer les objets ;
- redimensionner les éléments sans déformation ;
- générer les titres et légendes ;
- appliquer le style graphique ;
- créer les groupes et calques ;
- vérifier les débordements ;
- éviter les chevauchements involontaires.

## 12.3 Formats de planche

Les formats initiaux doivent inclure :

- A4 portrait ;
- A4 paysage ;
- A3 portrait ;
- A3 paysage ;
- format carré ;
- format personnalisé.

Les dimensions doivent être converties correctement selon les unités du document et le système de coordonnées d'Illustrator.

## 12.4 Structure de la planche

Une composition complète peut suivre cette structure :

1. En-tête de marque ;
2. Logo principal ;
3. Variantes du logo ;
4. Construction géométrique ;
5. Palette de couleurs ;
6. Système typographique ;
7. Marges de protection ;
8. Applications de marque ;
9. Pied de page et informations complémentaires.

Cette organisation est un exemple de départ. Le moteur doit permettre d'autres dispositions selon le modèle choisi.

## 12.5 Système de grille éditoriale

La planche doit reposer sur une grille de mise en page interne.

Cette grille définit :

- les marges extérieures ;
- le nombre de colonnes ;
- les gouttières ;
- les rangées ;
- les espacements verticaux ;
- les zones de titre ;
- les zones de contenu.

Pour une planche de largeur \(W\), comportant \(n\) colonnes, des marges latérales \(m\) et des gouttières \(g\), la largeur théorique d'une colonne est :

\[
c=\frac{W-2m-(n-1)g}{n}
\]

Le système doit vérifier que les dimensions calculées restent positives.

## 12.6 Gestion des contenus

Le moteur doit adapter la mise en page au contenu disponible.

Par exemple :

- une seule couleur doit produire une palette compacte ;
- une palette de huit couleurs doit utiliser davantage de cellules ;
- une seule variante de logo ne doit pas créer de grands espaces vides ;
- l'absence de typographie documentée doit permettre de désactiver cette section ;
- une planche très chargée doit proposer une répartition sur plusieurs zones ou plusieurs plans de travail.

L'extension ne doit pas remplir artificiellement les sections avec des données inventées.

---

# 13. Système de templates

## 13.1 Objectif

Les templates permettent de générer plusieurs styles de présentation à partir des mêmes éléments.

## 13.2 Modèles initiaux

### Template Minimal

Caractéristiques :

- fond clair ;
- typographie discrète ;
- grilles fines ;
- espaces généreux ;
- palette limitée ;
- hiérarchie simple.

### Template Premium

Caractéristiques :

- mise en page raffinée ;
- contraste marqué ;
- typographie éditoriale ;
- sections aérées ;
- compositions centrées ;
- possibilité de fond sombre ou clair.

### Template Corporate

Caractéristiques :

- organisation rigoureuse ;
- titres explicites ;
- sections clairement séparées ;
- hiérarchie documentaire ;
- palette sobre ;
- légendes informatives.

### Template Editorial

Caractéristiques :

- compositions asymétriques ;
- titres expressifs ;
- grandes zones visuelles ;
- rythme typographique ;
- mise en page plus expérimentale.

## 13.3 Personnalisation des templates

Chaque modèle doit définir une configuration indépendante :

- couleurs de présentation ;
- marges ;
- gouttières ;
- nombre de colonnes ;
- tailles de titres ;
- styles de légendes ;
- épaisseur des séparateurs ;
- arrière-plan ;
- alignement ;
- densité des informations.

Le modèle doit agir comme une configuration de mise en page, et non comme un ensemble de positions fixes impossibles à adapter.

---

# 14. Module Brand Applications

## 14.1 Objectif

Ce module permet d'ajouter des exemples d'utilisation de l'identité visuelle.

Les applications peuvent comprendre :

- cartes de visite ;
- papier à en-tête ;
- enveloppes ;
- packaging ;
- affiches ;
- supports numériques ;
- visuels de réseaux sociaux.

## 14.2 Sources des applications

Les applications peuvent provenir :

- d'objets déjà présents dans Illustrator ;
- de compositions vectorielles créées par le designer ;
- de fichiers ou d'images importés ;
- de modèles vectoriels fournis avec l'extension.

La génération de mockups photoréalistes n'est pas une exigence du MVP.

La première version doit privilégier l'organisation des éléments disponibles et des maquettes vectorielles simples.

## 14.3 Placement

Les applications doivent être disposées dans des zones dédiées.

L'extension doit préserver les proportions et permettre au designer de contrôler :

- le nombre d'applications ;
- leur ordre ;
- leur taille ;
- leur fond ;
- leurs légendes ;
- leurs espacements.

---

# 15. Interface utilisateur

## 15.1 Principes

L'interface doit être compacte, claire et adaptée à une extension intégrée dans Illustrator.

Elle doit éviter les panneaux excessivement chargés.

L'utilisateur doit comprendre rapidement :

- les éléments analysés ;
- les modules activés ;
- les paramètres actuels ;
- les actions disponibles ;
- les éventuelles erreurs.

## 15.2 Structure générale

L'interface peut être organisée en cinq zones :

1. En-tête ;
2. Source des éléments ;
3. Sélection des modules ;
4. Paramètres de présentation ;
5. Actions principales.

## 15.3 En-tête

L'en-tête doit contenir :

- le nom de l'extension ;
- la version ;
- un accès aux paramètres ;
- éventuellement un bouton d'aide.

## 15.4 Source des éléments

Cette section permet de choisir :

- sélection actuelle ;
- analyse du document ;
- association manuelle des éléments.

Elle doit afficher le nombre d'objets identifiés et les avertissements importants.

## 15.5 Modules

Chaque module doit être activable indépendamment.

L'interface peut présenter une liste de modules avec un indicateur d'état.

Exemple :

- Logo Showcase ;
- Construction Grid ;
- Color Palette ;
- Typography System ;
- Clear Space ;
- Brand Applications.

## 15.6 Paramètres

Les paramètres doivent être contextuels.

Lorsque l'utilisateur active Construction Grid, il voit les paramètres de grille.

Lorsqu'il active Color Palette, il voit les options de nuanciers.

Lorsqu'il active Typography System, il voit les paramètres de présentation typographique.

Cette approche réduit la complexité visuelle.

## 15.7 Actions

Les actions principales sont :

- Analyze;
- Generate Presentation;
- Regenerate;
- Clear Generated Presentation;
- Save Preset.

Les libellés peuvent être adaptés à la langue de l'interface.

---

# 16. Architecture technique

## 16.1 Choix technologique

L'extension doit être développée en ciblant une version précise d'Adobe Illustrator.

L'architecture pourra utiliser HTML, CSS et TypeScript, associés au système d'extension et aux API réellement supportés par cette version.

Le choix entre UXP et CEP doit être confirmé avant l'implémentation. Il ne faut pas supposer que toutes les API nécessaires à la sélection, aux calques, aux objets vectoriels, aux textes et à l'export sont disponibles de manière identique dans les deux environnements.

Si une fonctionnalité requise n'est pas exposée par la technologie retenue, une solution de remplacement documentée devra être définie.

## 16.2 Architecture logique

L'application doit être organisée en couches.

### Interface utilisateur

Responsabilités :

- affichage des paramètres ;
- saisie utilisateur ;
- validation visuelle ;
- gestion des interactions ;
- affichage des erreurs ;
- présentation de l'état de génération.

### Application Core

Responsabilités :

- coordination des modules ;
- gestion de la configuration ;
- validation des opérations ;
- gestion des tâches ;
- orchestration de la génération.

### Document Analyzer

Responsabilités :

- accès au document actif ;
- lecture de la sélection ;
- collecte des informations disponibles ;
- analyse des couleurs ;
- analyse des textes ;
- collecte des dimensions.

### Geometry Engine

Responsabilités :

- calcul des bounds ;
- calcul des centres ;
- génération des grilles ;
- calcul des proportions ;
- calcul des marges ;
- conversion des coordonnées.

### Color Engine

Responsabilités :

- normalisation des couleurs ;
- regroupement des doublons ;
- conversion des représentations ;
- génération des données des nuanciers.

### Typography Engine

Responsabilités :

- regroupement des familles ;
- collecte des styles ;
- génération des spécimens ;
- construction des hiérarchies de texte.

### Layout Engine

Responsabilités :

- calcul des sections ;
- distribution des colonnes ;
- calcul des espacements ;
- placement des éléments ;
- contrôle des débordements.

### Illustrator Adapter

Responsabilités :

- création des calques ;
- création des groupes ;
- création des formes ;
- création des textes ;
- application des couleurs ;
- placement des objets ;
- suppression contrôlée des objets générés.

### Export Manager

Responsabilités :

- préparation du document ;
- configuration des plans de travail si nécessaire ;
- coordination de l'export ;
- remontée des erreurs d'export.

---

# 17. Organisation des fichiers

Une structure de projet recommandée est la suivante :

```text
logo-presentation-studio/
├── src/
│   ├── app/
│   │   ├── app-controller.ts
│   │   ├── app-state.ts
│   │   └── command-registry.ts
│   │
│   ├── ui/
│   │   ├── components/
│   │   ├── panels/
│   │   ├── controls/
│   │   └── notifications/
│   │
│   ├── analyzer/
│   │   ├── document-analyzer.ts
│   │   ├── selection-analyzer.ts
│   │   ├── color-analyzer.ts
│   │   └── typography-analyzer.ts
│   │
│   ├── geometry/
│   │   ├── bounds.ts
│   │   ├── coordinates.ts
│   │   ├── circles.ts
│   │   ├── grids.ts
│   │   └── proportions.ts
│   │
│   ├── colors/
│   │   ├── color-engine.ts
│   │   ├── color-normalizer.ts
│   │   └── palette-layout.ts
│   │
│   ├── typography/
│   │   ├── typography-engine.ts
│   │   ├── font-groups.ts
│   │   └── specimen-generator.ts
│   │
│   ├── layout/
│   │   ├── board-engine.ts
│   │   ├── grid-layout.ts
│   │   ├── templates.ts
│   │   └── overflow-checker.ts
│   │
│   ├── modules/
│   │   ├── logo-showcase.ts
│   │   ├── construction-grid.ts
│   │   ├── color-palette.ts
│   │   ├── typography-system.ts
│   │   ├── clear-space.ts
│   │   └── brand-applications.ts
│   │
│   ├── illustrator/
│   │   ├── illustrator-adapter.ts
│   │   ├── document-service.ts
│   │   ├── layer-service.ts
│   │   ├── shape-service.ts
│   │   └── text-service.ts
│   │
│   ├── presets/
│   │   ├── preset-manager.ts
│   │   └── preset-schema.ts
│   │
│   └── export/
│       └── export-manager.ts
│
├── assets/
│   ├── icons/
│   └── templates/
│
├── tests/
│   ├── geometry/
│   ├── colors/
│   ├── typography/
│   └── layout/
│
├── index.html
├── styles.css
├── manifest.json
├── package.json
├── tsconfig.json
├── README.md
└── PROJECT_SPEC.md
```

Cette structure est indicative. Elle devra être adaptée aux contraintes réelles du système d'extension choisi.

---

# 18. Modèle de données

Les modules doivent communiquer à travers des structures de données communes.

## 18.1 Informations de sélection

Une sélection analysée peut contenir :

- identifiant temporaire de l'objet ;
- type d'objet ;
- limites géométriques ;
- dimensions ;
- centre ;
- couleurs accessibles ;
- propriétés typographiques disponibles ;
- nom du calque ;
- état de visibilité et de verrouillage, lorsque ces informations sont accessibles.

Les identifiants utilisés pendant l'analyse ne doivent pas être supposés permanents si l'API ne garantit pas leur stabilité.

## 18.2 Configuration de la présentation

La configuration globale doit contenir :

- format ;
- orientation ;
- unités ;
- marges ;
- colonnes ;
- gouttières ;
- modules actifs ;
- template choisi ;
- palette de présentation ;
- styles typographiques ;
- paramètres des grilles ;
- options de génération ;
- options de sauvegarde.

## 18.3 Représentation intermédiaire

Le système doit séparer les calculs de la création des objets Illustrator.

Le Layout Engine doit produire une représentation abstraite des éléments à créer.

Exemple conceptuel :

```text
Presentation
├── Page
├── Section
│   ├── Heading
│   ├── LogoObject
│   └── Caption
├── ColorPalette
├── TypographySpecimen
└── ConstructionDiagram
```

L'Illustrator Adapter transforme ensuite cette représentation en objets natifs.

Cette séparation permet de tester le calcul de mise en page indépendamment de l'application hôte.

---

# 19. Gestion des calques

La génération doit produire une organisation claire.

Exemple :

```text
LOGO PRESENTATION STUDIO
├── 01 - Background
├── 02 - Logo Showcase
├── 03 - Construction Grid
├── 04 - Color Palette
├── 05 - Typography
├── 06 - Clear Space
├── 07 - Brand Applications
└── 08 - Labels & Annotations
```

Les modules désactivés ne doivent pas créer de calques vides inutiles.

L'extension doit pouvoir réutiliser les éléments générés par elle lorsque cela est sûr et identifiable.

La suppression doit être limitée aux éléments appartenant réellement à une génération de l'extension.

Il ne faut jamais supprimer un calque entier uniquement parce qu'il porte un nom similaire à celui d'un calque généré.

---

# 20. Génération et régénération

## 20.1 Étapes de génération

Le processus doit suivre les étapes suivantes :

1. Vérifier qu'un document est ouvert.
2. Vérifier la source des éléments.
3. Analyser les objets concernés.
4. Valider les paramètres.
5. Calculer la structure de la planche.
6. Calculer la géométrie de chaque module.
7. Préparer la représentation intermédiaire.
8. Vérifier les débordements et les incohérences.
9. Créer les calques et groupes nécessaires.
10. Créer les objets vectoriels et les textes.
11. Appliquer les styles.
12. Organiser les éléments.
13. Finaliser la génération.
14. Afficher un résumé du résultat.

## 20.2 Régénération

La régénération doit permettre de modifier les paramètres et de reconstruire la présentation.

Le système doit distinguer les objets générés automatiquement des modifications manuelles réalisées ensuite par le designer.

Avant de régénérer, l'extension doit éviter de supprimer les modifications manuelles sans avertissement.

La stratégie initiale recommandée est de permettre une régénération complète de la présentation générée, avec un avertissement clair lorsque des éléments générés ont été modifiés manuellement.

Une évolution pourra proposer une régénération sélective par module.

---

# 21. Gestion des erreurs

L'extension doit gérer les situations suivantes :

- aucun document ouvert ;
- aucune sélection disponible ;
- sélection composée d'objets non exploitables ;
- document ou calque verrouillé ;
- police indisponible ;
- format de couleur non pris en charge ;
- objet trop grand ou trop petit ;
- dimensions invalides ;
- paramètres incohérents ;
- dépassement des limites de génération ;
- échec de création d'un objet ;
- erreur de conversion ;
- problème de compatibilité API ;
- échec d'exportation.

Les messages doivent être compréhensibles par un graphiste.

Les détails techniques doivent être disponibles dans les informations de diagnostic lorsque cela est possible.

L'extension doit également éviter de laisser un document partiellement modifié lorsqu'une génération échoue. Lorsque l'API ne permet pas une transaction atomique, elle doit appliquer une stratégie de nettoyage et de récupération documentée.

---

# 22. Performances et limites

L'analyse d'un document volumineux peut être coûteuse.

Le système doit :

- limiter les analyses répétitives ;
- éviter les créations inutiles de paths ;
- regrouper les opérations lorsque cela est possible ;
- afficher un état de progression pour les tâches longues ;
- limiter le nombre d'objets générés ;
- éviter de recalculer l'ensemble du document à chaque modification d'un paramètre ;
- mettre en cache uniquement les données qui restent valides.

Les limites doivent être configurables lorsque cela est pertinent.

L'extension doit pouvoir fonctionner sur des logos simples sans imposer une analyse complète du document.

---

# 23. Persistance des paramètres

L'extension doit conserver les préférences de l'utilisateur lorsque l'environnement technique le permet.

Les informations peuvent comprendre :

- dernier format utilisé ;
- dernier template ;
- derniers modules activés ;
- dernières couleurs de présentation ;
- paramètres de grilles ;
- styles typographiques ;
- préférences d'affichage.

Les paramètres doivent être validés lors du chargement.

Une configuration invalide ou provenant d'une ancienne version ne doit pas empêcher l'ouverture de l'extension.

---

# 24. Système de presets

Le système doit permettre de sauvegarder des configurations réutilisables.

Un preset peut contenir :

- nom ;
- version du format ;
- template ;
- format de planche ;
- modules actifs ;
- paramètres géométriques ;
- styles typographiques ;
- palette de présentation ;
- règles de mise en page.

Les presets doivent être séparés des données propres à un document.

Un preset ne doit pas contenir de références fragiles vers des objets d'un document particulier, sauf si cette dépendance est explicitement prévue.

L'importation doit vérifier le format et rejeter les configurations invalides.

---

# 25. Exportation

L'extension doit préparer le document pour l'exportation finale.

Les formats visés comprennent :

- PDF pour les présentations et documents de validation ;
- PNG pour les aperçus et les présentations numériques ;
- SVG lorsque le contenu et le workflow le permettent ;
- AI comme document de travail natif.

Le format AI correspond au document Illustrator lui-même, et non à un export générique indépendant.

L'exportation devra s'appuyer sur les capacités d'Illustrator ou de l'API d'extension effectivement disponibles.

La première version peut simplement préparer la planche et laisser l'utilisateur utiliser les commandes natives d'exportation d'Illustrator.

Les options avancées d'exportation pourront être ajoutées ultérieurement.

---

# 26. Compatibilité et installation

Le projet doit être développé pour une version minimale explicitement définie d'Adobe Illustrator.

Le mécanisme d'installation dépend de la technologie retenue.

Les extensions CEP historiques et les extensions UXP modernes ne partagent pas nécessairement les mêmes fichiers de configuration, permissions, API et méthodes de distribution.

La procédure d'installation doit donc être documentée après validation de la cible technique.

Les objectifs d'installation sont :

- installation documentée ;
- chargement fiable dans Illustrator ;
- accès depuis le menu ou le panneau approprié ;
- absence de configuration serveur ;
- fonctionnement local des fonctions principales ;
- désinstallation propre ;
- conservation des documents utilisateur.

La compatibilité ne doit jamais être déclarée sans tests réels sur les versions concernées.

---

# 27. Sécurité et confidentialité

Le fonctionnement de base doit rester local.

Le produit ne doit pas envoyer automatiquement les documents, les logos ou les données de marque vers un serveur distant.

Si une fonctionnalité en ligne est ajoutée ultérieurement, elle devra être facultative et documentée.

L'extension ne doit pas exécuter du code distant non vérifié.

Les fichiers importés, les presets et les données externes doivent être validés avant leur utilisation.

---

# 28. Stratégie de tests

## 28.1 Tests du moteur géométrique

Vérifier :

- les bounds ;
- les centres ;
- les proportions ;
- les conversions d'unités ;
- les calculs des marges ;
- les dimensions des grilles ;
- la distribution des colonnes ;
- le placement des sections.

## 28.2 Tests du moteur de couleurs

Vérifier :

- les couleurs simples ;
- les couleurs de contour ;
- les couleurs de remplissage ;
- les doublons ;
- les dégradés ;
- les tons directs ;
- les couleurs non prises en charge ;
- les conversions.

## 28.3 Tests typographiques

Vérifier :

- les familles répétées ;
- les graisses différentes ;
- les textes avec plusieurs styles ;
- les polices indisponibles ;
- les textes convertis en contours ;
- les textes trop longs ;
- les problèmes de débordement.

## 28.4 Tests de composition

Vérifier :

- les formats portrait ;
- les formats paysage ;
- les planches carrées ;
- les contenus incomplets ;
- les palettes très longues ;
- les logos horizontaux ;
- les logos verticaux ;
- les sections désactivées ;
- les compositions trop chargées.

## 28.5 Tests de non-destruction

Le document source doit rester intact lorsque l'utilisateur génère une présentation.

La suppression et la régénération doivent agir uniquement sur les éléments identifiés comme appartenant à l'extension.

## 28.6 Tests de compatibilité

Les tests doivent être exécutés sur chaque version d'Illustrator officiellement ciblée.

La présence du panneau, l'accès aux API, la génération des objets et les opérations d'export doivent être vérifiés.

---

# 29. MVP — Version 0.1

La première version ne doit pas essayer d'implémenter toutes les fonctionnalités.

Elle doit valider le cœur du produit.

## Fonctionnalités obligatoires

- interface fonctionnelle dans Illustrator ;
- sélection d'objets ;
- récupération des dimensions ;
- choix du format de planche ;
- sélection des modules ;
- présentation du logo principal ;
- génération d'une grille de construction ;
- extraction de couleurs simples ;
- génération d'une palette ;
- création d'une section typographique à partir des informations disponibles ;
- mise en page automatique ;
- création de calques dédiés ;
- génération non destructive ;
- régénération contrôlée ;
- gestion des erreurs.

## Éléments reportés

- analyse intelligente avancée ;
- classification automatique de toutes les variantes ;
- suggestions automatiques de règles de marque ;
- génération photoréaliste de mockups ;
- collaboration en ligne ;
- synchronisation cloud ;
- génération assistée par IA.

---

# 30. Roadmap de développement

## Phase 1 — Architecture

- choisir la technologie d'extension ;
- définir la version minimale d'Illustrator ;
- créer le projet ;
- configurer le manifest ;
- ouvrir l'interface dans Illustrator ;
- vérifier l'accès au document.

## Phase 2 — Analyse

- détecter la sélection ;
- récupérer les bounds ;
- lire les couleurs disponibles ;
- lire les informations typographiques accessibles ;
- construire un modèle de données interne.

## Phase 3 — Composition

- créer le moteur de mise en page ;
- définir les formats ;
- calculer les marges ;
- gérer les colonnes ;
- générer les titres et légendes ;
- créer les sections.

## Phase 4 — Modules

- développer Logo Showcase ;
- intégrer Construction Grid ;
- développer Color Palette ;
- développer Typography System ;
- ajouter Clear Space.

## Phase 5 — Génération

- créer les groupes et calques ;
- produire les objets natifs ;
- appliquer les styles ;
- gérer les débordements ;
- implémenter la régénération.

## Phase 6 — Templates

- créer les modèles Minimal, Premium, Corporate et Editorial ;
- permettre leur personnalisation ;
- ajouter les presets.

## Phase 7 — Qualité

- tests unitaires ;
- tests d'intégration ;
- tests de compatibilité ;
- tests de performances ;
- correction des erreurs ;
- documentation.

## Phase 8 — Distribution

- préparer le package ;
- documenter l'installation ;
- documenter les limites ;
- tester l'installation propre ;
- préparer la version initiale.

---

# 31. Critères d'acceptation de la version 1.0

Le produit pourra être considéré comme prêt lorsque les conditions suivantes seront remplies :

- l'extension s'ouvre depuis Illustrator ;
- le document actif est détecté ;
- les objets sélectionnés sont analysés correctement ;
- les informations indisponibles sont signalées ;
- le logo principal peut être présenté ;
- les variantes peuvent être organisées ;
- les grilles de construction peuvent être générées ;
- la palette de couleurs est créée à partir des données disponibles ;
- les codes colorimétriques sont cohérents ;
- les informations typographiques accessibles sont présentées correctement ;
- les marges de protection peuvent être configurées ;
- la planche est mise en page automatiquement ;
- les objets générés restent modifiables ;
- les calques sont correctement organisés ;
- la régénération est contrôlée ;
- la suppression ne détruit pas le contenu source ;
- les erreurs sont compréhensibles ;
- les templates fonctionnent ;
- les tests de compatibilité sont documentés ;
- l'installation est reproductible ;
- l'export final peut être réalisé selon la procédure documentée.

---

# 32. Évolutions futures

Une fois le produit stabilisé, plusieurs extensions fonctionnelles pourront être envisagées.

## 32.1 Brand Kit Analyzer

Un analyseur plus avancé pourrait aider à identifier les familles de couleurs, les typographies et les variantes d'un système de marque.

Les suggestions devront rester explicables et modifiables.

## 32.2 Smart Layout

Le moteur pourrait proposer plusieurs compositions selon les éléments disponibles, le format de planche et la densité du contenu.

## 32.3 Brand Consistency Checker

Une fonction de contrôle pourrait comparer les éléments présentés avec les règles configurées par le designer.

Elle pourrait signaler des incohérences de couleurs, de typographie ou de marges, à condition que ces règles aient été définies.

## 32.4 Multi-board Presentation

Le produit pourrait générer plusieurs plans de travail :

- présentation générale ;
- variantes du logo ;
- palette et typographie ;
- construction géométrique ;
- applications de marque.

## 32.5 Export de mini brand guidelines

Une évolution pourrait générer un document de recommandations de marque, à partir des informations réellement fournies et validées.

---

# 33. Positionnement final

Logo Presentation Studio doit être conçu comme un outil professionnel de présentation d'identité visuelle, intégré au workflow d'Adobe Illustrator.

Sa valeur ne repose pas uniquement sur la génération de formes géométriques, mais sur la capacité à organiser les éléments d'une marque dans une présentation claire et cohérente.

Le produit doit réunir :

- automatisation ;
- précision géométrique ;
- organisation éditoriale ;
- extraction de données ;
- présentation typographique ;
- gestion des couleurs ;
- personnalisation ;
- édition native ;
- reproductibilité.

L'objectif est de réduire les tâches répétitives tout en laissant au designer la maîtrise des décisions créatives.

## Vision finale

Le workflow attendu est le suivant :

```text
DOCUMENT ILLUSTRATOR
        |
        v
ANALYSE DES ÉLÉMENTS
        |
        v
SÉLECTION DES MODULES
        |
        v
CONFIGURATION DU TEMPLATE
        |
        v
GÉNÉRATION DE LA PLANCHE
        |
        v
AJUSTEMENTS DU DESIGNER
        |
        v
EXPORT DE LA PRÉSENTATION
```

Le résultat attendu est une planche d'identité visuelle construite à partir du document Illustrator, structurée selon un système de mise en page cohérent, et suffisamment flexible pour être adaptée à chaque projet.

**La priorité du développement est de construire un MVP fiable combinant Logo Showcase, Construction Grid, Color Palette, Typography System et Brand Board Generator.** Les fonctions avancées devront être ajoutées progressivement, après validation de la génération, de la précision géométrique et de la compatibilité avec Illustrator.
