'use client';

import { useEffect } from 'react';
import { init } from '@findip/shield';

let started = false;

/**
 * Starts FindIP Shield once, in the browser. The SDK reads `window` and
 * `document`, so it runs inside useEffect and never during server rendering.
 */
export function Shield() {
  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_FINDIP_SHIELD_SITE_KEY;
    if (started || !siteKey) return;
    started = true;

    init({
      siteKey,
      privacyMode: 'balanced',
      autoTrack: true, // page views
      autoDetectForms: true, // reports the signup form's submit as `signup_attempt`
    });
  }, []);

  return null;
}
