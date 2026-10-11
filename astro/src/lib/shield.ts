import { init } from '@findip/shield';
import { PUBLIC_FINDIP_SHIELD_SITE_KEY } from 'astro:env/client';

let started = false;

/** Starts FindIP Shield once per page. Browser only: call it from a <script>. */
export function startShield(): void {
  if (started || !PUBLIC_FINDIP_SHIELD_SITE_KEY) return;
  started = true;

  init({
    siteKey: PUBLIC_FINDIP_SHIELD_SITE_KEY,
    privacyMode: 'balanced',
    autoTrack: true, // page views
    autoDetectForms: true, // reports the signup form's submit as `signup_attempt`
    sessionField: true, // adds a hidden `findip_session` input to forms that POST to this origin
  });
}
