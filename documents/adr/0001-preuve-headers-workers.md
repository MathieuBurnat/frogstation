# Preuve — en-têtes de sécurité servis par le runtime Workers

Généré le 2026-09-26T21:42:22Z — durcissement FRO-23, point R-01.

Commandes : `npm run build` puis `npx wrangler dev` (runtime workerd réel,
même moteur que la production), puis `curl -D -` sur trois types de réponses.

## GET /
```http
HTTP/1.1 200 OK
Transfer-Encoding: chunked
Content-Type: text/html; charset=utf-8
Cache-Control: public, max-age=0, must-revalidate
ETag: "c6c02cb8efbc88589978a1a0f079ce6b"
Strict-Transport-Security: max-age=31536000; includeSubDomains
CF-Cache-Status: HIT
content-security-policy: default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
permissions-policy: geolocation=(), microphone=(), camera=(), interest-cohort=()
referrer-policy: strict-origin-when-cross-origin
x-content-type-options: nosniff

```

## GET /chemin-inconnu
```http
HTTP/1.1 404 Not Found
Transfer-Encoding: chunked
Content-Type: text/html; charset=utf-8
Cache-Control: public, max-age=0, must-revalidate
ETag: "7d3bd4af16f53cfe930018fc03d718aa"
Strict-Transport-Security: max-age=31536000; includeSubDomains
CF-Cache-Status: HIT
content-security-policy: default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
permissions-policy: geolocation=(), microphone=(), camera=(), interest-cohort=()
referrer-policy: strict-origin-when-cross-origin
x-content-type-options: nosniff

```

## GET /assets/global-DzQ26bQ2.css
```http
HTTP/1.1 200 OK
Content-Length: 2056
Content-Type: text/css; charset=utf-8
Cache-Control: public, max-age=0, must-revalidate
ETag: "e86511abcd12b91dff0e096b559613b2"
Strict-Transport-Security: max-age=31536000; includeSubDomains
CF-Cache-Status: HIT
content-security-policy: default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
permissions-policy: geolocation=(), microphone=(), camera=(), interest-cohort=()
referrer-policy: strict-origin-when-cross-origin
x-content-type-options: nosniff

```

