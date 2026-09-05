import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    title: "Quiltt React SDK",
    description:
      "QuilttProvider, QuilttButton, and useQuilttSession wired up so you can launch the Connector and fetch data with a few lines of code.",
  },
  {
    title: "Server-side sessions",
    description:
      "A Route Handler mints Profile-scoped Quiltt Session tokens behind your QUILTT_API_KEY_SECRET — never exposed to the browser.",
  },
  {
    title: "Type-safe GraphQL",
    description:
      "GraphQL Codegen preconfigured against the Quiltt GraphQL API, with sample operations you can generate types from.",
  },
  {
    title: "Modern stack",
    description:
      "Next.js 16 (App Router, React 19), TypeScript, Tailwind CSS v4, shadcn/ui, Biome, and pnpm — all latest stable tooling.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold tracking-tight"
          >
            Quiltt
            <span className="text-muted-foreground text-base font-normal">
              × Next.js
            </span>
          </Link>
          <nav className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="outline" size="sm">
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto grid w-full max-w-5xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col gap-6">
            <p className="text-sm font-medium text-muted-foreground">
              A template for building on the Quiltt platform
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Connect financial accounts, then build on the data.
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Start a Next.js app that launches the Quiltt Connector, issues
              secure Session tokens server-side, and reads accounts over the
              Quiltt GraphQL API.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="/sign-in">Open the demo</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a
                  href="https://quiltt.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Quiltt docs
                </a>
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <p className="text-sm font-medium">Try it in 3 steps</p>
              <ol className="mt-4 flex list-none flex-col gap-4">
                <li className="text-sm text-muted-foreground">
                  <span className="text-foreground font-medium">1 ·</span> Add
                  your credentials to{" "}
                  <code className="font-mono text-xs">.env.local</code>
                </li>
                <li className="text-sm text-muted-foreground">
                  <span className="text-foreground font-medium">2 ·</span> Sign
                  in with a Quiltt Profile
                </li>
                <li className="text-sm text-muted-foreground">
                  <span className="text-foreground font-medium">3 ·</span>{" "}
                  Connect an account and watch it appear on the dashboard
                </li>
              </ol>
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-5xl gap-4 px-6 pb-20 sm:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <CardTitle className="text-base">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            Quiltt Next.js Template · MIT
          </p>
          <div className="flex items-center gap-4 text-sm">
            <a
              className="text-muted-foreground hover:text-foreground"
              href="https://quiltt.dev"
              target="_blank"
              rel="noopener noreferrer"
            >
              Documentation
            </a>
            <a
              className="text-muted-foreground hover:text-foreground"
              href="https://github.com/quiltt/quiltt-sdks"
              target="_blank"
              rel="noopener noreferrer"
            >
              SDKs
            </a>
            <a
              className="text-muted-foreground hover:text-foreground"
              href="https://dashboard.quiltt.dev"
              target="_blank"
              rel="noopener noreferrer"
            >
              Dashboard
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
