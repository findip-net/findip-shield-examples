import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { verifyShieldSession } from '../../server/shield-verify';

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');

    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
      return fail(400, { error: 'email_and_password_required' });
    }

    // Verify the Shield session before creating the account. The session ID
    // arrives in the hidden field the SDK added to the form.
    const sessionId = data.get('findip_session');
    const verdict = await verifyShieldSession(typeof sessionId === 'string' ? sessionId : null, 'signup_attempt');
    console.log('[shield] signup', verdict);

    if (verdict.decision === 'reject') {
      return fail(403, { error: 'signup_not_completed' });
    }

    // decision === 'review': the signup goes ahead; this is where you would flag
    // the new account for a closer look (email confirmation, manual review).

    // ... create the account here ...

    return { success: true };
  },
};
