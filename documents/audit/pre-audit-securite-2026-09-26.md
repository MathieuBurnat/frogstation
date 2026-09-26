# Pré-audit de sécurité — Frogstation

**Ticket :** FRO-16 (audit final + droit de veto) · **Auteur :** Serious Robert, Expert Cybersécurité
**Date :** 26 septembre 2026 · **Dépôt :** `MathieuBurnat/frogstation`
**Révision auditée :** `b72eab8` (unique commit de `main`)

> **Ce document n'est pas le rapport final et ne porte aucun verdict.**
> FRO-16 est bloqué sur FRO-19 (CI/CD) et FRO-20 (intégration front-end), qui ne
> sont pas livrés. Le verdict **FEU VERT / VETO** sera rendu sur FRO-16 une fois
> ces deux tickets en `done`.
>
> Objet de ce pré-audit : auditer **dès maintenant** tout ce qui est auditable sans
> l'intégration, pour que les exigences de sécurité soient connues **avant** que le
> code soit écrit, et non découvertes sous forme de veto à la dernière minute.

---

## 1. Synthèse

Le socle `b72eab8` est **sain sur le fond** : zéro vulnérabilité de dépendance,
aucun secret dans l'historique, aucun motif d'injection, et des en-têtes de
sécurité complets. Les correctifs de l'audit FRO-4 sont bien en place.

Trois écarts relèvent en revanche de mon périmètre explicite et sont aujourd'hui
**non conformes**. Aucun n'est exploitable en l'état, mais tous les trois sont des
**conditions de mise en production**, pas des recommandations :

| Réf | Constat | Gravité | Propriétaire |
| --- | --- | --- | --- |
| **P-01** | La branche `main` n'est pas protégée du tout | 🟠 élevée | FRO-19 |
| **P-02** | Les actions GitHub sont épinglées à des tags mouvants, pas à des SHA | 🟠 élevée | FRO-19 |
| **P-03** | Les mises à jour de sécurité Dependabot sont désactivées au niveau du dépôt | 🟡 moyenne | FRO-19 |

