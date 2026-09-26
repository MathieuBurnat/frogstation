# Textes du site vitrine Frogstation

Auteur : Mr. Gloop (graphiste / rédacteur) — livré sur **FRO-18**.
Prêt à intégrer, section par section. Le niveau de titre indiqué est celui du
HTML final (un seul `h1` par page).

> **Note aux intégrateurs.** Tout ce qui est entre crochets — `[EMAIL_CONTACT]`,
> `[URL_SITE]`, etc. — est un **placeholder** : ne l'inventez pas, ne le
> remplacez pas au hasard. La liste complète est en fin de document (§ 9) et part
> au README.
>
> En revanche, les **noms de grenouille, rôles et descriptions de l'équipe sont
> du contenu assumé** : ce sont des personnages, pas des placeholders. Ils se
> publient tels quels.

---

## 1. Accueil (hero)

**Lien d'évitement** (premier élément focusable de la page) :
> Aller au contenu principal

**Navigation** (libellés, dans l'ordre des ancres) :
> Notre esprit · L'équipe · Ce que nous faisons · Contact

**Titre (`h1`)**
> Frogstation, l'agence web qui n'a pas froid aux pattes

**Chapô**
> Nous concevons, développons et déployons des sites et des interfaces web.
> Rapides, accessibles, sans dette technique planquée sous un nénuphar.

**Bouton primaire**
> Parlons de votre projet

**Bouton secondaire**
> Voir ce que nous faisons

**Trois accroches courtes sous le hero** (badges ou petite liste — pas de
chiffres, pas de promesse mesurée) :
> Des interfaces qui vont droit au but
> Un site accessible, pas « accessible un jour »
> Des mises en production sans plongeon

---

## 2. Notre esprit

**Titre (`h2`)**
> Notre esprit

**Chapô**
> Une mare, six grenouilles, une méthode. On avance par petits sauts précis
> plutôt que par grands plongeons qu'on regrette.

**Trois valeurs — titre (`h3`) + texte**

**Sauter, pas patauger**
> Nous livrons par itérations courtes et visibles. Vous voyez votre projet
> bouger à chaque saut, et vous pouvez changer de nénuphar tant qu'il est encore
> temps — pas une fois le béton coulé.

**Toute la mare travaille ensemble**
> Design, développement, infrastructure, qualité et sécurité avancent en même
> temps, pas en relais. Le résultat : moins d'allers-retours, moins de
> surprises, et une seule équipe à qui parler.

**L'eau claire plutôt que l'eau trouble**
> Nous expliquons ce que nous faisons, pourquoi, et ce que ça coûte. Nos choix
> techniques sont écrits noir sur blanc. Si quelque chose ne va pas, nous le
> disons avant que vous ne le découvriez.

**Phrase de clôture de section**
> Un croâ vaut mieux qu'un long silence : nous préférons poser la question tôt
> que livrer à côté.

---

## 3. L'équipe

**Titre (`h2`)**
> L'équipe

**Chapô**
> Six grenouilles, six spécialités, un seul nénuphar. Voici qui travaillera
> vraiment sur votre projet.

Une carte par membre : avatar illustré, nom (`h3`), rôle, description.
Les avatars sont dans `src/assets/avatars/` — voir l'inventaire SVG du
document `charte` pour le texte alternatif exact de chacun.

### Frog Master — Chef d'opération

> Il voit la mare entière depuis son nénuphar le plus haut. Frog Master
> découpe, arbitre et déclenche : c'est lui qui décide quel saut se fait
> maintenant et lequel attendra le prochain printemps. Il tranche vite, et il
> explique pourquoi.

Avatar : `avatars/frog-master.svg`

### Mr. Gloop — Graphiste et rédacteur

> Il choisit les couleurs de la mare et les mots qui vont avec. Mr. Gloop
> dessine chaque icône à la patte, mesure ses contrastes avant de les proposer,
> et retire une vanne sur deux pour que la phrase reste claire. Son credo : si
> vous devez relire, c'est raté.

Avatar : `avatars/mr-gloop.svg`

### Ribbit Downey — Développement front-end

> Il transforme une maquette en interface qui répond au doigt, à l'œil et au
> clavier. Ribbit code au millimètre, teste au zoom 200 %, et refuse
> obstinément d'ajouter une dépendance dont on peut se passer. Léger, rapide,
> sans nénuphar superflu.

Avatar : `avatars/ribbit-downey.svg`

### Nino Croaks — DevOps

> Il construit les tuyaux et surveille le débit. Nino automatise la mise en
> production pour qu'elle devienne un non-événement : on pousse, ça part, ça
> tient. Et si ça ne tient pas, le retour en arrière prend moins de temps qu'un
> croâ.

Avatar : `avatars/nino-croaks.svg`

### Bella Lilypad — Qualité et recette

> Elle relit tout, à la loupe et au lecteur d'écran. Bella cherche le détail qui
> casse : le lien mort, le contraste limite, le formulaire qui refuse le
> clavier. Elle trouve les bestioles avant vos visiteurs, et c'est bien tout
> l'intérêt.

Avatar : `avatars/bella-lilypad.svg`

### Serious Robert — Sécurité

> Il ne sourit pas beaucoup, et c'est très bien comme ça. Serious Robert
> verrouille les en-têtes, traque les dépendances douteuses et donne — ou refuse
> — le feu vert avant chaque mise en ligne. Personne n'entre dans la mare sans
> son accord.

Avatar : `avatars/serious-robert.svg`

---

## 4. Ce que nous faisons

**Titre (`h2`)**
> Ce que nous faisons

**Chapô**
> Du cadrage à la mise en ligne, et après. Six savoir-faire qui travaillent
> ensemble sur le même projet.

Une carte par activité : icône décorative (`aria-hidden`, voir inventaire SVG),
titre (`h3`), texte.

### Sites et interfaces
> Sites vitrine, pages d'atterrissage, interfaces d'application. Nous partons de
> ce que vos visiteurs doivent réussir à faire, puis nous construisons le
> chemin le plus court pour y arriver.

Icône : `icons/icon-interface.svg`

### Design et identité
> Palette, typographie, icônes, règles de composition : une charte écrite que
> vos équipes peuvent reprendre sans nous. Les contrastes sont mesurés, pas
> estimés à l'œil.

Icône : `icons/icon-identite.svg`

### Déploiement et infrastructure
> Intégration continue, mise en production automatisée, hébergement à la bonne
> échelle. L'objectif : que publier une modification devienne aussi banal
> qu'enregistrer un fichier.

Icône : `icons/icon-infra.svg`

### Qualité et accessibilité
> Recette manuelle et automatisée, navigation clavier, lecteur d'écran,
> performance, liens. L'accessibilité est traitée pendant le projet, jamais
> rattrapée à la fin.

Icône : `icons/icon-qualite.svg`

### Sécurité
> En-têtes HTTP, politique de sécurité de contenu, revue des dépendances,
> audit avant chaque mise en ligne. Pas de faille laissée « pour plus tard ».

Icône : `icons/icon-securite.svg`

### Conseil et cadrage
> Vous hésitez encore sur le périmètre ? Nous cadrons avec vous : ce qui est
> utile, ce qui attendra, et ce qui ne mérite pas d'être construit du tout.

Icône : `icons/icon-conseil.svg`

---

## 5. Contact

**Titre (`h2`)**
> Venez croâsser avec nous

**Chapô**
> Un projet, une question, un devis à comparer ? Écrivez-nous : nous répondons
> à tout le monde, même aux idées encore floues.

**Adresse e-mail (mise en avant, cliquable)**
> `[EMAIL_CONTACT]`

**Formulaire** — libellés visibles (jamais un simple `placeholder` en guise de
libellé) :

| Champ | Libellé | Aide / message d'erreur |
| --- | --- | --- |
| Nom | `Votre nom` | *(erreur)* Il nous faut un nom pour vous répondre. |
| E-mail | `Votre adresse e-mail` | Aide : Nous ne l'utilisons que pour vous répondre. — *(erreur)* Cette adresse e-mail semble incomplète. |
| Sujet | `Sujet` | *(optionnel — mention « facultatif » dans le libellé)* |
| Message | `Votre message` | Aide : Dites-nous en deux lignes ce que vous cherchez à faire. — *(erreur)* Un petit croâ, même court, nous aiderait. |

**Bouton d'envoi**
> Envoyer le croâ

**Message de succès**
> Croâ bien reçu. Nous vous répondons rapidement à l'adresse indiquée.

**Message d'erreur global**
> L'envoi n'a pas abouti. Réessayez dans un instant, ou écrivez-nous
> directement à `[EMAIL_CONTACT]`.

**Mention sous le formulaire**
> Les champs marqués comme obligatoires sont nécessaires pour vous répondre.
> Rien n'est utilisé à d'autres fins.

**Pied de page**
> Frogstation — une mare, six grenouilles, des sites qui tiennent.
> `[EMAIL_CONTACT]` · `[LIEN_MENTIONS_LEGALES]`
> © `[ANNEE_COURANTE]` Frogstation

---

## 6. Page 404

**Titre (`h1`)**
> 404 — cette grenouille s'est perdue dans les roseaux

**Texte**
> La page que vous cherchez a filé sous un nénuphar. Elle a peut-être changé
> d'adresse, ou elle n'a jamais existé — dans les roseaux, difficile à dire.

**Deuxième paragraphe**
> Reprenez votre souffle, puis sautez ailleurs :

**Liens**
> Retour à l'accueil
> Voir l'équipe
> Nous écrire

**Illustration**
`illustrations/frog-lost-in-reeds.svg` — **porteuse de sens**, garder son
`<title>` : « Une petite grenouille assise sur un nénuphar au milieu de grands
roseaux, en train de scruter l'horizon ».

---

## 7. Métadonnées SEO

### Page d'accueil (`index.html`)

| Balise | Contenu |
| --- | --- |
| `<html lang>` | `fr` |
| `title` | `Frogstation — agence web : sites, interfaces, accessibilité` |
| `meta description` | `Frogstation conçoit, développe et déploie des sites et interfaces web rapides et accessibles. Design, développement, infrastructure, qualité et sécurité dans la même équipe.` |
| `meta theme-color` | `#15653f` (= `--color-accent`) |
| `link rel="canonical"` | `[URL_SITE]` |
| `og:type` | `website` |
| `og:site_name` | `Frogstation` |
| `og:locale` | `fr_FR` |
| `og:title` | `Frogstation, l'agence web qui n'a pas froid aux pattes` |
| `og:description` | `Sites et interfaces rapides et accessibles. Une mare, six grenouilles, une méthode par petits sauts.` |
| `og:url` | `[URL_SITE]` |
| `og:image` | `[URL_IMAGE_OG]` — image à produire en `1200×630` |
| `og:image:alt` | `Le logo Frogstation : une tête de grenouille posée sur une feuille de nénuphar` |
| `twitter:card` | `summary_large_image` |

### Page 404 (`404.html`)

| Balise | Contenu |
| --- | --- |
| `title` | `Page introuvable (404) — Frogstation` |
| `meta description` | `Cette page s'est perdue dans les roseaux. Revenez à l'accueil de Frogstation.` |
| `meta robots` | `noindex` |

> **À noter pour l'intégration :** `og:image` est le seul asset de cette liste
> qui n'existe pas encore. Une image Open Graph n'est pas dans mon périmètre de
> livrables FRO-18 : si le Frogmaster la veut, qu'il ouvre un ticket et je la
> dessine à partir du favicon. En attendant, laissez le placeholder plutôt que
> de pointer vers une image absente.

---

## 8. Libellés d'accessibilité

**Lien d'évitement**
> Aller au contenu principal

**Repères / régions** (`aria-label` sur les landmarks) :

| Élément | Libellé |
| --- | --- |
| `<nav>` principal | `Navigation principale` |
| `<nav>` du pied de page | `Liens de pied de page` |
| `<footer>` | `Pied de page` |
| Bouton d'ouverture du menu mobile | `Ouvrir le menu` / `Fermer le menu` (l'état vit dans `aria-expanded`) |
| Lien du logo vers l'accueil | `Frogstation, retour à l'accueil` |

**Bouton de l'easter egg « croâ »** (micro-interaction 6.3 du document `charte`)
> Faire croâsser la grenouille

**Textes alternatifs des SVG porteurs de sens**
Ils sont déjà dans le `<title>` de chaque fichier ; l'inventaire complet est
dans le document `charte`, § 5. Les six icônes de « Ce que nous faisons » sont
**décoratives** : `aria-hidden="true"`, aucun texte alternatif.

**Titres de section** — chaque `<section>` est reliée à son `h2` par
`aria-labelledby`, afin que la navigation par régions annonce un nom utile.

**Formulaire** — chaque champ a un `<label for>` visible ; les messages d'erreur
sont reliés par `aria-describedby` et annoncés dans une région `aria-live`
polie. Jamais la couleur seule pour signaler une erreur : le texte le dit.

---

## 9. Liste des placeholders

Aucune information réelle n'a été inventée. À renseigner avant la mise en ligne
(destination : README) :

| Placeholder | À remplacer par | Où |
| --- | --- | --- |
| `[EMAIL_CONTACT]` | l'adresse e-mail réelle de contact | § 5 Contact (×3 : mise en avant, message d'erreur, pied de page) |
| `[URL_SITE]` | l'URL canonique du site publié | § 7 (`canonical`, `og:url`) |
| `[URL_IMAGE_OG]` | l'URL absolue de l'image Open Graph `1200×630` | § 7 (`og:image`) |
| `[LIEN_MENTIONS_LEGALES]` | l'URL de la page de mentions légales, **ou** retirer le lien si elle n'existe pas | § 5 pied de page |
| `[ANNEE_COURANTE]` | l'année, calculée à l'exécution ou au build | § 5 pied de page |

**Ce que je n'ai volontairement pas écrit** : aucune adresse postale, aucun
numéro de téléphone, aucun nom de client, aucun compte de réseau social, aucun
chiffre (« X projets livrés », « Y ans d'expérience », taux de satisfaction).
Si le Frogmaster veut une section de références ou des chiffres, il faut de
vraies données : ouvrez un ticket, je les mettrai en forme.
