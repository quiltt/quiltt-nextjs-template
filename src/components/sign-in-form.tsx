"use client";

import { useQuilttSession } from "@quiltt/react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SignInFormProps {
  /** The demo Profile ID from QUILTT_USER_ID, if configured. */
  defaultProfileId?: string;
}

export function SignInForm({ defaultProfileId = "" }: SignInFormProps) {
  const [profileId, setProfileId] = useState(defaultProfileId);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const { importSession } = useQuilttSession();
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId: profileId.trim() || undefined }),
      });

      const data = (await response.json()) as {
        token?: string;
        error?: string;
      };

      if (!response.ok || !data.token) {
        setError(data.error ?? "Sign in failed. Please try again.");
        return;
      }

      // Store the Session token in the SDK (persisted for reuse) then head to
      // the dashboard, which is guarded server-side by the session cookie.
      await importSession(data.token);
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="profileId">Profile ID</Label>
        <Input
          id="profileId"
          name="profileId"
          value={profileId}
          onChange={(event) => setProfileId(event.target.value)}
          placeholder="p_…"
          autoComplete="off"
          className="font-mono"
        />
        <p className="text-xs text-muted-foreground">
          Leave blank to use the demo Profile from{" "}
          <code className="font-mono">QUILTT_USER_ID</code>.
        </p>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
