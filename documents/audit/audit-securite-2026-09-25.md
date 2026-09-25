# Audit de sécurité — Frogstation

| | |
|---|---|
| **Périmètre** | Dépôt `MathieuBurnat/frogstation` (site vitrine statique React/Vite) |
| **Date** | 25 septembre 2026 |
| **Auditeur** | Ribbit Downey — Seignor Developer |
| **Tâche** | FRO-4 « Security Overview » |
| **État du code audité** | 17 fichiers, 457 lignes, **aucun commit git** — arbre de travail uniquement |
| **Verdict global** | 🟡 **Aucune vulnérabilité exploitable aujourd'hui.** 6 écarts de durcissement à corriger **avant la mise en ligne**. |

> ⚠️ **Instantané daté.** Le dépôt est en cours d'écriture en direct par le Frogmaster (FRO-2). Un fichier (`src/styles/global.css`) est apparu pendant l'audit. Les conclusions valent pour l'arbre de travail du 25/09/2026 et doivent être revérifiées avant le déploiement.

---

## 1. Synthèse pour décideur

Le site est aujourd'hui un **squelette statique sans backend, sans base de données, sans authentification et sans entrée utilisateur**. La surface d'attaque est donc structurellement très faible, et l'audit n'a trouvé **aucune faille exploitable**.

Les constats portent tous sur de la **prévention** : le projet s'apprête à être déployé et à recevoir du contenu (formulaire de contact, images, polices, textes). Les six écarts ci-dessous sont peu coûteux à corriger maintenant, et nettement plus coûteux une fois le site en production.

| Sévérité | Nombre | Constats |
|---|---|---|
| 🔴 Critique | 0 | — |
| 🟠 Élevé | 1 | S-01 Absence de lockfile |
| 🟡 Moyen | 4 | S-02 en-têtes HTTP, S-03 `.gitignore`, S-04 config agent versionnée, S-05 absence de CI sécurité |
| 🔵 Faible | 1 | S-06 placeholders SEO |
| ✅ Points forts | 7 | voir §4 |

**Recommandation :** traiter S-01, S-02 et S-03 avant le premier déploiement public. Ce sont trois modifications de quelques minutes chacune.

---

## 2. Méthodologie

Analyse statique manuelle et outillée, sans exécution du site (le projet n'est pas encore déployé) :

1. **Revue de code intégrale** — les 17 fichiers du dépôt ont été lus (aucun échantillonnage).
2. **Audit de dépendances réel** — l'arbre de dépendances a été résolu dans un répertoire temporaire (`npm install --package-lock-only --ignore-scripts`) puis analysé avec `npm audit`. **Le dépôt n'a pas été modifié par cette opération.**
3. **Recherche de secrets** — motifs `api_key`, `secret`, `token`, `password`, `bearer`, clés privées PEM, clés AWS (`AKIA…`) sur l'ensemble de l'arbre.
4. **Recherche de motifs dangereux** — `dangerouslySetInnerHTML`, `innerHTML`, `eval(`, `new Function`, `document.write`, `target="_blank"`, URLs en `http://`.
5. **Revue de configuration** — `vite.config.ts`, `tsconfig.*`, `.oxlintrc.json`, `.gitignore`, en-têtes HTTP, configuration de déploiement, CI.

**Hors périmètre :** test d'intrusion dynamique (DAST), audit du compte Cloudflare et de ses secrets, audit des règles de protection de branche GitHub (impossible : le dépôt n'a aucun commit et `origin/main` est absent), revue du futur contenu rédactionnel et graphique.

---

## 3. Constats détaillés

### 🟠 S-01 — Aucun lockfile versionné : builds non reproductibles et chaîne d'approvisionnement non figée

**Fichier :** `package.json` · **Sévérité : Élevée**

Le dépôt ne contient **ni `package-lock.json`, ni `pnpm-lock.yaml`, ni `yarn.lock`**. Toutes les dépendances sont déclarées avec des plages flottantes (`^` / `~`).

La dérive est **déjà mesurable**. Versions déclarées vs. versions réellement installées lors de l'audit :

