import { defineConfig, envField } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  // Pages are static by default; the signup page opts into server rendering.
  adapter: node({ mode: 'standalone' }),
  env: {
    schema: {
      // Public site key: available to browser code.
      PUBLIC_FINDIP_SHIELD_SITE_KEY: envField.string({ context: 'client', access: 'public', optional: true }),
      // Secret key for server verification: server code only, read at run time.
      FINDIP_SHIELD_SECRET_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
});
