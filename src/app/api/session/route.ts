import { NextResponse } from "next/server";

import { issueQuilttSessionToken, QuilttApiError } from "@/lib/quiltt";
import { SESSION_COOKIE_NAME } from "@/lib/session";

/**
 * POST /api/session
 *
 * Demo sign-in. Mints a Quiltt Session token for a Profile and records the
 * session in an HttpOnly cookie.
 *
 * Body (optional): { "profileId": "p_..." }
 * Resolves the Profile from the request body, falling back to the
 * `QUILTT_USER_ID` env var. Replace this demo resolution with your own auth
 * provider (see src/lib/quiltt.ts).
 */
export async function POST(request: Request) {
  let requestedProfileId: string | undefined;

  try {
    const body = (await request.json()) as { profileId?: string };
    requestedProfileId = body?.profileId;
  } catch {
    // no/invalid JSON body is fine — fall back to the env var
  }

  const profileId =
    requestedProfileId?.trim() || process.env.QUILTT_USER_ID?.trim();

  if (!profileId) {
    return NextResponse.json(
      {
        error:
          "No profileId provided and QUILTT_USER_ID is not set. Add QUILTT_USER_ID to .env.local or pass a profileId.",
      },
      { status: 400 },
    );
  }

  try {
    const { token, userId, expiresAt } =
      await issueQuilttSessionToken(profileId);

    const response = NextResponse.json({
      token,
      profileId: userId,
      expiresAt,
    });

    response.cookies.set(
      SESSION_COOKIE_NAME,
      JSON.stringify({ profileId: userId }),
      {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        // Keep the cookie roughly aligned with the 24h Session token lifetime.
        maxAge: 60 * 60 * 24,
      },
    );

    return response;
  } catch (error) {
    if (error instanceof QuilttApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }

    console.error("Failed to issue Quiltt Session token:", error);
    return NextResponse.json(
      { error: "Failed to issue a Quiltt Session token." },
      { status: 500 },
    );
  }
}

/** DELETE /api/session — demo sign-out. Clears the session cookie. */
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  return response;
}
