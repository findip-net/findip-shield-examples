<script setup lang="ts">
import { ref } from 'vue';
import { getSession, track } from '@findip/shield';

// Your own backend. It verifies the Shield session before creating the
// account; see the README for what that endpoint does.
const SIGNUP_URL = '/api/signup';

const email = ref('');
const password = ref('');
const status = ref<'idle' | 'sending' | 'done' | 'rejected' | 'error'>('idle');

async function onSubmit() {
  // Shield has already reported this submit as `signup_attempt`: it listens
  // for the form's submit event, so no track() call is needed for it.
  status.value = 'sending';

  // The Shield session ID travels with the request, so your server can ask
  // Shield about this session before it creates the account.
  const { sessionId } = getSession();

  try {
    const response = await fetch(SIGNUP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
        findip_session_id: sessionId,
      }),
    });

    if (response.ok) {
      // An outcome only your app knows about is tracked by name.
      // Context is limited to non-personal fields such as the plan.
      void track('signup_success', { plan: 'free' });
      status.value = 'done';
    } else {
      status.value = response.status === 403 ? 'rejected' : 'error';
    }
  } catch {
    status.value = 'error';
  }
}
</script>

<template>
  <p v-if="status === 'done'">Account created. Welcome!</p>

  <form v-else id="signup-form" name="signup" @submit.prevent="onSubmit">
    <label for="email">Email</label>
    <input id="email" v-model="email" name="email" type="email" autocomplete="email" required />

    <label for="password">Password</label>
    <input id="password" v-model="password" name="password" type="password" autocomplete="new-password" required minlength="8" />

    <button type="submit" :disabled="status === 'sending'">Create account</button>

    <p v-if="status === 'rejected'" role="alert">We could not complete this signup. Please contact support.</p>
    <p v-if="status === 'error'" role="alert">
      The signup request did not succeed. This example has no backend; point SIGNUP_URL at yours.
    </p>
  </form>
</template>
