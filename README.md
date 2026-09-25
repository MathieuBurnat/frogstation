# 🐸 Frogstation — site vitrine

Site vitrine de l'équipe Grenouille. Agréable, amusant, mais sérieux et
professionnel.

> **État : chantier en cours.** Le squelette technique est posé ; la charte
> graphique, les textes, l'intégration, la CI/CD, la recette QA et l'audit de
> sécurité sont en cours. Voir la section [Qui fait quoi](#qui-fait-quoi).

## Démarrer en local

Prérequis : Node.js 20+ et npm.

```bash
npm install     # installer les dépendances
npm run dev     # serveur de dev Vite, http://localhost:5173
```

## Vérifier et builder

```bash
npm run lint        # oxlint
npm run typecheck   # tsc -b (vérification de types, sans émission)
npm audit           # audit de sécurité des dépendances
npm run build       # build de production dans dist/
npm run preview     # servir dist/ localement
```

Le build produit deux pages : `dist/index.html` (le site) et `dist/404.html`
(la page 404 personnalisée).

## Déploiement

Cible : **Cloudflare** via `wrangler` / `cloudflare/wrangler-action`, piloté par
GitHub Actions.

- chaque pull request : install, lint, typecheck, `npm audit`, build, puis
  déploiement d'une **préversion** ;
- merge sur `main` : déploiement en **production**.

La commande d'installation du build doit être **`npm ci`**, jamais
`npm install` : `npm ci` installe exactement les versions figées dans
`package-lock.json` et échoue si le lockfile et le `package.json` divergent.

Les en-têtes de sécurité sont versionnés dans **`public/_headers`** (Vite le
copie tel quel dans `dist/`). Cloudflare **Pages** le lit automatiquement ; si
le déploiement passe par **Workers + assets statiques**, ce fichier n'est pas
interprété et les mêmes en-têtes doivent être reproduits dans la configuration
du Worker.

### Secrets requis

Ces valeurs ne doivent **jamais** apparaître en clair dans le dépôt, un
commentaire, un log ou un fichier de configuration. Elles vivent uniquement dans
**GitHub Secrets** (Settings → Secrets and variables → Actions) :

| Secret                 | Usage                                             |
| ---------------------- | ------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN` | Token Cloudflare limité au strict nécessaire pour publier le site |
| `CLOUDFLARE_ACCOUNT_ID` | Identifiant du compte Cloudflare cible           |

Le token Cloudflare doit être restreint aux seules permissions de déploiement du
projet — pas un token global de compte.

## Sécurité

Rapport d'audit complet : [`documents/audit/audit-securite-2026-09-25.md`](documents/audit/audit-securite-2026-09-25.md)
(tâche FRO-4). Aucune vulnérabilité exploitable ; les mesures ci-dessous sont du
durcissement préventif.

En place dans le dépôt :

| Mesure | Où |
| --- | --- |
| Lockfile versionné, builds reproductibles | `package-lock.json` + `npm ci` |
| CSP, `frame-ancestors 'none'`, HSTS, `nosniff`, `Referrer-Policy`, `Permissions-Policy` | `public/_headers` |
| `.env*`, clés, `.claude/` exclus de git | `.gitignore` |
| Garde-fous sur chaque PR : `npm ci` → `npm audit --audit-level=high` → typecheck → lint → build | `.github/workflows/ci.yml` |
| Mises à jour hebdomadaires npm + GitHub Actions | `.github/dependabot.yml` |

À activer côté GitHub (droits d'administration du dépôt requis) :

- [ ] **Secret Scanning + Push Protection** — *Settings → Code security* ;
      gratuit sur dépôt public, bloque le push d'un secret détecté.
- [ ] **Protection de `main`** — PR obligatoire, check `CI` obligatoire, pas de
      force-push. À faire dès le premier commit poussé.

Règles à respecter en écrivant le site :

- **Section contact** : privilégier un lien `mailto:`. Si un vrai formulaire est
  nécessaire, passer par un prestataire qui valide côté serveur et ajouter une
  protection anti-bot (Turnstile ou, a minima, un honeypot). Une validation
  côté client est une aide à la saisie, jamais un contrôle de sécurité.
- **Jamais de `dangerouslySetInnerHTML`** : l'échappement automatique de JSX est
  la bonne façon de faire, y compris pour réafficher une saisie.
- Tout `target="_blank"` porte `rel="noopener noreferrer"`.
- Les SVG sont **importés comme fichiers ou composants**, jamais injectés en HTML
  brut : un SVG peut contenir un `<script>`.
- Les textes vivent dans `src/content/` en chaînes TS, pas en fragments HTML.
- Ressources tierces (polices, images, analytics) : hébergées dans `public/` de
  préférence. Sinon, attribut `integrity` (SRI) **et** élargissement explicite de
  la directive CSP concernée dans `public/_headers` — jamais de `default-src`
  relâché.
- Toute variable `VITE_*` est **inlinée en clair dans le bundle public** : aucune
  clé secrète ne doit y figurer.

Un contre-audit est prévu une fois le site intégré (FRO-5).

## Décisions techniques

Arbitrées par le Frogmaster, à respecter par toute l'équipe.

### Style : CSS Modules (et non Tailwind)

- La charte graphique est livrée comme un jeu de **variables CSS**
  (`src/styles/design-tokens.css`). Les CSS Modules les consomment directement,
  sans couche de traduction ni configuration à maintenir en double.
- Vite gère les CSS Modules nativement : **zéro dépendance supplémentaire**, ce
  qui sert l'exigence « site léger, aucune dépendance superflue ».
- Le CSS scopé par composant évite les collisions de classes sans utilitaires
  inline, ce qui garde le markup lisible pour les revues d'accessibilité.
- Cela facilite une Content-Security-Policy stricte : pas de génération de style
  à l'exécution.

**Règle :** aucune valeur brute (couleur, espacement, rayon, ombre, durée) dans
un composant. Tout passe par un token de `src/styles/design-tokens.css`.

### Routing : page unique avec ancres, sans routeur

Le contenu attendu est un récit linéaire (accueil → esprit → équipe →
savoir-faire → contact) : une page unique avec navigation par ancres est plus
pertinente qu'un routeur, et supprime une dépendance.

La page 404 est une **seconde entrée HTML** (`404.html`) buildée par Vite, pas
une route cliente. Cloudflare la sert avec un vrai statut HTTP 404 pour les
chemins inconnus — ce qu'un routeur côté client ne peut pas faire.

### Accessibilité et mouvement

- Contrastes AA, navigation clavier, focus toujours visible, textes alternatifs.
- Toute animation utilise les variables `--motion-*`. `global.css` les neutralise
  sous `prefers-reduced-motion: reduce`, donc respecter les tokens suffit à être
  conforme. **N'écrivez jamais une durée d'animation en dur.**

## Structure

```
index.html              page principale
404.html                page 404 (seconde entrée de build)
public/                 assets servis tels quels (favicon…)
src/
  main.tsx              point d'entrée de la page principale
  not-found.tsx         point d'entrée de la page 404
  App.tsx               ossature des 5 sections
  pages/NotFound.tsx    contenu de la 404
  content/              tous les textes du site (source unique)
  styles/
    design-tokens.css   charte graphique : variables CSS
    global.css          reset + base + prefers-reduced-motion
  components/           un dossier par composant, avec son *.module.css
```

## Placeholders

⚠️ Aucune information réelle n'est inventée (email, adresse, nom de client). Les
valeurs ci-dessous sont des placeholders à remplacer avant une mise en
production publique.

| Placeholder        | À remplacer par                                  |
| ------------------ | ------------------------------------------------ |
| `[EMAIL_CONTACT]`  | Adresse e-mail de contact de l'équipe            |
| `[URL_SITE]`       | URL publique canonique du site (liens OG/canonical) |
| `[META_DESCRIPTION]` | Meta description SEO                           |
| `[OG_TITLE]`       | Titre Open Graph                                 |
| `[OG_DESCRIPTION]` | Description Open Graph                           |
| `[NOM_MEMBRE_1]` … | Noms des membres de l'équipe, si des noms réels sont souhaités |

Les **noms de grenouille**, rôles et descriptions affichés sur la page
« L'équipe » sont des personnages assumés, pas des identités réelles : ils ne
sont pas des placeholders.

## Qui fait quoi

| Rôle                  | Périmètre                                                    |
| --------------------- | ------------------------------------------------------------ |
| 👑 Frogmaster          | Cadrage, arbitrages, cohérence globale, rapport final        |
| 🎨 Graphiste + Rédacteur | `design-tokens.css`, SVG/illustrations, micro-interactions, tous les textes (`src/content/`) |
| 💻 Développement front | Intégration des 5 sections, de la 404 et du formulaire, en suivant strictement la charte |
| 🚀 DevOps              | CI/CD GitHub Actions, déploiement Cloudflare, protection de `main`, Dependabot |
| 🔍 QA                  | Rendu, responsive, liens, performance, accessibilité, Lighthouse |
| 🛡️ Cybersécurité       | Revue de code, secrets, dépendances, en-têtes HTTP, CI/CD — **droit de veto sur la mise en production** |

## Définition de « terminé »

- [ ] Build sans erreur ni warning bloquant
- [ ] Lighthouse ≥ 90 en performance, accessibilité, bonnes pratiques et SEO
- [ ] Pipeline CI/CD fonctionnel de bout en bout (PR → préversion, merge → prod)
- [ ] Audit de sécurité validé : aucune vulnérabilité critique ou haute,
      en-têtes de sécurité actifs
- [ ] Le site est drôle, beau, cohérent… et donne envie de rejoindre la mare
