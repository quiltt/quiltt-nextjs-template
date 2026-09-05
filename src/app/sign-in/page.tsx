import type { Metadata } from "next";
import Link from "next/link";

import { SignInForm } from "@/components/sign-in-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function SignInPage() {
  const session = await getSession();
  const demoProfileId = process.env.QUILTT_USER_ID?.trim() ?? "";

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Sign in with a Quiltt Profile to mint a Session token and open the
            demo dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm defaultProfileId={demoProfileId} />
        </CardContent>
        <CardFooter className="flex-col items-start gap-3">
          {session ? (
            <p className="text-sm text-muted-foreground">
              You&apos;re signed in as{" "}
              <span className="font-mono text-xs">{session.profileId}</span>.
            </p>
          ) : null}
          <div className="flex w-full items-center justify-between text-sm">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground"
            >
              Back home
            </Link>
            {session ? (
              <Button asChild size="sm">
                <Link href="/dashboard">Go to dashboard</Link>
              </Button>
            ) : null}
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
