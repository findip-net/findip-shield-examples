import { useState, type FormEvent } from 'react';
import { getSession, track } from '@findip/shield';

// Your own backend. It verifies the Shield session before creating the
// account; see the README for what that endpoint does.
const SIGNUP_URL = '/api/signup';

const field = { display: 'block', width: '100%', margin: '4px 0 12px', padding: 8, boxSizing: 'border-box' } as const;

export function SignupForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'rejected' | 'error'>('idle');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    // Shield has already reported this submit as `signup_attempt`: it listens
    // for the form's submit event, so no track() call is needed for it.
    event.preventDefault();
    setStatus('sending');

    const form = new FormData(event.currentTarget);
    // The Shield session ID travels with the request, so your server can ask
    // Shield about this session before it creates the account.
    const { sessionId } = getSession();

    try {
      const response = await fetch(SIGNUP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.get('email'),
          password: form.get('password'),
          findip_session_id: sessionId,
        }),
      });

      if (response.ok) {
        // An outcome only your app knows about is tracked by name.
        // Context is limited to non-personal fields such as the plan.
        void track('signup_success', { plan: 'free' });
        setStatus('done');
      } else {
        setStatus(response.status === 403 ? 'rejected' : 'error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') return <p>Account created. Welcome!</p>;

  return (
    <form id="signup-form" name="signup" onSubmit={onSubmit}>
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" autoComplete="email" required style={field} />

      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} style={field} />

      <button type="submit" disabled={status === 'sending'}>
        Create account
      </button>

      {status === 'rejected' && <p role="alert">We could not complete this signup. Please contact support.</p>}
      {status === 'error' && (
        <p role="alert">The signup request did not succeed. This example has no backend; point SIGNUP_URL at yours.</p>
      )}
    </form>
  );
}