| Paquet | Déclaré | Résolu le 25/09/2026 |
|---|---|---|
| `react` / `react-dom` | `^19.2.8` | **19.3.0** |
| `vite` | `^8.3.0` | **8.3.1** |
| `typescript` | `~6.0.2` | **6.0.3** |
| `oxlint` | `^1.81.0` | **1.85.0** |
| `@types/node` | `^24.13.3` | **24.13.6** |

**Impact.** Deux développeurs, ou deux builds Cloudflare successifs, n'installent pas le même code. Surtout, si un mainteneur amont est compromis et publie une version corrective malveillante (scénario classique : `event-stream`, `ua-parser-js`, `xz`), **elle est intégrée silencieusement au prochain build sans aucune action de l'équipe**. Un site vitrine compromis de cette manière sert du JavaScript arbitraire à tous les visiteurs.

**Correction.**
```bash
npm install                      # génère package-lock.json
git add package-lock.json        # et le versionner
```
Puis utiliser `npm ci` (et non `npm install`) dans la commande de build Cloudflare, afin que le build échoue si le lockfile et le `package.json` divergent.

---

### 🟡 S-02 — Aucun en-tête HTTP de sécurité (pas de CSP, clickjacking possible)

**Fichiers :** absence de `public/_headers` · **Sévérité : Moyenne**

Aucune politique de sécurité n'est définie, ni par en-tête HTTP, ni par balise `<meta>` dans `index.html` / `404.html`. En l'état, le site déployé servira les réponses par défaut de Cloudflare Pages.

**Impact.** Absence de `Content-Security-Policy` (aucune limite sur l'origine des scripts en cas d'injection ultérieure), absence de `X-Frame-Options` / `frame-ancestors` (**le site peut être encadré dans une iframe tierce — clickjacking, détournement d'image de marque**), absence de `X-Content-Type-Options` (sniffing MIME), absence de `Referrer-Policy` (fuite d'URL vers les tiers) et de `Strict-Transport-Security`.

**Correction.** Créer `public/_headers` — Cloudflare Pages le lit automatiquement et le fichier est copié tel quel dans `dist/` :

```
/*
  Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Permissions-Policy: geolocation=(), microphone=(), camera=(), interest-cohort=()
```

> `style-src 'unsafe-inline'` est nécessaire tant que des styles inline React sont possibles ; à retirer si l'équipe s'en tient strictement aux CSS Modules. Si un formulaire de contact tiers ou des polices externes sont ajoutés, il faudra élargir `connect-src` / `form-action` / `font-src` **explicitement** plutôt que de relâcher `default-src`.

---

### 🟡 S-03 — `.gitignore` ne couvre pas les fichiers `.env`

**Fichier :** `.gitignore` · **Sévérité : Moyenne**

Le `.gitignore` ignore `*.local` (donc `.env.local`) mais **pas `.env`, `.env.production`, `.env.development`**.

**Impact.** Aucun secret n'est présent dans le dépôt à ce jour — la recherche de secrets est revenue **vide**. Mais Vite utilise nativement les fichiers `.env`, et le déploiement Cloudflare à venir en introduira probablement un. Le premier `git add .` publierait alors les identifiants sur un dépôt **public**. C'est le mode de fuite de secrets le plus fréquent sur ce type de projet.

**Correction.** Ajouter à `.gitignore` :
```gitignore
# Variables d'environnement
.env
.env.*
!.env.example
```

> **Rappel à l'équipe :** dans une application front-end, toute variable préfixée `VITE_` est **inlinée en clair dans le bundle JavaScript public**. Aucune clé d'API secrète ne doit jamais y figurer, même correctement gitignorée.

---

### 🟡 S-04 — Configuration d'agent locale non ignorée par git

**Fichier :** `.claude/settings.local.json` · **Sévérité : Moyenne**

Ce fichier est présent dans l'arbre de travail et **n'est pas couvert par `.gitignore`** : il partira au premier commit global.

Il contient deux éléments à ne pas publier :
1. des **chemins absolus de l'infrastructure interne** (`/home/captain/.paperclip/instances/default/…`), qui exposent l'arborescence de la machine de build ;
2. une liste d'autorisations permissive, dont `Bash(curl:*)` et **`Bash(env:*)`** — cette dernière autorise le dump des variables d'environnement, donc des secrets injectés.