Un point d'arbitrage m'était explicitement confié — `style-src 'unsafe-inline'` —
et je le **tranche ici** : il doit être retiré (§4, preuve à l'appui).

---

## 2. Méthodologie

Tout constat ci-dessous est adossé à une commande ou un fichier. Rien n'est affirmé
sans vérification.

| # | Vérification | Commande / source |
| --- | --- | --- |
| 1 | Revue de code des sources | `grep -rnE "dangerouslySetInnerHTML\|innerHTML\|eval\(\|new Function\|target=\|javascript:\|href=\{\|src=\{\|style=\{\|style=\"" src/ index.html 404.html` |
| 2 | Secrets dans l'**historique** complet | `git log --all -p` filtré sur motifs `CLOUDFLARE_API_TOKEN`, `api_key`, `secret`, `token`, `password`, `BEGIN … PRIVATE KEY`, `ghp_`, `github_pat_`, `AKIA…`, `xox…`, `sk-…` |
| 3 | Dépendances | `npm ci` puis `npm audit --audit-level=high` et `npm audit --json` |
| 4 | Styles inline réellement émis | `npm run build` puis inspection de `dist/*.html` et `dist/assets/` |
| 5 | Protection de branche | `gh api repos/MathieuBurnat/frogstation/branches/main/protection` |
| 6 | Réglages de sécurité du dépôt | `gh api repos/MathieuBurnat/frogstation --jq .security_and_analysis` |
| 7 | Épinglage des actions | `grep -rn "uses:" .github/` |
| 8 | Résolution des SHA d'actions | `gh api repos/actions/{checkout,setup-node}/git/ref/tags/{v4,v7}` |

**Hors périmètre de ce pré-audit** (reporté au rapport final) : en-têtes *tels que
servis*, scope réel du token Cloudflare, revue du contenu rédactionnel et graphique,
formulaire de contact, et tout code d'intégration — rien de tout cela n'existe encore.

---

## 3. Constats détaillés

### 🟠 P-01 — La branche `main` n'est pas protégée

```
$ gh api repos/MathieuBurnat/frogstation/branches/main/protection
{"message":"Branch not protected","status":"404"}
```

Le dépôt est **public** (`visibility: public`). `main` n'a aujourd'hui :

- aucune PR obligatoire — on peut pousser directement sur `main` ;
- aucune review obligatoire ;
- aucun check requis — le workflow CI existe mais **son échec ne bloque rien** ;
- aucune protection contre le `force push` ni contre la suppression de branche.

**Impact.** La CI mise en place par FRO-6 est purement décorative en l'état : elle
signale, elle n'empêche pas. Un `npm audit` rouge, un typecheck cassé ou un secret
poussé en force n'arrêtent pas la livraison. C'est aussi l'écart qui rend les deux
autres constats plus graves : rien ne garantit que les garde-fous restent en place.

**Ce qui est attendu.** PR obligatoire avec au moins 1 review, check `verify`
requis, `force push` et suppression interdits sur `main`.

**Pourquoi je ne l'ai pas activé moi-même.** J'ai le droit `admin` sur le dépôt, je
pouvais donc le faire en un appel. Je m'en suis abstenu volontairement : activer la
PR obligatoire **maintenant** couperait la capacité de Mr. Gloop, Ribbit Downey et
Nino Croaks à livrer sur `main` en plein chantier, et transformerait un durcissement
en panne. La bonne fenêtre est **après** la livraison de FRO-20, **avant** le premier
déploiement. J'en fais une condition de mon feu vert, pas une action surprise.

Appel de référence, à passer par le propriétaire de FRO-19 le moment venu :

```bash
gh api -X PUT repos/MathieuBurnat/frogstation/branches/main/protection \
  --input - <<'JSON'
{
  "required_status_checks": { "strict": true, "contexts": ["verify"] },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
JSON
```

---

### 🟠 P-02 — Actions GitHub épinglées à des tags mouvants

```
$ grep -rn "uses:" .github/
.github/workflows/ci.yml:23:      - uses: actions/checkout@v4
.github/workflows/ci.yml:25:      - uses: actions/setup-node@v4
```

Un tag Git est **déplaçable**. `actions/checkout@v4` ne désigne pas un code figé :
qui contrôle le tag contrôle ce qui s'exécute dans la CI. C'est le vecteur de
compromission de chaîne d'approvisionnement classique sur GitHub Actions, et mon
périmètre l'exige explicitement : *« toutes les actions épinglées à un SHA de
commit, pas à un tag mouvant »*.

**Circonstance aggravante.** Trois PR Dependabot sont ouvertes et **non fusionnées**
(`main` n'a qu'un seul commit) :

| PR | Sujet |
| --- | --- |
| #1 | `actions/checkout` 4 → 7 |
| #2 | `actions/setup-node` 4 → 7 |
| #3 | groupe `dev-dependencies`, 2 mises à jour |

Fusionner #1 et #2 tels quels ne corrige **rien** : on passerait d'un tag mouvant à
un autre tag mouvant. Il faut épingler au SHA, en conservant la version en
commentaire pour que Dependabot continue de proposer les montées de version — il
sait mettre à jour un SHA épinglé annoté.

**Correction attendue** (SHA résolus le 26/09/2026 via l'API GitHub) :

```yaml
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
      - uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0
```

Si le choix est de rester en v4 pour l'instant :

```yaml
      - uses: actions/checkout@11d5960a326750d5838078e36cf38b85af677262 # v4
      - uses: actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020 # v4
```

**Le workflow de déploiement à venir est concerné au même titre** — y compris
`cloudflare/wrangler-action` ou `cloudflare/pages-action`, qui manipuleront le token
de déploiement. C'est là que l'épinglage compte le plus.

---

### 🟡 P-03 — Mises à jour de sécurité Dependabot désactivées

```
$ gh api repos/MathieuBurnat/frogstation --jq .security_and_analysis
{
  "secret_scanning":                 { "status": "enabled"  },
  "secret_scanning_push_protection": { "status": "enabled"  },
  "dependabot_security_updates":     { "status": "disabled" },
  "secret_scanning_non_provider_patterns": { "status": "disabled" },
  "secret_scanning_validity_checks":       { "status": "disabled" }
}
```

`.github/dependabot.yml` couvre les **mises à jour de version** (hebdomadaires, le
lundi). Ce n'est pas la même chose que les **mises à jour de sécurité** Dependabot,
qui sont un réglage de dépôt et qui, elles, ouvrent une PR *immédiatement* sur
publication d'une CVE, sans attendre le lundi.

**Impact.** Une CVE critique publiée un mardi attend jusqu'à six jours avant même
d'être signalée par une PR. Sur un site statique le risque réel est faible, mais le
coût de la correction est de deux clics.

**Correction attendue :** activer *Settings → Code security → Dependabot security
updates*, ou

```bash
gh api -X PUT repos/MathieuBurnat/frogstation/automated-security-fixes
```

À noter au crédit du projet : **Secret Scanning et Push Protection sont bien
activés** — c'était la recommandation au meilleur rapport effort/bénéfice de l'audit
FRO-4 (S-05), et elle a été appliquée.

---

## 4. Arbitrage rendu : `style-src 'unsafe-inline'` doit être retiré

C'était le point explicitement laissé à ma décision. **Je tranche : il part.**

`'unsafe-inline'` dans `style-src` neutralise une partie de la CSP — il autorise
tout attribut `style=` et tout bloc `<style>` injecté, ce qui est le vecteur
d'exfiltration par CSS et de défiguration d'interface.

**Preuve que rien ne l'exige.** Sur `b72eab8`, le build de production n'émet aucun
style inline :

```
$ npm run build
dist/index.html                     1.35 kB
dist/assets/main-DffGpNhF.css       0.39 kB
dist/assets/global-DzQ26bQ2.css     2.05 kB
…
$ grep -oE '(<style[^>]*>|style="[^"]*")' dist/*.html
dist/404.html:<script type="module" crossorigin src="/assets/notFound-….js">
dist/index.html:<script type="module" crossorigin src="/assets/main-….js">
```

Aucun `<style>`, aucun attribut `style=`. Le CSS est intégralement extrait dans
`dist/assets/*.css`, servis depuis la même origine — donc couverts par
`style-src 'self'`. C'est le comportement attendu : Vite n'injecte des styles en
ligne qu'en mode `dev`, jamais dans un build de production. Les CSS Modules et les
variables de `design-tokens.css` fonctionnent sans styles inline.

**Valeur cible :**

```
style-src 'self'
```

**Condition portée à FRO-20.** Cet arbitrage est valable tant que l'intégration
n'introduit pas de style inline. Concrètement, sont interdits sans accord préalable
de ma part : l'attribut `style={{…}}` en JSX, `element.style.…` en JavaScript, et
toute bibliothèque de CSS-in-JS. Si l'intégration en a un besoin réel, elle doit me
le signaler **avec le code exact en cause** — je réexaminerai, mais la valeur par
défaut est `'self'`. Je revérifierai `dist/` avant de rendre mon verdict.

**Durcissement complémentaire recommandé** (même ligne CSP) : ajouter
`object-src 'none'`. Aujourd'hui `object-src` hérite de `default-src 'self'`, ce qui
autorise `<object>` et `<embed>` depuis l'origine alors que le site n'en a aucun
usage.

CSP cible complète :

```
Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
```

---

## 5. Points vérifiés et conformes

| Point | Preuve |
| --- | --- |
| Aucun `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function` | `grep` sur `src/`, `index.html`, `404.html` → **aucun résultat** |
| Aucun `target="_blank"` (donc pas de `rel` manquant), aucune URL dynamique | même `grep` → **aucun résultat** ; les seuls liens sont des ancres statiques et `href="/"` |
| Aucun secret dans l'arbre **ni dans l'historique** | `git log --all -p` sur ~10 motifs de secrets → uniquement des correspondances sur le mot « tokens » des *design tokens* CSS |
| `.env` exclu de Git | `.gitignore` : `.env`, `.env.*`, `!.env.example`, `*.pem`, `*.key`, `.dev.vars*`, `.wrangler`, `.claude/` |
| `npm audit --audit-level=high` | **0 vulnérabilité**, toutes gravités confondues (`{critical:0, high:0, moderate:0, low:0, info:0}`) sur 70 dépendances |
| Aucune dépendance superflue | 4 en production (`react`, `react-dom` et leurs transitives), 67 en développement — strictement l'outillage Vite / TS / oxlint. Rien d'exotique |
| Lockfile cohérent et CI en `npm ci` | `npm ci` réussit sans divergence ; `.github/workflows/ci.yml:31` utilise bien `npm ci`, pas `npm install` |
| Permissions du workflow minimales et explicites | `ci.yml:11-12` → `permissions: contents: read`. Pas de défaut implicite, pas de `write-all` |
| Aucun `pull_request_target` | `ci.yml` se déclenche sur `pull_request` et `push` sur `main` uniquement |
| `npm audit` exécuté dans la CI | `ci.yml` étape « npm audit » → `npm audit --audit-level=high` |
| En-têtes présents dans `public/_headers` | CSP, `Strict-Transport-Security` (`max-age=31536000; includeSubDomains`), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, et anti-iframe via `frame-ancestors 'none'` |
| `_headers` bien copié au build | présent dans `dist/_headers` après `npm run build` |
| Secret Scanning + Push Protection | `security_and_analysis` → les deux `enabled` |

Les six constats de l'audit FRO-4 sont contre-vérifiés : **S-01 à S-05 tiennent
toujours** sur `b72eab8`. **S-06 reste ouvert** (§6).

---

## 6. Risques résiduels, à statuer dans le rapport final

Ces points ne sont **pas** des manquements — ils ne sont simplement pas encore
auditables. Ils sont listés pour qu'aucun ne soit découvert au dernier moment.

| Réf | Point ouvert | Dépend de |
| --- | --- | --- |
| **R-01** | En-têtes **tels que réellement servis**. `public/_headers` est un mécanisme **Cloudflare Pages**. Si le déploiement retenu est un **Worker**, ce fichier n'est pas servi et le site n'a **aucun** en-tête de sécurité, alors que le fichier est bien présent dans le dépôt. Un fichier présent mais non servi ne protège personne. | FRO-19 |
| **R-02** | Scope du token Cloudflare : strictement limité au déploiement du projet, jamais un token global de compte. Vérifiable seulement une fois émis. | FRO-19 + action humaine |
| **R-03** | Épinglage SHA et `permissions:` du **workflow de déploiement**, qui n'existe pas encore. Même exigence que P-02. | FRO-19 |
| **R-04** | Formulaire de contact : validation des entrées, aucune donnée personnelle stockée sans nécessité, protection anti-spam (Cloudflare Turnstile) présente ou explicitement planifiée. Si un service tiers est appelé, son origine devra être ajoutée à `connect-src`/`form-action` — **et non à `default-src`**. | FRO-20 |
| **R-05** | Confirmation qu'aucun style inline n'a été introduit (§4). | FRO-20 |
| **R-06** | Aucune dépendance ajoutée sans accord. Base de comparaison figée ici : **4 prod / 67 dev**. Tout écart sera contesté. | FRO-18 / FRO-20 |
| **R-07** | **S-06 de l'audit FRO-4, toujours ouvert.** `index.html` contient encore les placeholders `[URL_SITE]`, `[META_DESCRIPTION]`, `[OG_TITLE]`, `[OG_DESCRIPTION]`. `<link rel="canonical" href="[URL_SITE]/">` est une URL invalide. Ne bloque pas le pipeline, **bloque la publication**. L'URL de production est attendue du board (FRO-6). | board + FRO-18 |

---

## 7. Conditions de mon feu vert

Pour lever le veto au moment du rapport final, il me faudra constater :

1. **P-01** — `main` protégée : PR + 1 review + check `verify` requis, `force push` et suppression interdits.
2. **P-02** — Toutes les actions épinglées au SHA, **dans tous les workflows**, déploiement inclus.
3. **P-03** — Mises à jour de sécurité Dependabot activées.
4. **§4** — `style-src 'self'` sans `'unsafe-inline'`, et `object-src 'none'`.
5. **R-01** — En-têtes vérifiés **sur une réponse HTTP réelle**, pas sur le fichier de configuration.
6. **R-04** — Formulaire de contact validé et protégé anti-spam.
7. **R-06** — `npm audit --audit-level=high` toujours à 0, et aucune dépendance ajoutée sans accord.
8. **R-07** — Plus aucun placeholder `[…]` dans `index.html`.

**Security First!** Aucune mise en production sans mon feu vert sur FRO-16.
