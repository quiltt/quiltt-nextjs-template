import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QuilttProviders } from "@/components/quiltt-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Quiltt Next.js Template",
    template: "%s | Quiltt Next.js Template",
  },
  description:
    "A modern starter for building financial data products on the Quiltt platform with Next.js, the Quiltt React SDK, and type-safe GraphQL.",
};

// Apply the saved theme before first paint to avoid a flash of the wrong theme.
const themeInitScript = `(function () {
  try {
    var stored = localStorage.getItem("theme");
    var dark =
      stored === "dark" ||
      ((!stored || stored === "system") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
  } catch (e) {}
})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static theme init script, no interpolated user input */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <QuilttProviders>{children}</QuilttProviders>
      </body>
    </html>
  );
}
