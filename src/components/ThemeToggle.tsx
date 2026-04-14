"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextDark = saved ? saved === "dark" : prefersDark;
    root.classList.toggle("dark", nextDark);
    setIsDark(nextDark);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const nextDark = !isDark;
    root.classList.toggle("dark", nextDark);
    localStorage.setItem("theme", nextDark ? "dark" : "light");
    setIsDark(nextDark);
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="inline-flex h-8 items-center gap-1.5 rounded border border-borderTone bg-bg2/70 px-2.5 text-xs font-semibold text-mid transition-colors hover:border-blackish hover:text-blackish"
    >
      {mounted && isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
      {mounted && isDark ? "Light" : "Dark"}
    </button>
  );
}
