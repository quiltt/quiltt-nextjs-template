"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

/**
 * Lightweight dark-mode toggle. Persists the choice to localStorage and
 * applies/removes the `dark` class on <html>. The initial theme is applied
 * by an inline script in the root layout to avoid a flash on load.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setTheme(
      document.documentElement.classList.contains("dark") ? "dark" : "light",
    );
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
  };

  return (
    <Button type="button" variant="ghost" size="sm" onClick={toggle}>
      {theme === "dark" ? "Light" : "Dark"}
    </Button>
  );
}
