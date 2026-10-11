import 'server-only';

/**
 * Server verification for FindIP Shield.
 * Reference: https://www.findip.net/docs/shield/server-verification
 *
 * The browser SDK reports risk signals. The decision is made here, on the
 * server, with the secret key, before the sensitive action runs.
 */

const VERIFY_URL = 'https://shield.findip.net/v1/shield/sessions/verify';

export type ShieldDecision = 'allow' | 'review' | 'reject';

export interface ShieldVerdict {
  decision: ShieldDecision;
  /** Why this decision was reached, for your logs. */
  reason: string;
  recommendation?: string;
  riskScore?: number;
}

interface VerifyResponse {
  verified: boolean;
  risk_status?: 'available' | 'unknown';
  risk_score?: number;
  recommendation?: 'allow' | 'monitor' | 'challenge' | 'block';
  challenge_passed?: boolean;
}

export async function verifyShieldSession(
  sessionId: string | null | undefined,
  event: string,
): Promise<ShieldVerdict> {
  const secretKey = process.env.FINDIP_SHIELD_SECRET_KEY;
  if (!secretKey) return { decision: 'review', reason: 'secret_key_not_set' };
  if (!sessionId) return { decision: 'review', reason: 'no_session_id' };

  let result: VerifyResponse;
  try {
    const response = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ session_id: sessionId, event }),
      signal: AbortSignal.timeout(3000),
      cache: 'no-store',
    });
    if (!response.ok) return { decision: 'review', reason: `verify_http_${response.status}` };
    result = (await response.json()) as VerifyResponse;
  } catch {
    return { decision: 'review', reason: 'verify_unreachable' };
  }

  const verdict = { recommendation: result.recommendation, riskScore: result.risk_score };

  if (!result.verified) return { ...verdict, decision: 'review', reason: 'session_not_verified' };
  if (result.recommendation === 'block') return { ...verdict, decision: 'reject', reason: 'block' };
  if (result.recommendation === 'challenge') {
    // Accept a challenged session only once Shield has verified the challenge.
    return result.challenge_passed
      ? { ...verdict, decision: 'allow', reason: 'challenge_passed' }
      : { ...verdict, decision: 'reject', reason: 'challenge_not_passed' };
  }
  // `unknown` means Shield had no IP intelligence for the session: treat it as monitor, never as safe.
  if (result.risk_status === 'unknown') return { ...verdict, decision: 'review', reason: 'risk_unknown' };
  if (result.recommendation === 'monitor') return { ...verdict, decision: 'review', reason: 'monitor' };
  return { ...verdict, decision: 'allow', reason: 'allow' };
}
