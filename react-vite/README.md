# FindIP Shield + React (Vite)

A signup form in a React 19 single-page app with FindIP Shield in the browser.

## What it shows

| File | What it does |
|---|---|
| [`src/shield.ts`](src/shield.ts) | `startShield()`: calls `init` once with `VITE_FINDIP_SHIELD_SITE_KEY`. |
| [`src/main.tsx`](src/main.tsx) | Starts Shield before the app renders. |
| [`src/SignupForm.tsx`](src/SignupForm.tsx) | The form. Shield reports its submit as `signup_attempt`; the handler sends `getSession().sessionId` to your backend as `findip_session_id` and tracks `signup_success` when the backend accepts. |

## Run it

1. `cp .env.example .env` and set `VITE_FINDIP_SHIELD_SITE_KEY` to your public site key from the [Shield dashboard](https://www.findip.net/shield). Allow `localhost` in the site's allowed domains so events from your machine are accepted.
2. `npm install`
3. `npm run dev`, and open http://localhost:5173.

Submit the form. The Network tab shows `POST` requests to `shield/track`. This folder has no backend, so the request to `/api/signup` fails and the form says so; point `SIGNUP_URL` at your own endpoint.

## Server verification

A single-page app has no server of its own, so the decision belongs in the backend that receives the signup. That endpoint reads `findip_session_id` from the request and, before creating the account, calls:

```http
POST https://shield.findip.net/v1/shield/sessions/verify
Authorization: Bearer <FINDIP_SHIELD_SECRET_KEY>
Content-Type: application/json

{ "session_id": "<findip_session_id>", "event": "signup_attempt" }
```

[`nextjs-app-router/lib/shield-verify.ts`](../nextjs-app-router/lib/shield-verify.ts) is a complete version of that call in TypeScript, with the decision logic. The secret key stays on the backend; it never gets a `VITE_` name.

Docs: [Quickstart](https://www.findip.net/docs/shield/quickstart) · [Server verification](https://www.findip.net/docs/shield/server-verification)
