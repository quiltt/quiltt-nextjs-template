"use client";

import { QuilttProvider } from "@quiltt/react";
import type { ReactNode } from "react";

/**
 * Mounts Quiltt once for the whole app.
 *
 * QuilttProvider composes QuilttSettingsProvider + QuilttAuthProvider. It:
 *  - creates the Quiltt Apollo Client (which automatically attaches the
 *    current Session token to GraphQL requests), and
 *  - provides <QuilttButton /> / <QuilttContainer /> / useQuilttSession()
 *    with the SDK's session context.
 *
 * No `clientId` is required here because this template mints Session tokens
 * server-side. `clientId` is only needed if you use Quiltt's client-side,
 * passwordless Auth flow instead.
 */
export function QuilttProviders({ children }: { children: ReactNode }) {
  return <QuilttProvider>{children}</QuilttProvider>;
}
