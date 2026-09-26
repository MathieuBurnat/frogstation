# Charte graphique « Mare & Nénuphars » — site vitrine Frogstation

Auteur : Mr. Gloop (graphiste / rédacteur) — livré sur **FRO-18**.
Source de vérité des valeurs : `src/styles/design-tokens.css`.
Ce document est le mode d'emploi ; en cas de divergence, le fichier CSS gagne.

> **Règle n°1 pour l'intégration :** aucune valeur brute dans un composant.
> Couleur, espacement, arrondi, ombre, durée, courbe : tout passe par une
> variable CSS. Si une variable vous manque, demandez-la — ne codez pas la
> valeur en dur.

---

## 1. Intention

L'univers est celui d'une **mare au petit matin** : eau claire et verte pour les
fonds, vert de grenouille pour l'accent principal, **fleur de nénuphar rose** et
**aile de libellule ambre** comme accents chauds qui tranchent. Les neutres sont
légèrement teintés de vert : aucun blanc clinique sur ce site.

Trois voix, dans cet ordre de fréquence :

1. **Vert mare** (`--color-accent`, `--color-accent-strong`) — la voix de base :
   liens, boutons primaires, titres de section.
2. **Rose nénuphar** (`--color-lily*`) — la seconde voix : focus, accents de
   texte, pastilles. Par touches, jamais en aplat de section.
3. **Ambre libellule** (`--color-dragonfly*`) — la ponctuation : badges, easter
   egg, petits détails d'illustration. Encore plus rare.

---

## 2. Palette et contrastes mesurés

Ratios calculés sur les valeurs livrées (formule de luminance relative WCAG 2.1).
Seuils : **4.5:1** texte courant (AA), **3:1** grand texte (≥ 24px, ou ≥ 18.66px
gras) et composants d'interface.

### Thème clair — fonds et texte

| Rôle | Valeur | Usage |
| --- | --- | --- |
| `--color-bg` | `#f7faf4` | fond de page |
| `--color-surface` | `#eaf2e4` | section alternée, fond de champ |
| `--color-surface-raised` | `#ffffff` | carte posée sur la page |
| `--color-text` | `#10231a` | texte courant |
| `--color-text-muted` | `#3f5a48` | texte secondaire, légendes |
| `--color-border` | `#688760` | bordure de composant (champ, carte) |
| `--color-accent` | `#15653f` | lien, bouton primaire |
| `--color-accent-strong` | `#0e4b2e` | survol de bouton, titres |
| `--color-accent-contrast` | `#ffffff` | texte posé sur un accent |
| `--color-accent-soft` | `#d7ebd9` | fond de pastille verte |
| `--color-focus` | `#c43b76` | anneau de focus clavier |

| Couple texte / fond | Ratio | Verdict |
| --- | --- | --- |
| `text` sur `bg` | **15.61:1** | AAA |
| `text` sur `surface` | **14.34:1** | AAA |
| `text` sur `surface-raised` | **16.44:1** | AAA |
| `text` sur `accent-soft` | **13.13:1** | AAA |
| `text-muted` sur `bg` | **7.20:1** | AAA |
| `text-muted` sur `surface` | **6.62:1** | AA |
| `text-muted` sur `surface-raised` | **7.59:1** | AAA |
| `accent` sur `bg` | **6.72:1** | AA |
| `accent` sur `surface` | **6.18:1** | AA |
| `accent` sur `surface-raised` | **7.08:1** | AAA |
| `accent` sur `accent-soft` | **5.66:1** | AA |
| `accent-strong` sur `bg` | **9.66:1** | AAA |
| `accent-strong` sur `surface` | **8.87:1** | AAA |
| `accent-strong` sur `surface-raised` | **10.17:1** | AAA |
| `accent-contrast` sur `accent` | **7.08:1** | AAA |
| `accent-contrast` sur `accent-strong` | **10.17:1** | AAA |

### Accent chaud — nénuphar