**Impact.** Sur un dépôt public, cela livre une cartographie de l'environnement d'exécution interne. Plus grave : toute personne clonant le dépôt hérite d'une configuration d'agent pré-approuvée et permissive, qu'elle n'a pas relue.

**Correction.** Ajouter à `.gitignore` :
```gitignore
.claude/settings.local.json
```
(Le fichier partagé `.claude/settings.json`, lui, peut légitimement être versionné.)

---

### 🟡 S-05 — Aucune CI, donc aucune détection automatique de régression de sécurité

**Répertoire :** `.github/` absent · **Sévérité : Moyenne**

Le projet n'a aucun workflow d'intégration continue. Rien ne vérifie automatiquement les dépendances vulnérables, les secrets committés, ni même que le build passe.

**Impact.** L'état sain constaté aujourd'hui (§4) n'est garanti par aucun mécanisme. La prochaine dépendance vulnérable ou le prochain secret committé passeront inaperçus.

**Correction.** Activer, par ordre de rentabilité :
1. **GitHub Secret Scanning + Push Protection** — gratuit sur dépôt public, activable en deux clics, bloque le push d'un secret détecté. C'est la mesure au meilleur rapport effort/bénéfice.
2. **Dependabot** (`.github/dependabot.yml`, écosystème `npm`, fréquence hebdomadaire) — alerte et propose les correctifs de sécurité amont.
3. Un workflow minimal sur PR : `npm ci` → `npm audit --audit-level=high` → `npm run typecheck` → `npm run lint` → `npm run build`.
4. Une fois le premier commit poussé : **protéger la branche `main`** (PR obligatoire, checks obligatoires, pas de force-push).

---

### 🔵 S-06 — Placeholders SEO non substitués dans `index.html`

**Fichier :** `index.html` (l. 9–19) · **Sévérité : Faible**

Les balises `description`, `canonical`, `og:title`, `og:description`, `og:url` et `og:image` contiennent encore les marqueurs `[META_DESCRIPTION]`, `[URL_SITE]`, `[OG_TITLE]`, `[OG_DESCRIPTION]`.

**Impact.** Pas de risque de sécurité direct. Mais un `<link rel="canonical" href="[URL_SITE]/">` publié produit une URL invalide, et les aperçus de partage sur les réseaux sociaux seront cassés — un défaut de crédibilité pour un site vitrine.

**Correction.** Substituer ces valeurs avant la mise en ligne (livraison attendue du Rédacteur, FRO-3). À inscrire dans la checklist de déploiement.

---

## 4. Points forts confirmés

Ces éléments ont été **vérifiés**, pas supposés. Ils constituent une base saine à préserver.

| # | Constat | Preuve |
|---|---|---|
| 1 | **Aucune vulnérabilité connue dans les dépendances** | `npm audit` sur l'arbre complet : **0 critique, 0 élevée, 0 moyenne, 0 faible** sur **71 paquets** |
| 2 | **Chaîne d'approvisionnement propre** | 71/71 paquets proviennent de `registry.npmjs.org`, **tous avec un hash d'intégrité** (`integrity`), aucun dépôt tiers ni tarball distant |
| 3 | **Scripts d'installation quasi absents** | Un seul paquet déclare un script d'installation : `fsevents@2.3.3` (surveillance de fichiers macOS, légitime et largement audité) |
| 4 | **Aucun secret dans le dépôt** | Recherche `api_key` / `secret` / `token` / `password` / `bearer` / clés PEM / `AKIA…` : **aucun résultat réel** (seules des correspondances sur le mot « tokens » des design tokens CSS) |
| 5 | **Aucun motif d'injection** | **Zéro** occurrence de `dangerouslySetInnerHTML`, `innerHTML`, `eval(`, `new Function`, `document.write`. L'échappement automatique de React 19 est donc intact sur tout le rendu |
| 6 | **Aucune ressource externe, aucun contenu mixte** | Aucune URL `http://`, aucun script ou police tiers : pas de risque de contenu mixte ni de dépendance CDN à intégrité non vérifiée |
| 7 | **Architecture intrinsèquement peu exposée** | Site 100 % statique : pas de serveur applicatif, pas de base de données, pas d'authentification, pas de session, pas d'entrée utilisateur. Ni injection SQL, ni SSRF, ni contrôle d'accès cassé n'est applicable. Le `404.html` est servi avec un vrai statut 404 et porte `noindex` |

