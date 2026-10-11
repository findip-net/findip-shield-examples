# FindIP Shield + SvelteKit

A signup form in SvelteKit 3 with FindIP Shield in the browser and session verification in a form action.

## What it shows

| File | What it does |
|---|---|
| [`src/env.ts`](src/env.ts) | Declares the public site key and the private secret key. |
| [`src/routes/+layout.svelte`](src/routes/+layout.svelte) | Calls `init` once, in `onMount`, with `PUBLIC_FINDIP_SHIELD_SITE_KEY`. `sessionField: true` makes the SDK add a hidden `findip_session` input to the form. |
| [`src/routes/signup/+page.svelte`](src/routes/signup/+page.svelte) | A normal `method="POST"` form with `use:enhance`. Shield reports its submit as `signup_attempt`; the page tracks `signup_success` when the action succeeds. |
| [`src/routes/signup/+page.server.ts`](src/routes/signup/+page.server.ts) | The form action. Reads `findip_session` and verifies the session before creating the account. |
| [`src/server/shield-verify.ts`](src/server/shield-verify.ts) | The server-only call to `POST /v1/shield/sessions/verify` and the decision: allow, review or reject. |

## Run it

1. `cp .env.example .env` and set `PUBLIC_FINDIP_SHIELD_SITE_KEY` to your public site key from the [Shield dashboard](https://www.findip.net/shield). Allow `localhost` in the site's allowed domains so events from your machine are accepted.
2. Optional: set `FINDIP_SHIELD_SECRET_KEY` to turn on server verification. Without it the action logs `secret_key_not_set` and lets the signup through.
3. `npm install`, then `npm run dev`, and open http://localhost:5173/signup.

Submit the form. The Network tab shows `POST` requests to `shield/track`, and the terminal shows the server's verdict for the signup.

## Notes

- The secret key is imported from `$app/env/private`, which SvelteKit keeps out of browser code.
- The decision is made in the form action. The browser SDK reports risk signals; a request can reach the action without running the page, so the server check is the one that counts.
- On SvelteKit 2, read the keys from `$env/dynamic/public` and `$env/dynamic/private` instead of `src/env.ts`; the rest is the same.

Docs: [Quickstart](https://www.findip.net/docs/shield/quickstart) · [Server verification](https://www.findip.net/docs/shield/server-verification)
