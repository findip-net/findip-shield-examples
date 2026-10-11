<script lang="ts">
  import { enhance } from '$app/forms';
  import { track } from '@findip/shield';

  let { form } = $props();

  // An outcome only your app knows about is tracked by name.
  // Context is limited to non-personal fields such as the plan.
  $effect(() => {
    if (form?.success) void track('signup_success', { plan: 'free' });
  });
</script>

<h1>Create your account</h1>

{#if form?.success}
  <p>Account created. Welcome!</p>
{:else}
  <!--
    A normal form post. Shield reports the submit as `signup_attempt` and,
    because of `sessionField: true`, adds the hidden `findip_session` input
    that the server action reads.
  -->
  <form id="signup-form" name="signup" method="POST" use:enhance>
    <label for="email">Email</label>
    <input id="email" name="email" type="email" autocomplete="email" required />

    <label for="password">Password</label>
    <input id="password" name="password" type="password" autocomplete="new-password" required minlength="8" />

    <button type="submit">Create account</button>

    {#if form?.error === 'signup_not_completed'}
      <p role="alert">We could not complete this signup. Please contact support.</p>
    {:else if form?.error}
      <p role="alert">Please enter an email and a password.</p>
    {/if}
  </form>
{/if}

<style>
  input {
    display: block;
    width: 100%;
    margin: 4px 0 12px;
    padding: 8px;
    box-sizing: border-box;
  }
</style>
