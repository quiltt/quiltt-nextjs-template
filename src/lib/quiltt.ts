/**
 * Server-side Quiltt helpers.
 *
 * AUTH SEAM — This is the one place you wire Quiltt into your own identity
 * system. Quiltt Sessions are minted on YOUR server (never expose
 * `QUILTT_API_KEY_SECRET` to the browser) for an authenticated Profile.
 *
 * In a real app, replace the demo identity resolution with the user from your
 * own auth provider (Auth.js, Clerk, your database, etc.) and call
 * `issueQuilttSessionToken(user.quilttProfileId)`.
 *
 * NOTE: this module reads `process.env.QUILTT_API_KEY_SECRET` and must only be
 * imported from Server Components, Route Handlers, or Server Actions.
 *
 * ── Alternative: client-side, passwordless auth (no API key) ────────────────
 * The Quiltt React SDK also ships a Quiltt-hosted, magic-code auth flow that
 * runs entirely in the browser — no server minting required. This template
 * uses the server-side model above, but the option exists if you prefer Quiltt
 * to manage your end-users' identity/auth:
 *
 *   - `useQuilttSession()` (from `@quiltt/react/hooks`) exposes
 *     `identifySession({ email }, cb)` to start login/signup and
 *     `authenticateSession({ passcode }, cb)` to confirm the emailed code.
 *   - It requires a Quiltt `clientId` (`NEXT_PUBLIC_QUILTT_CLIENT_ID`) passed
 *     to `QuilttProvider` — not an API key secret.
 *   - Under the hood it uses `AuthAPI` against `https://auth.quiltt.io/v1/users/session`
 *     (singular). See the SDK docs / source for full details.
 *   https://quiltt.dev/get-started/tutorials/authentication
 */

export const QUILTT_AUTH_ENDPOINT = "https://auth.quiltt.io/v1/users/sessions";

export interface QuilttSessionResponse {
  token: string;
  userId: string;
  environmentId: string;
  expiresAt: string;
}

export class QuilttApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "QuilttApiError";
  }
}

/**
 * Exchange a Quiltt Profile ID for a Session token by calling the Quiltt Auth
 * API. Session tokens are Profile-scoped, last 24 hours, and are rate-limited
 * (10/hour, 20/day per Profile) — mint them on login and cache them.
 *
 * @see https://quiltt.dev/authentication/issuing-session-tokens
 */
export async function issueQuilttSessionToken(
  profileId: string,
): Promise<QuilttSessionResponse> {
  const apiKey = process.env.QUILTT_API_KEY_SECRET;

  if (!apiKey) {
    throw new Error(
      "Missing QUILTT_API_KEY_SECRET. Copy .env.example to .env.local and add your Quiltt API key secret.",
    );
  }

  const response = await fetch(QUILTT_AUTH_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId: profileId }),
  });

  if (!response.ok) {
    let message = `Quiltt Auth API error (${response.status})`;
    try {
      const body = (await response.json()) as { message?: string };
      if (body?.message) {
        message = body.message;
      }
    } catch {
      // ignore JSON parse errors; fall back to the status-based message
    }
    throw new QuilttApiError(message, response.status);
  }

  return (await response.json()) as QuilttSessionResponse;
}