---

## 5. Règles à respecter pour la suite du développement

Le squelette actuel est sûr **parce qu'il est vide**. Ces règles visent à le garder sûr quand le contenu arrivera (FRO-5).

**Section contact (`src/App.tsx`, `#contact`) — le point de vigilance n°1.** C'est la seule entrée utilisateur prévue, et la seule source réaliste de XSS ou de spam.
- Privilégier un simple lien `mailto:` : zéro surface d'attaque.
- Si un vrai formulaire est nécessaire, s'appuyer sur un prestataire qui gère la validation et l'anti-spam côté serveur (Cloudflare Web Forms, Formspree…) plutôt que d'écrire un endpoint maison. Ajouter une protection anti-bot (Cloudflare Turnstile ou, a minima, un champ honeypot).
- **Ne jamais réinjecter une valeur saisie dans le DOM via `dangerouslySetInnerHTML`.** Le JSX standard échappe automatiquement : c'est suffisant, et c'est la bonne façon de faire.
- Une validation purement côté client est une aide à la saisie, **jamais un contrôle de sécurité**.

**Liens externes.** Tout `target="_blank"` doit porter `rel="noopener noreferrer"` (protection contre le `window.opener` hijacking et la fuite de `Referer`).

**Ressources tierces (polices, images, analytics).** Les héberger localement dans `public/` de préférence. Si un CDN est indispensable : ajouter l'attribut `integrity` (SRI) **et** élargir explicitement la CSP de S-02. Pour l'analytics, préférer une solution sans cookie (Cloudflare Web Analytics) — moins de charge RGPD, pas de script tiers exécutant du code arbitraire.

**Contenu fourni par le Rédacteur et le Graphiste.** Le texte doit transiter par `src/content/` en tant que chaînes JS/TS (échappées par React), **jamais** en tant que fragments HTML bruts. Les SVG livrés par le Graphiste doivent être importés comme fichiers ou composants, et non injectés en HTML : un SVG peut contenir un `<script>`.

---

## 6. Plan d'action recommandé

| Priorité | Action | Constat | Effort |
|---|---|---|---|
| **1 — avant le 1er déploiement** | Générer et versionner `package-lock.json` ; utiliser `npm ci` au build | S-01 | 5 min |
| **2 — avant le 1er déploiement** | Créer `public/_headers` (CSP + en-têtes de sécurité) | S-02 | 15 min |
| **3 — avant le 1er commit** | Compléter `.gitignore` (`.env*`, `.claude/settings.local.json`) | S-03, S-04 | 2 min |
| **4 — semaine 1** | Activer Secret Scanning + Push Protection + Dependabot ; protéger `main` | S-05 | 15 min |
| **5 — semaine 1** | Workflow CI : `npm ci` → `npm audit` → typecheck → lint → build | S-05 | 30 min |
| **6 — avant la mise en ligne** | Substituer les placeholders SEO | S-06 | 5 min |
| **7 — à l'implémentation** | Appliquer les règles du §5 sur la section contact et les ressources tierces | §5 | continu |

---

## 7. Conclusion

**Frogstation ne présente aujourd'hui aucune vulnérabilité exploitable.** Zéro CVE sur 71 dépendances, aucun secret exposé, aucun motif d'injection, et une architecture statique qui élimine par construction la majorité des catégories de l'OWASP Top 10.

Les six constats relèvent du durcissement avant mise en production. Deux méritent une attention particulière : **l'absence de lockfile (S-01)**, qui laisse la porte ouverte à une compromission de la chaîne d'approvisionnement sans aucune action de l'équipe, et **l'absence d'en-têtes de sécurité (S-02)**, qui expose le site au clickjacking dès sa publication. Le total du plan d'action représente environ **une heure de travail**.

Un contre-audit est recommandé une fois FRO-5 implémentée, la section contact étant le seul composant qui introduira une véritable surface d'attaque.

---

*Audit réalisé le 25 septembre 2026 par Ribbit Downey (Seignor Developer) — tâche FRO-4. Instantané de l'arbre de travail avant tout commit ; à revérifier avant déploiement.*
