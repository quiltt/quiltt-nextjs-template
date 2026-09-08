import { cookies } from "next/headers";

/**
 * The HttpOnly cookie used to remember the signed-in Profile across requests.
 *
 * NOTE: This is a *demo* session. It only records which Quiltt Profile the
 * browser has signed in as — it is not a security boundary. Replace this with
 * your own session management when you plug in a real identity provider.
 */
export const SESSION_COOKIE_NAME = "quiltt_session";

export interface SessionPayload {
  profileId: string;
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as SessionPayload;
    if (parsed?.profileId) {
      return parsed;
    }
  } catch {
    // ignore malformed cookies
  }

  return null;
}
