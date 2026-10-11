<script lang="ts">
  import { onMount } from 'svelte';
  import { init } from '@findip/shield';
  import { PUBLIC_FINDIP_SHIELD_SITE_KEY } from '$app/env/public';

  let { children } = $props();

  // onMount runs in the browser only, once for the root layout, so Shield
  // starts a single time and never during server rendering.
  onMount(() => {
    const siteKey = PUBLIC_FINDIP_SHIELD_SITE_KEY;
    if (!siteKey) return;

    init({
      siteKey,
      privacyMode: 'balanced',
      autoTrack: true, // page views
      autoDetectForms: true, // reports the signup form's submit as `signup_attempt`
      sessionField: true, // adds a hidden `findip_session` input to forms that POST to this origin
    });
  });
</script>

<main>
  {@render children()}
</main>

<style>
  main {
    font-family: system-ui, sans-serif;
    max-width: 420px;
    margin: 48px auto;
    padding: 0 16px;
  }
</style>
