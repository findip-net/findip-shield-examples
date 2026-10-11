# FindIP Shield + Astro

A signup form in Astro 7 with FindIP Shield in the browser and session verification in a server-rendered page.

## What it shows

| File | What it does |
|---|---|
| [`astro.config.mjs`](astro.config.mjs) | Declares the public site key and the server-only secret key with `astro:env`, and adds the Node adapter. |
| [`src/lib/shield.ts`](src/lib/shield.ts) | `startShield()`: calls `init` once with `PUBLIC_FINDIP_SHIELD_SITE_KEY`. `sessionField: true` makes the SDK add a hidden `findip_session` input to the form. |
| [`src/layouts/Layout.astro`](src/layouts/Layout.astro) | The base layout. Its `<script>` starts Shield on every page. |
| [`src/pages/signup.astro`](src/pages/signup.astro) | A normal `method="post"` form, handled on the server in the page's frontmatter. It reads `findip_session` and verifies the session before creating the account; the page tracks `signup_success` afterwards. |
| [`src/lib/shield-verify.ts`](src/lib/shield-verify.ts) | The server-only call to `POST /v1/shield/sessions/verify` and the decision: allow, review or reject. |

## Run it

1. `cp .env.example .env` and set `PUBLIC_FINDIP_SHIELD_SITE_KEY` to your public site key from the [Shield dashboard](https://www.findip.net/shield). Allow `localhost` in the site's allowed domains so events from your machine are accepted.
2. Optional: set `FINDIP_SHIELD_SECRET_KEY` to turn on server verification. Without it the page logs `secret_key_not_set` and lets the signup through.
3. `npm install`, then `npm run dev`, and open http://localhost:4321/signup.

Submit the form. The Network tab shows `POST` requests to `shield/track`, and the terminal shows the server's verdict for the signup.

## Notes

- The secret key is imported from `astro:env/server`, which Astro keeps out of browser code.
- The decision is made on the server. The browser SDK reports risk signals; a request can reach the page without running its scripts, so the server check is the one that counts.
- A fully static Astro site has no server step: start Shield in the layout as here, and verify the session in the backend that receives your form.

Docs: [Quickstart](https://www.findip.net/docs/shield/quickstart) · [Server verification](https://www.findip.net/docs/shield/server-verification)
