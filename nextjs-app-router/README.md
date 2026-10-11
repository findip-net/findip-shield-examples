# FindIP Shield + Next.js (App Router)

A signup form in Next.js 16 with FindIP Shield in the browser and session verification in a route handler.

## What it shows

| File | What it does |
|---|---|
| [`app/shield.tsx`](app/shield.tsx) | A `'use client'` component that calls `init` once, inside `useEffect`, with `NEXT_PUBLIC_FINDIP_SHIELD_SITE_KEY`. |
| [`app/layout.tsx`](app/layout.tsx) | Renders `<Shield />` once, so the SDK runs on every page. |
| [`app/signup/signup-form.tsx`](app/signup/signup-form.tsx) | The form. Shield reports its submit as `signup_attempt`; the handler sends `getSession().sessionId` to the server and tracks `signup_success` when the server accepts. |
| [`app/api/signup/route.ts`](app/api/signup/route.ts) | Verifies the session before creating the account. |
| [`lib/shield-verify.ts`](lib/shield-verify.ts) | The server-only call to `POST /v1/shield/sessions/verify` and the decision: allow, review or reject. |

## Run it

1. `cp .env.example .env` and set `NEXT_PUBLIC_FINDIP_SHIELD_SITE_KEY` to your public site key from the [Shield dashboard](https://www.findip.net/shield). Allow `localhost` in the site's allowed domains so events from your machine are accepted.
2. Optional: set `FINDIP_SHIELD_SECRET_KEY` to turn on server verification. Without it the route handler logs `secret_key_not_set` and lets the signup through.
3. `npm install`, then `npm run dev`, and open http://localhost:3000/signup.

Submit the form. The Network tab shows `POST` requests to `shield/track`, and the terminal shows the server's verdict for the signup.

## Notes

- The secret key has no `NEXT_PUBLIC_` prefix and is read only in `lib/shield-verify.ts`, which imports `server-only`.
- The decision is made in the route handler. The browser SDK reports risk signals; a request can reach `/api/signup` without running the page, so the server check is the one that counts.
- Using a Server Action instead of a route handler? Pass `getSession().sessionId` as an argument to the action and call `verifyShieldSession` inside it.

Docs: [Quickstart](https://www.findip.net/docs/shield/quickstart) · [Server verification](https://www.findip.net/docs/shield/server-verification)
