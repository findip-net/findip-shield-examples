import type { Plugin } from 'vue';
import { init } from '@findip/shield';

let started = false;

/**
 * Vue plugin that starts FindIP Shield once for the whole app.
 * The SDK runs in the browser only; in a server-rendered app (Nuxt), register
 * it as a client-only plugin.
 */
export const shield: Plugin = {
  install() {
    const siteKey = import.meta.env.VITE_FINDIP_SHIELD_SITE_KEY as string | undefined;
    if (started || !siteKey || typeof window === 'undefined') return;
    started = true;

    init({
      siteKey,
      privacyMode: 'balanced',
      autoTrack: true, // page views
      autoDetectForms: true, // reports the signup form's submit as `signup_attempt`
    });
  },
};
