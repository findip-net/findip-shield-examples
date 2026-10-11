# Contributing

Small fixes and new framework examples are welcome. Open an issue before starting a large change.

An example stays minimal: one signup form, the SDK started once with the site key from configuration, and server verification where the framework has a server. It uses only API that the [Shield documentation](https://www.findip.net/docs/shield) describes, and never contains a real key.

Before submitting a pull request, in each example you changed:

```bash
npm install
npm run build
```

If you change `skill/findip-shield/SKILL.md`, make the same change in `.cursor/rules/findip-shield.mdc`; CI checks that the two match.

Official maintainer commits, pushes, and releases follow the [FindIP public maintenance identity policy](https://github.com/findip-net/.github/blob/main/CONTRIBUTING.md#maintainer-publishing-identity).
