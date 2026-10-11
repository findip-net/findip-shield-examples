# FindIP Shield examples

[![CI](https://github.com/findip-net/findip-shield-examples/actions/workflows/ci.yml/badge.svg)](https://github.com/findip-net/findip-shield-examples/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/%40findip%2Fshield.svg)](https://www.npmjs.com/package/@findip/shield)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Minimal, runnable examples of [FindIP Shield](https://www.findip.net/shield/overview) in the frameworks people build signup forms with.

Shield adds visitor risk signals to a website: VPN, proxy, Tor, relay, hosting, datacenter and malicious-IP activity, with a risk score, the reasons behind it and a recommendation for each visit and form submit. A browser SDK reports the visit; your server verifies the session before it acts.

Each example is the same small app: a signup form, the SDK started once with the site key from configuration, the signup attempt reported, and, where the framework has a server, the session verified on the server before the account is created.

## Examples

| Folder | Stack | Install | Server verification |
|---|---|---|---|
| [`nextjs-app-router`](nextjs-app-router) | Next.js 16, App Router | npm | Route handler |
| [`sveltekit`](sveltekit) | SvelteKit 3, Svelte 5 | npm | Form action |
| [`astro`](astro) | Astro 7, Node adapter | npm | Server-rendered page |
| [`react-vite`](react-vite) | React 19, Vite | npm | On your backend |
| [`vue`](vue) | Vue 3, Vite | npm | On your backend |
| [`plain-html`](plain-html) | One HTML file | Script tag | On your backend |

## Run one

1. Add your site in the [Shield dashboard](https://www.findip.net/shield) and copy its public site key (`pub_...`). Shield is free to use during the Free Preview.
2. In the example's folder, copy `.env.example` to `.env` and set the key.
3. `npm install`, then `npm run dev`.

Open the signup page, submit the form, and the visit appears in the dashboard with its risk score and reasons. In the browser's DevTools, the Network tab shows the `POST` requests to `shield/track`.

The examples also run without a key: Shield stays off and the form still works, so you can read the code path first.

## The pattern

Every example follows the same four steps.

1. **Start the SDK once, in the browser.** `init({ siteKey })` in code that runs on every page. The site key is public and comes from an environment variable.
2. **Let the SDK report the form.** With `autoDetectForms` on (the default), a submit of the signup form is reported as `signup_attempt`, with the form's shape and never its values. The examples call `track('signup_success')` for the outcome that only the app knows.
3. **Send the Shield session ID with the signup.** Either `getSession().sessionId` in a fetch body, or the hidden `findip_session` field that `sessionField: true` adds to a form post.
4. **Verify on the server before creating the account.** One `POST` to `https://shield.findip.net/v1/shield/sessions/verify` with the secret key returns the recommendation: `allow`, `monitor`, `challenge` or `block`. The examples reject `block`, accept `challenge` only once Shield has verified the challenge, and let the rest through, logging `monitor` and unknown results for review.

Step 4 is where the decision is made. The browser SDK reports risk signals and can add friction in the page; your server, holding the secret key, is the control a client cannot skip.

## For coding agents

[`skill/findip-shield/SKILL.md`](skill/findip-shield/SKILL.md) is a step-by-step recipe for adding Shield to an existing project: detect the framework, install, read the key from configuration, cover the forms, add server verification, verify.

- **Claude Code**: copy the `skill/findip-shield` folder to `.claude/skills/findip-shield` in your project (or to `~/.claude/skills/` for all projects), then ask Claude to add FindIP Shield.
- **Cursor**: copy [`.cursor/rules/findip-shield.mdc`](.cursor/rules/findip-shield.mdc) to `.cursor/rules/` in your project.
- **Any other agent**: point it at https://www.findip.net/docs/shield/agent-install.md.

## Privacy contract

- Shield never collects passwords, payment fields, form values, raw email addresses, phone numbers or keystrokes.
- Forms are described by their markup, never their contents: field types and labels, the submit button's text, the form's `id`, `name` and action path. For the dashboard's form preview the SDK can send a picture of the form with every value blanked; `captureFormSnapshots: false` or `strict` mode switches that off.
- A user ID or email passed to `identify()` is hashed in the browser, and encrypted with your site's key, before it is sent.
- The public site key (`pub_...`) is safe in browser code. The secret key (`sec_...`) stays on your server.
- Three privacy modes, `strict`, `balanced` and `advanced`, set how much the SDK stores and sends, and `setConsent()` connects it to your consent tool.
- Results are risk signals for your own decision. A visitor on a VPN is often a legitimate customer; the recommendation and its reasons are there so you can choose a proportionate response.

Details: [Data collection](https://www.findip.net/docs/shield/data-collection) · [Privacy modes](https://www.findip.net/docs/shield/privacy-modes) · [Cookies](https://www.findip.net/docs/shield/cookies)

## Documentation

- [Quickstart](https://www.findip.net/docs/shield/quickstart)
- [JavaScript SDK reference](https://www.findip.net/docs/shield/javascript-sdk)
- [Server verification](https://www.findip.net/docs/shield/server-verification)
- [In-page enforcement](https://www.findip.net/docs/shield/enforcement)
- [Identify users](https://www.findip.net/docs/shield/identify-users)
- [Events reference](https://www.findip.net/docs/shield/events)
- [All Shield docs](https://www.findip.net/docs/shield) · [as one Markdown file](https://www.findip.net/llms-full.txt)
- SDK source: [findip-net/findip-shield-js](https://github.com/findip-net/findip-shield-js)

## Support and security

Use [GitHub Issues](https://github.com/findip-net/findip-shield-examples/issues) for problems with an example. Report suspected vulnerabilities privately to [info@findip.net](mailto:info@findip.net).

## License

[MIT](LICENSE)
