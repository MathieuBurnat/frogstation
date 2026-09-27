# 🐸 Frogstation — site vitrine

Site vitrine de l'équipe Grenouille. Agréable, amusant, mais sérieux et
professionnel.

> **État : chantier en cours.** Le squelette technique est posé ; la charte
> graphique, les textes, l'intégration, la CI/CD, la recette QA et l'audit de
> sécurité sont en cours. Voir la section [Qui fait quoi](#qui-fait-quoi).

## Démarrer en local

Prérequis : la version de Node.js fixée dans [`.nvmrc`](.nvmrc) (`nvm use` ou
`mise install`) et npm. La CI lit ce même fichier — il n'y a donc qu'un seul
endroit où la version de Node est décidée.

```bash
npm ci          # installer exactement les versions du lockfile
npm run dev     # serveur de dev Vite, http://localhost:5173
```

`npm install` fonctionne aussi en local, mais `npm ci` est préférable : il
reproduit à l'identique ce que fait la CI.

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

## CI/CD

Un seul workflow : [`.github/workflows/ci.yml`](.github/workflows/ci.yml), quatre
jobs.

```
verify ─┬─► deploy-preview      (pull request)
 gate  ─┴─► deploy-production   (push sur main)
```

| Job                 | Déclencheur              | Ce qu'il fait |
| ------------------- | ------------------------ | ------------- |
| `verify`            | chaque PR + chaque push sur `main` | `npm ci` → `npm audit --audit-level=high` → `npm run typecheck` → `npm run lint` → `npm run build`, puis contrôle que `dist/index.html`, `dist/404.html` et `dist/_headers` existent, et publie `dist/` comme artefact (téléchargeable par la QA) |
| `gate`              | idem                     | vérifie que les secrets Cloudflare sont renseignés (présence seulement, aucune valeur affichée) |
| `deploy-preview`    | PR du dépôt lui-même     | déploie une **préversion** et poste son URL en commentaire de PR |
| `deploy-production` | push sur `main`          | déploie en **production** |

Un échec de `verify` fait échouer la PR et empêche tout déploiement.

Les jobs de déploiement ne rejouent pas le build eux-mêmes : c'est **wrangler**
qui l'exécute, via `[build] command = "npm run build"` dans `wrangler.toml`. Le
build de déploiement est donc défini **à un seul endroit** et se comporte à
l'identique depuis GitHub Actions, depuis un poste de dev
(`npm ci && npx wrangler deploy`) et depuis Cloudflare Workers Builds — dont la
commande de déploiement par défaut est `npx wrangler deploy`, sans étape de build.

La commande d'installation est **`npm ci`**, jamais `npm install` : `npm ci`
installe exactement les versions figées dans `package-lock.json` et échoue si le
lockfile et le `package.json` divergent.

### Pourquoi Workers et non Pages

Le déploiement passe par **Cloudflare Workers avec assets statiques**, configuré
dans [`wrangler.toml`](wrangler.toml) :

- Workers est la cible recommandée par Cloudflare pour les nouveaux projets ;
  Pages n'accueille plus de nouvelles fonctionnalités.
- Toute la configuration de déploiement est **versionnée dans le dépôt**, donc
  relisible en revue de code, au lieu d'être enfouie dans l'état d'un projet
  côté tableau de bord.
- `not_found_handling = "404-page"` sert `404.html` avec un **vrai statut HTTP
  404** pour tout chemin inconnu — ce qu'un routeur côté client ne sait pas faire.
- Les assets statiques Workers **lisent `dist/_headers`**, donc les en-têtes de
  sécurité de l'audit FRO-4 restent appliqués sans duplication dans le Worker.
  (C'était l'inconnue de l'arbitrage : c'est vérifié, voir ci-dessous.)
- Les préversions par PR utilisent les **Workers Previews nommées**
  (`wrangler preview --name pr-<numéro>`), qui donnent une URL stable par PR.

### Vérifier le déploiement en local, sans token

Le runtime Cloudflare (`workerd`) tourne en local : la 404 et les en-têtes se
vérifient **sans aucun secret**.

```bash
npm run build
npx wrangler dev --port 8788          # sert dist/ via le vrai runtime Workers

curl -s -o /dev/null -w '%{http_code}\n' http://127.0.0.1:8788/nope   # -> 404
curl -sD- -o /dev/null http://127.0.0.1:8788/ | grep -i content-security-policy
```

Résultat attendu, et effectivement constaté : statut **404** sur un chemin
inconnu avec le corps de `404.html`, et les cinq en-têtes de `public/_headers`
(CSP, HSTS, `nosniff`, `Referrer-Policy`, `Permissions-Policy`) présents sur les
réponses 200 **et** 404. Wrangler journalise `Parsed 1 valid header rule`.

`npx wrangler deploy --dry-run` valide `wrangler.toml` sans contacter Cloudflare
et sans credentials.

### Secrets requis

Ces valeurs ne doivent **jamais** apparaître en clair dans le dépôt, un
commentaire, un log ou un fichier de configuration. Elles vivent uniquement dans
**GitHub Secrets** (Settings → Secrets and variables → Actions → *New repository
secret*) :

| Secret                  | Usage                                             |
| ----------------------- | ------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`  | Token Cloudflare limité au strict nécessaire pour publier le site |
| `CLOUDFLARE_ACCOUNT_ID` | Identifiant du compte Cloudflare cible            |

Le token Cloudflare doit être restreint aux seules permissions de déploiement du
projet — **pas** un token global de compte. Côté Cloudflare (*My Profile → API
Tokens → Create Token → Custom token*), les permissions nécessaires et
suffisantes sont :

| Portée  | Permission              | Niveau |
| ------- | ----------------------- | ------ |
| Account | Workers Scripts         | Edit   |
| Account | Account Settings        | Read   |
| User    | User Details            | Read   |

`Account Settings: Read` sert seulement à résoudre le compte ; aucune permission
DNS, Zone, R2, KV ou D1 n'est requise pour ce site statique.

`CLOUDFLARE_ACCOUNT_ID` se lit dans l'URL du tableau de bord Cloudflare
(`dash.cloudflare.com/<account-id>`) ou via `npx wrangler whoami`.

#### Tant que les secrets sont absents

Le job `gate` teste leur présence et, s'ils manquent, **saute** les jobs de
déploiement au lieu de faire échouer la CI : les PR restent vertes sur
`verify`. Un `::notice::` le signale dans le résumé du run. Dès que les deux
secrets sont enregistrés, le déploiement s'active **sans aucune modification de
code** — le prochain run de PR publie une préversion, le prochain merge sur
`main` publie en production.

### ⚠️ Deuxième chemin de déploiement : Cloudflare Workers Builds

Une intégration **Cloudflare Workers Builds** (application GitHub
`cloudflare-workers-and-pages`) est déjà connectée à ce dépôt, sur un Worker
nommé `frogstation`. Elle publie un check `Workers Builds: frogstation` sur les
PR et déploie **indépendamment** de GitHub Actions.

Il y a donc aujourd'hui **deux chemins de déploiement**, ce qui n'est pas
souhaitable : Workers Builds ne passe pas par `verify`, donc il peut déployer du
code qui n'a pas franchi l'audit, le typecheck et le lint.

`[build] command = "npm run build"` dans `wrangler.toml` rend `wrangler deploy`
auto-suffisant, donc Workers Builds fonctionne aussi. Mais la décision « un seul
chemin » demande un accès au tableau de bord Cloudflare, hors périmètre du dépôt.
Deux options, à arbitrer :

1. **Garder GitHub Actions** (recommandé) — désactiver les builds automatiques du
   Worker `frogstation` côté Cloudflare (*Settings → Builds → Disconnect*). Les
   déploiements restent conditionnés aux checks de la PR.
2. **Garder Workers Builds** — retirer alors `deploy-preview` et
   `deploy-production` du workflow et se passer du garde-fou « pas de déploiement
   sans CI verte ».

#### Bonnes pratiques appliquées dans le workflow

- `permissions:` explicites et minimales au niveau du workflow **et** de chaque
  job ; aucun job n'a plus que ce qu'il lui faut, jamais de `write-all`.
- **Toutes** les actions sont épinglées à un SHA de commit complet, avec la
  version en commentaire. Dependabot met les SHA à jour.
- Aucun `pull_request_target` : les secrets ne sont jamais exposés à du code non
  fiable. `deploy-preview` est en plus explicitement restreint aux PR issues du
  dépôt lui-même (`head.repo.full_name == github.repository`).
- `persist-credentials: false` sur chaque `actions/checkout` : le token de la CI
  ne reste pas dans la configuration git du runner.
- Les valeurs dynamiques (URL de préversion, SHA) passent par des variables
  d'environnement, jamais par interpolation `${{ }}` directe dans un `run` —
  c'est le vecteur classique d'injection de script dans Actions.
- Version de Wrangler figée (`WRANGLER_VERSION`) et télémétrie Wrangler
  désactivée (`WRANGLER_SEND_METRICS: false`).

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

Activé côté GitHub (FRO-19) :

- [x] **Secret Scanning + Push Protection** — bloque le push d'un secret détecté.
- [x] **Dependabot alerts + security updates** — en complément des mises à jour
      hebdomadaires de `.github/dependabot.yml`.
- [x] **Protection de `main`** :

  | Règle | Valeur |
  | --- | --- |
  | Pull request obligatoire | oui, pas de push direct |
  | Reviews approuvées requises | 1 |
  | Reviews périmées rejetées à un nouveau push | oui |
  | Check de statut obligatoire | `verify` |
  | Branche à jour avant merge | oui |
  | Conversations résolues avant merge | oui |
  | Force-push / suppression de branche | interdits |
  | Application aux administrateurs | non — un admin garde une porte de sortie en cas d'incident |

  ⚠️ Le check obligatoire est le **nom du job** `verify` dans
  `.github/workflows/ci.yml`. Renommer ce job casse silencieusement la règle de
  protection : il faut alors mettre à jour le contexte requis côté GitHub.

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
wrangler.toml           cible de déploiement Cloudflare Workers
.github/workflows/      CI/CD : vérification, préversion, production
public/                 assets servis tels quels (favicon…)
  _headers              en-têtes de sécurité, appliqués par Cloudflare
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
