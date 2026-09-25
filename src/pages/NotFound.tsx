/**
 * Page 404 personnalisée, servie par Cloudflare avec un vrai statut 404
 * (voir `404.html` et la configuration `not_found_handling` du DevOps).
 *
 * TODO(FRO-2) : une grenouille perdue dans les roseaux (SVG du Graphiste),
 * accroche du Rédacteur, et un lien de retour vers l'accueil.
 */
export function NotFound() {
  return (
    <main>
      <h1>404</h1>
      <p>Cette page a sauté ailleurs.</p>
      <a href="/">Retourner à la mare</a>
    </main>
  )
}
