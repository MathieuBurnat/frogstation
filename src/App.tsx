import styles from './App.module.css'

/**
 * Squelette du site vitrine Frogstation.
 *
 * Contrat pour les développeurs (FRO-2) :
 * - les 5 sections ci-dessous et leurs `id` sont l'ossature validée par le
 *   Frogmaster : la navigation par ancres en dépend, ne les renommez pas sans
 *   accord ;
 * - tous les textes viennent du Rédacteur (Mr. Gloop — ticket dédié à ouvrir)
 *   et doivent être centralisés dans `src/content/` — pas de copie en dur dispersée dans les composants ;
 * - toute couleur, espacement, rayon ou ombre passe par une variable de
 *   `src/styles/design-tokens.css`. Aucune valeur brute dans les composants.
 */
export function App() {
  return (
    <>
      <a className={styles.skipLink} href="#contenu">
        Aller au contenu principal
      </a>

      <header className={styles.header}>
        {/* TODO(FRO-2) : logo + navigation par ancres, repliable en mobile */}
        <nav aria-label="Navigation principale">
          <ul>
            <li>
              <a href="#esprit">Notre esprit</a>
            </li>
            <li>
              <a href="#equipe">L'équipe</a>
            </li>
            <li>
              <a href="#savoir-faire">Ce que nous faisons</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </nav>
      </header>

      <main id="contenu">
        <section id="accueil" aria-labelledby="accueil-titre">
          <h1 id="accueil-titre">Frogstation</h1>
          {/* TODO(FRO-2) : hero — accroche du Rédacteur + illustration du Graphiste */}
        </section>

        <section id="esprit" aria-labelledby="esprit-titre">
          <h2 id="esprit-titre">Notre esprit</h2>
          {/* TODO(FRO-2) : valeurs et philosophie */}
        </section>

        <section id="equipe" aria-labelledby="equipe-titre">
          <h2 id="equipe-titre">L'équipe</h2>
          {/* TODO(FRO-2) : une carte par membre (nom de grenouille, rôle, description, avatar SVG) */}
        </section>

        <section id="savoir-faire" aria-labelledby="savoir-faire-titre">
          <h2 id="savoir-faire-titre">Ce que nous faisons</h2>
          {/* TODO(FRO-2) : activités et savoir-faire */}
        </section>

        <section id="contact" aria-labelledby="contact-titre">
          <h2 id="contact-titre">Contact</h2>
          {/* TODO(FRO-2) : moyen de contact simple. Toute entrée utilisateur doit être
              validée côté client ET protégée anti-spam — voir l'audit sécurité (FRO-4). */}
        </section>
      </main>

      <footer className={styles.footer}>
        {/* TODO(FRO-2) : mentions + easter egg « croâ » discret, respectant prefers-reduced-motion */}
      </footer>
    </>
  )
}