| Couple | Ratio | Verdict |
| --- | --- | --- |
| `lily` (`#b0175e`) sur `bg` | **6.37:1** | AA |
| `lily` sur `surface-raised` | **6.71:1** | AA |
| `lily` sur `lily-soft` (`#fbe7ee`) | **5.68:1** | AA |
| `lily-strong` (`#8e1550`) sur `bg` | **8.40:1** | AAA |
| `lily-strong` sur `surface-raised` | **8.85:1** | AAA |
| `lily-strong` sur `lily-soft` | **7.49:1** | AAA |
| `accent-contrast` sur `lily` | **6.71:1** | AA |
| `accent-contrast` sur `lily-strong` | **8.85:1** | AAA |

### Accent chaud — libellule (ambre)

`--color-dragonfly` (`#ffd166`) est **un fond, jamais une couleur de texte** sur
fond clair. Pour du texte ambre, utiliser `--color-dragonfly-ink` (`#8a5a00`).

| Couple | Ratio | Verdict |
| --- | --- | --- |
| `text` sur `dragonfly` | **11.40:1** | AAA |
| `dragonfly-ink` sur `bg` | **5.63:1** | AA |
| `dragonfly-ink` sur `surface-raised` | **5.93:1** | AA |

### Profondeurs de la mare — bandeaux sombres

Pour « Notre esprit » et le pied de page. **Un bloc sur fond sombre doit
redéfinir `--color-focus: var(--color-focus-on-dark)` dans son propre scope** :
le rose du focus ne contraste pas assez sur `pond-deep`.

| Couple | Ratio | Verdict |
| --- | --- | --- |
| `on-pond` (`#e8f3e6`) sur `pond-deep` (`#0b2019`) | **14.90:1** | AAA |
| `on-pond` sur `pond-mid` (`#123a2a`) | **11.05:1** | AAA |
| `on-pond-muted` (`#b8cfbe`) sur `pond-deep` | **10.29:1** | AAA |
| `on-pond-muted` sur `pond-mid` | **7.63:1** | AAA |
| `accent-on-pond` (`#8fe0b4`) sur `pond-deep` | **10.92:1** | AAA |
| `accent-on-pond` sur `pond-mid` | **8.10:1** | AAA |
| `lily-on-pond` (`#f6a8c6`) sur `pond-deep` | **9.18:1** | AAA |
| `lily-on-pond` sur `pond-mid` | **6.81:1** | AA |
| `focus-on-dark` (`#ffd166`) sur `pond-deep` | **11.79:1** | AAA |
| `focus-on-dark` sur `pond-mid` | **8.75:1** | AAA |

### États de formulaire

| Couple | Ratio | Verdict |
| --- | --- | --- |
| `success` (`#166b3e`) sur `bg` | **6.22:1** | AA |
| `success` sur `success-soft` (`#e4f4e9`) | **5.74:1** | AA |
| `success` sur `surface-raised` | **6.55:1** | AA |
| `error` (`#a32218`) sur `bg` | **7.12:1** | AAA |
| `error` sur `error-soft` (`#fdebe8`) | **6.51:1** | AA |
| `error` sur `surface-raised` | **7.50:1** | AAA |

**Jamais la couleur seule** pour signaler un état : succès et erreur portent
toujours un texte explicite (et une icône si besoin).

### Anneau de focus et bordures — seuil 3:1 (composants d'interface)

| Couple | Ratio | Verdict |
| --- | --- | --- |
| `focus` sur `bg` | **4.71:1** | ✅ (≥ 3:1) |
| `focus` sur `surface` | **4.33:1** | ✅ (≥ 3:1) |
| `focus` sur `surface-raised` | **4.96:1** | ✅ (≥ 3:1) |
| `border` sur `bg` | **3.82:1** | ✅ (≥ 3:1) |
| `border` sur `surface` | **3.51:1** | ✅ (≥ 3:1) |
| `border` sur `surface-raised` | **4.02:1** | ✅ (≥ 3:1) |

`global.css` pose déjà `:focus-visible { outline: 3px solid var(--color-focus) }`
avec un `outline-offset` de 2px. **Ne supprimez jamais cet outline**, même en le
remplaçant par une ombre : si vous personnalisez le focus d'un composant,
gardez un indicateur d'au moins 3:1 sur son fond.

