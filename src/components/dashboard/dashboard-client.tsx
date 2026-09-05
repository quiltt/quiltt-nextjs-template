"use client";

import type { ConnectorSDKCallbackMetadata } from "@quiltt/react";
import { gql, QuilttButton, useQuery, useQuilttSession } from "@quiltt/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const CONNECTOR_ID = process.env.NEXT_PUBLIC_QUILTT_CONNECTOR_ID ?? "";
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

interface DashboardClientProps {
  profileId: string;
}

export function DashboardClient({ profileId }: DashboardClientProps) {
  const { session, importSession, revokeSession } = useQuilttSession();
  const router = useRouter();
  const [restoring, setRestoring] = useState(false);
  const [connectionId, setConnectionId] = useState<string>();

  // Restore the SDK session when the server cookie says we're signed in but the
  // SDK has no token in storage yet (e.g. after a hard refresh / new tab).
  useEffect(() => {
    if (session) {
      return;
    }

    let ignore = false;
    setRestoring(true);

    fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profileId }),
    })
      .then(async (response) => {
        const data = (await response.json()) as {
          token?: string;
          error?: string;
        };
        if (!response.ok || !data.token) {
          throw new Error(data.error ?? "Unable to restore the session.");
        }
        await importSession(data.token);
      })
      .catch(() => {
        if (!ignore) {
          router.replace("/sign-in");
        }
      })
      .finally(() => {
        if (!ignore) {
          setRestoring(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [session, profileId, importSession, router]);

  const handleExitSuccess = useCallback(
    (metadata: ConnectorSDKCallbackMetadata) => {
      setConnectionId(metadata?.connectionId);
    },
    [],
  );

  const handleSignOut = useCallback(async () => {
    // Clear the demo cookie and revoke the Quiltt Session token.
    await fetch("/api/session", { method: "DELETE" }).catch(() => undefined);
    await revokeSession().catch(() => undefined);
    router.push("/sign-in");
    router.refresh();
  }, [revokeSession, router]);

  if (!session) {
    if (restoring) {
      return (
        <main className="flex flex-1 items-center justify-center p-6">
          <p className="text-sm text-muted-foreground">Restoring session…</p>
        </main>
      );
    }
    // Redirect happens in the effect above; this is a safe fallback.
    return (
      <main className="flex flex-1 items-center justify-center p-6">
        <Link
          href="/sign-in"
          className={buttonVariants({ variant: "outline" })}
        >
          Sign in
        </Link>
      </main>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              Quiltt
            </Link>
            <span className="hidden font-mono text-xs text-muted-foreground sm:inline">
              {profileId}
            </span>
          </div>
          <nav className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={handleSignOut}
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              Sign out
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-10">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Connect an account and view it below. All data is read from the
            Quiltt GraphQL API using your Session token.
          </p>
        </div>

        <ConnectCard
          connectionId={connectionId}
          onExitSuccess={handleExitSuccess}
        />

        <AccountsCard />
      </main>
    </div>
  );
}

function ConnectCard({
  connectionId,
  onExitSuccess,
}: {
  connectionId?: string;
  onExitSuccess: (metadata: ConnectorSDKCallbackMetadata) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect an account</CardTitle>
        <CardDescription>
          {CONNECTOR_ID
            ? "Launches the Quiltt Connector in a modal. After connecting, the connection appears below."
            : "Set NEXT_PUBLIC_QUILTT_CONNECTOR_ID in .env.local to enable the Connector."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <QuilttButton
          connectorId={CONNECTOR_ID}
          onExitSuccess={onExitSuccess}
          disabled={!CONNECTOR_ID}
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "w-full sm:w-auto",
          )}
        >
          Connect account
        </QuilttButton>
        {connectionId ? (
          <p className="text-sm text-muted-foreground">
            Connected: <span className="font-mono text-xs">{connectionId}</span>
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

const PROFILE_QUERY = gql`
  query ProfileQuery {
    profile {
      id
      email
    }
  }
`;

interface ProfileData {
  profile?: {
    id: string;
    email?: string | null;
  } | null;
}

function useProfile() {
  return useQuery<ProfileData>(PROFILE_QUERY);
}

const ACCOUNTS_QUERY = gql`
  query AccountsQuery {
    accounts {
      id
      name
      balance {
        current
      }
    }
  }
`;

interface AccountsData {
  accounts?: Array<{
    id: string;
    name?: string | null;
    balance?: { current?: number | null } | null;
  } | null> | null;
}

function useAccounts() {
  return useQuery<AccountsData>(ACCOUNTS_QUERY);
}

function AccountsCard() {
  const { data: profile } = useProfile();
  const { data, loading, error } = useAccounts();
  const accounts = data?.accounts ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Accounts</CardTitle>
        <CardDescription>
          {profile?.profile?.email ??
            profile?.profile?.id ??
            "Your Quiltt Profile"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading accounts…</p>
        ) : error ? (
          <p className="text-sm text-destructive">
            Failed to load accounts: {error.message}
          </p>
        ) : accounts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No connected accounts yet. Connect one above to see it here.
          </p>
        ) : (
          <ul className="flex flex-col divide-y">
            {accounts.map((account) =>
              account ? (
                <li
                  key={account.id}
                  className="flex items-center justify-between py-3"
                >
                  <span className="text-sm">{account.name ?? account.id}</span>
                  <span className="font-mono text-sm tabular-nums">
                    {account.balance?.current == null
                      ? "—"
                      : currency.format(account.balance.current)}
                  </span>
                </li>
              ) : null,
            )}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
