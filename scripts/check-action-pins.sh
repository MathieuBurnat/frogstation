#!/usr/bin/env bash
# Vérifie que chaque action GitHub référencée dans .github/ est épinglée à un SHA
# de commit complet (40 caractères hexadécimaux) — durcissement FRO-23 (P-02).
#
# Pourquoi : un tag Git (`@v4`, `@v7.0.1`) est déplaçable. Qui contrôle le tag
# contrôle ce qui s'exécute dans la CI, y compris dans le job qui manipule le
# token de déploiement Cloudflare. Un SHA, lui, ne bouge pas.
#
# Ce garde-fou vaut pour *tous* les workflows, présents et futurs : le prochain
# workflow de déploiement ne pourra pas être fusionné avec un tag mouvant.
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

sha_re='^[0-9a-f]{40}$'
failures=0
checked=0

while IFS= read -r line; do
  file="${line%%:*}"
  raw="${line#*:}"

  # Isole la valeur de `uses:` et retire guillemets et commentaire de version.
  ref="$(printf '%s' "$raw" | sed -E 's/.*uses:[[:space:]]*//; s/[[:space:]]*#.*$//; s/^["'\'']//; s/["'\'']$//')"
  [ -n "$ref" ] || continue

  # Une action locale (`./.github/actions/...`) est du code de ce dépôt : elle
  # est déjà figée par le commit qui l'utilise.
  case "$ref" in
    ./*) continue ;;
  esac

  checked=$((checked + 1))

  # `owner/repo@ref` ou `owner/repo/path@ref`, éventuellement `docker://image@sha256:...`
  pinned="${ref##*@}"

  if [[ "$ref" != *@* ]]; then
    printf '  ✗ %s : "%s" — aucune référence (@) : épingle un SHA de commit complet.\n' "$file" "$ref"
    failures=$((failures + 1))
  elif [[ ! "$pinned" =~ $sha_re ]]; then
    printf '  ✗ %s : "%s" — référence mouvante "%s" : épingle un SHA de commit complet.\n' "$file" "$ref" "$pinned"
    failures=$((failures + 1))
  fi
done < <(grep -rEn '^[[:space:]]*-?[[:space:]]*uses:[[:space:]]*[^[:space:]]' .github 2>/dev/null || true)

if [ "$failures" -gt 0 ]; then
  printf '\n%s action(s) non épinglée(s) sur %s vérifiée(s).\n' "$failures" "$checked" >&2
  printf 'Résoudre le SHA avec : gh api repos/<owner>/<repo>/git/ref/tags/<tag> --jq .object.sha\n' >&2
  printf 'Puis écrire : uses: owner/repo@<sha40> # <tag>\n' >&2
  exit 1
fi

printf '✓ %s action(s) épinglée(s) à un SHA de commit.\n' "$checked"
