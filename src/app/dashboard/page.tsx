import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Dashboard",
};

/**
 * Dashboard is protected server-side: if there is no demo session cookie we
 * redirect to the sign-in page before rendering anything.
 */
export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  return <DashboardClient profileId={session.profileId} />;
}
