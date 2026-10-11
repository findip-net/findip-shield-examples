import { defineEnvVars } from '@sveltejs/kit/env';

const optional = (value: string | undefined) => value || undefined;

export const variables = defineEnvVars({
  // Public site key: sent to the browser, where the SDK runs.
  PUBLIC_FINDIP_SHIELD_SITE_KEY: { public: true, schema: optional },
  // Secret key for server verification: private, so only server code can import it.
  FINDIP_SHIELD_SECRET_KEY: { schema: optional },
});
