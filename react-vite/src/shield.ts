import { init } from '@findip/shield';

let started = false;

/** Starts FindIP Shield once for the whole app. */
export function startShield(): void {
  const siteKey = import.meta.env.VITE_FINDIP_SHIELD_SITE_KEY as string | undefined;
  if (started || !siteKey) return;
  started = true;

  init({
    siteKey,
    privacyMode: 'balanced',
    autoTrack: true, // page views
    autoDetectForms: true, // reports the signup form's submit as `signup_attempt`
  });
}
