# FindIP Shield + plain HTML

A signup form in one HTML file, with FindIP Shield loaded from a script tag. No build step, no dependencies.

## What it shows

Everything is in [`index.html`](index.html):

- The Shield script tag before `</body>`, with the public site key in `data-site-key`. The tag starts the SDK by itself and exposes `window.FindIP`.
- A normal `method="post"` form. Shield reports its submit as `signup_attempt`.
- `data-session-field="true"`, which makes the SDK add a hidden `findip_session` input to the form, so the server that receives the post can verify the session.

## Run it

1. In `index.html`, replace `pub_xxx` with your public site key from the [Shield dashboard](https://www.findip.net/shield). Allow `localhost` in the site's allowed domains so events from your machine are accepted.
2. Serve the folder over HTTP, for example `npx serve .`
3. Open http://localhost:3000 and submit the form.

The Network tab shows `POST` requests to `shield/track`. The folder has no server, so a small demo script stops the post and shows the `findip_session` value your server would receive.

A static file has no environment variables, so the key is written in the tag. On a server-rendered site (PHP, Rails, Django, Razor and so on), put the tag in the shared layout and write the key from your configuration.

## Server verification

The server that receives the form reads `findip_session` like any other field and, before creating the account, calls:

```http
POST https://shield.findip.net/v1/shield/sessions/verify
Authorization: Bearer <FINDIP_SHIELD_SECRET_KEY>
Content-Type: application/json

{ "session_id": "<findip_session>", "event": "signup_attempt" }
```

The response carries a `recommendation`: `allow`, `monitor`, `challenge` or `block`. [`nextjs-app-router/lib/shield-verify.ts`](../nextjs-app-router/lib/shield-verify.ts) shows the call and the decision logic in TypeScript. The secret key stays on the server.

## Pinning the script

`v1.js` serves the latest compatible 1.x build. To pin an exact version with subresource integrity, copy the pinned snippet from your site's Install page in the dashboard or from the [Quickstart](https://www.findip.net/docs/shield/quickstart).

Docs: [Quickstart](https://www.findip.net/docs/shield/quickstart) · [Server verification](https://www.findip.net/docs/shield/server-verification)