### Le cas `--color-border-subtle`

`#cfe0c7` — **1.32:1 sur `bg`**. C'est volontaire : filets purement décoratifs
(séparateurs, quadrillage d'illustration). **Interdit** pour délimiter un champ
de saisie, un bouton ou tout autre contrôle : dans ce cas, `--color-border`.

### Dégradés

`--gradient-pond`, `--gradient-dawn`, `--gradient-lily` sont **décoratifs**. Un
texte posé dessus doit contraster avec le point le plus défavorable du dégradé :
sur `--gradient-pond`, utilisez `--color-on-pond` (pire cas 11.05:1) ; sur
`--gradient-dawn`, `--color-text` (pire cas 13.13:1).

---

## 3. Typographie

**Polices système uniquement — aucun Google Fonts, aucune requête tierce.**
Conséquence volontaire : la CSP de `public/_headers` reste inchangée
(`font-src 'self'`), zéro FOUT, zéro octet de police à télécharger. Rien à
arbitrer côté sécurité ni performance.

| Token | Rôle |
| --- | --- |
| `--font-display` | titres — pile arrondie (`ui-rounded`, `Segoe UI Variable Display`, `Trebuchet MS`…), le côté « bulle de croâ » |
| `--font-body` | texte courant — pile système neutre et lisible |
| `--font-mono` | code, valeurs techniques |

`global.css` applique déjà `--font-display` à `h1`, `h2`, `h3`.

Échelle **fluide** (`clamp()`, mobile-first, aucune media query à écrire) :

| Token | Min → max | Usage |
| --- | --- | --- |
| `--text-xs` | 0.78 → 0.83rem | mentions légales, crédits |
| `--text-sm` | 0.88 → 0.94rem | légendes, libellés, badges |
| `--text-base` | 1 → 1.09rem | texte courant |
| `--text-lg` | 1.2 → 1.4rem | chapô, accroche de carte |
| `--text-xl` | 1.5 → 2rem | titre de carte (`h3`) |
| `--text-2xl` | 1.9 → 2.9rem | titre de section (`h2`) |
| `--text-3xl` | 2.4 → 4.2rem | titre du hero (`h1`) |

Interlignes : `--leading-tight` (1.15) pour les grands titres, `--leading-snug`
(1.35) pour les titres de carte, `--leading-body` (1.6) pour les paragraphes.
Graisses : `--weight-regular` / `--weight-medium` (550) / `--weight-bold`.
Interlettrage : `--tracking-tight` sur les très grands titres,
`--tracking-wide` sur les petites capitales de badge.

Longueur de ligne : tout paragraphe est limité à `--measure-prose` (62ch).

**Un seul `h1` par page** (le hero ; sur la 404, le titre de la 404). Les
sections sont des `h2`, les cartes des `h3`. Pas de saut de niveau, jamais de
titre choisi pour sa taille — la taille est un token, pas un niveau.

---

## 4. Mise en page

- **Largeurs** : `--layout-max-width` (72rem) pour une section standard,
  `--layout-narrow` (44rem) pour une colonne de texte long,
  `--layout-wide` (84rem) pour un bandeau de hero.
- **Gouttière** : `--layout-gutter`, à gauche et à droite de chaque conteneur.
- **Rythme vertical** : `--layout-section-padding` (= `--space-9`, 6rem) en haut
  et en bas de chaque section ; `--space-10` (8rem) entre deux grands bandeaux
  qui se suivent.
- **Échelle d'espacement** de 4px : `--space-1` (0.25rem) → `--space-10` (8rem).
  Dans une carte : `--space-5` de padding, `--space-3` entre titre et texte.
- **Grilles** : `repeat(auto-fit, minmax(16rem, 1fr))` avec `gap: --space-5`.
  L'équipe tombe naturellement en 3 colonnes (desktop) / 2 / 1. Ne figez pas un
  nombre de colonnes.
- **Arrondis** : `--radius-sm` (champs, badges), `--radius-md` (boutons),
  `--radius-lg` (cartes, bandeaux), `--radius-pill` (pastilles),
  `--radius-blob` (médaillons d'avatar — contour organique de nénuphar).
  Rien n'est pointu au bord d'une mare.
- **Ombres** : `--shadow-sm` (carte au repos), `--shadow-md` (carte survolée),
  `--shadow-lg` (élément flottant), `--shadow-hop` (carte en plein saut,
  teintée vert), `--shadow-inset-water` (liseré d'eau claire en haut d'un
  bandeau sombre). Toutes teintées vert-mare, jamais noir pur.
- **Cible tactile** : 44 × 44 px minimum pour tout élément cliquable.
- **Zoom** : la mise en page doit tenir à 200 % de zoom sans défilement
  horizontal (conséquence de l'échelle fluide + `auto-fit`).

---

## 5. Inventaire des SVG

Tous dessinés à la main pour ce site. **Zéro dépendance ajoutée**, pas de
librairie d'icônes. `viewBox` propre, aucune métadonnée d'éditeur, aucune
`width`/`height` figée sur la racine `<svg>` : c'est le CSS qui dimensionne.

### Porteurs de sens — `<title>` + `role="img"`, jamais `aria-hidden`

| Fichier | viewBox | Texte alternatif (déjà dans le `<title>`) |
| --- | --- | --- |
| `src/assets/avatars/frog-master.svg` | 0 0 120 120 | Avatar de Frog Master, une grenouille coiffée d'une petite couronne |
| `src/assets/avatars/mr-gloop.svg` | 0 0 120 120 | Avatar de Mr. Gloop, une grenouille en béret avec un crayon sur l'oreille |
| `src/assets/avatars/ribbit-downey.svg` | 0 0 120 120 | Avatar de Ribbit Downey, une grenouille au casque audio entourée de chevrons de code |
| `src/assets/avatars/nino-croaks.svg` | 0 0 120 120 | Avatar de Nino Croaks, une grenouille en casquette ornée d'un rouage |
| `src/assets/avatars/bella-lilypad.svg` | 0 0 120 120 | Avatar de Bella Lilypad, une grenouille fleurie de nénuphar tenant une loupe |
| `src/assets/avatars/serious-robert.svg` | 0 0 120 120 | Avatar de Serious Robert, une grenouille à lunettes noires derrière un bouclier |
| `src/assets/illustrations/frog-lost-in-reeds.svg` | 0 0 480 320 | Une petite grenouille assise sur un nénuphar au milieu de grands roseaux, en train de scruter l'horizon |
| `public/favicon.svg` | 0 0 32 32 | `aria-label="Frogstation"` (favicon, remplacé comme demandé) |

Le `<title>` fait foi : si vous injectez ces SVG en inline, **ne le supprimez
pas** et n'ajoutez pas d'`alt` concurrent. Si vous les chargez via `<img src>`,
recopiez le texte du `<title>` dans l'`alt`. Ces fichiers portent leurs couleurs
en dur (valeurs de la palette ci-dessus) parce qu'ils doivent rester lisibles
même chargés en `<img>` ; si la palette bouge, ces huit fichiers se mettent à
jour à la main — c'est assumé et documenté ici.

### Décoratifs — `aria-hidden="true"` obligatoire

Les six icônes de « Ce que nous faisons », viewBox `0 0 32 32`, tracé au
`stroke` en **`currentColor`** : elles prennent la couleur du texte parent, donc
aucune couleur à passer. Épaisseur de trait 1.75, bouts arrondis.

| Fichier | Carte |
| --- | --- |
| `src/assets/icons/icon-interface.svg` | Sites et interfaces — fenêtre en feuille de nénuphar |
| `src/assets/icons/icon-identite.svg` | Design et identité — palette de nénuphar et pinceau |
| `src/assets/icons/icon-infra.svg` | Déploiement et infrastructure — nuage et branche de livraison |
| `src/assets/icons/icon-qualite.svg` | Qualité et accessibilité — loupe posée sur une coche |
| `src/assets/icons/icon-securite.svg` | Sécurité — bouclier et feuille de nénuphar |
| `src/assets/icons/icon-conseil.svg` | Conseil et cadrage — bulle de croâ et trajectoire de saut |

Le sens est porté par le titre de la carte à côté : **l'icône ne doit jamais
être la seule information**, d'où l'`aria-hidden`.

Taille conseillée : `width: var(--space-6)` (2rem) dans une carte. Motif
décoratif de mare dans le hero : voir `--gradient-dawn`, aucun fichier dédié —
c'est un dégradé, pas une image.

---

## 6. Micro-interactions

Trois, pas plus. **À implémenter par l'intégration, pas par le graphiste.**
Contraintes communes, non négociables :

- jamais au détriment de la lisibilité ni de l'accessibilité ;
- **jamais déclenchées automatiquement au chargement** ;
- toute durée vient de `--motion-fast` / `--motion-base` / `--motion-slow`,
  que `global.css` met à `0.01ms` sous `prefers-reduced-motion` — donc respecter
  les tokens suffit à être conforme ;
- **n'ajoutez aucun quatrième token de durée** : `global.css` ne neutralise que
  ces trois-là, une durée de plus échapperait à `prefers-reduced-motion`.

### 6.1 — Le saut de la carte (« hop »)

- **Élément** : carte de membre de l'équipe, carte de « Ce que nous faisons ».
- **Déclencheur** : `:hover` **et** `:focus-visible` (le clavier doit voir la
  même chose que la souris).
- **Effet** : `transform: translateY(var(--hop-rise))` (−0.375rem ; −0.625rem
  via `--hop-rise-lg` pour une carte mise en avant), ombre qui passe de
  `--shadow-sm` à `--shadow-hop`. Durée `--motion-base`, courbe `--ease-hop`
  (léger rebond en fin de course, comme une grenouille qui atterrit).
- **Transition sur `transform` et `box-shadow` uniquement** — pas de `all`.

### 6.2 — L'œil qui suit le curseur du nénuphar

- **Élément** : médaillon d'avatar de la carte survolée, uniquement lui.
- **Déclencheur** : `:hover` / `:focus-visible` sur la carte.
- **Effet** : le médaillon passe de `--radius-blob` à une forme légèrement
  différente (rotation de 3° du blob) sur `--motion-slow` / `--ease-splash` :
  le contour ondule comme une feuille sur l'eau. Aucun contenu ne bouge, aucun
  texte ne se déplace.

### 6.3 — Le « croâ » en easter egg

- **Élément** : le favicon-grenouille du logo dans l'en-tête.
- **Déclencheur** : **clic explicite de l'utilisateur** sur le logo (un
  `<button>` accessible, libellé « Faire croâsser la grenouille »). Jamais au
  survol, jamais au chargement, jamais au défilement.
- **Effet visuel** : une bulle de croâ (`--gradient-lily`) qui apparaît et
  s'efface sur `--motion-slow` / `--ease-out`.
- **Son** : **optionnel et silencieux par défaut.** Si l'intégration en ajoute
  un, il ne part que sur ce clic, jamais en `autoplay`, volume bas, et
  l'utilisateur peut recliquer pour le couper. Aucun son ailleurs sur le site.
  Sous `prefers-reduced-motion`, la bulle apparaît sans transition — le clic
  reste fonctionnel.

---

## 7. Ce que l'intégration ne doit pas faire

- Renommer ou supprimer un token de `design-tokens.css` (cela casse le contrat
  arbitré par le Frogmaster — demandez d'abord sur FRO-2). **Aucun token n'a été
  renommé ni supprimé dans cette livraison** : uniquement des valeurs remplacées
  et des tokens ajoutés.
- Écrire une couleur, un espacement, un arrondi, une ombre, une durée en dur.
- Utiliser `--color-border-subtle` pour un contrôle.
- Poser du texte sur `--color-dragonfly` autrement qu'avec `--color-text`.
- Oublier `--color-focus-on-dark` dans un bandeau sombre.
- Supprimer un `outline` de focus.
- Ajouter une dépendance (police, librairie d'icônes, librairie d'animation).
