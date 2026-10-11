import { NextResponse } from 'next/server';
import { verifyShieldSession } from '@/lib/shield-verify';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    email?: string;
    password?: string;
    findip_session_id?: string;
  } | null;

  if (!body?.email || !body.password) {
    return NextResponse.json({ error: 'email_and_password_required' }, { status: 400 });
  }

  // Verify the Shield session before creating the account.
  const verdict = await verifyShieldSession(body.findip_session_id, 'signup_attempt');
  console.log('[shield] signup', verdict);

  if (verdict.decision === 'reject') {
    return NextResponse.json({ error: 'signup_not_completed' }, { status: 403 });
  }

  // decision === 'review': the signup goes ahead; this is where you would flag
  // the new account for a closer look (email confirmation, manual review).

  // ... create the account here ...

  return NextResponse.json({ ok: true });
}
