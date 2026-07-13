"use client";

import { useEffect } from "react";

export function ThemeProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("theme");
      const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      const theme = savedTheme || document.documentElement.dataset.theme || preferredTheme;
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
      document.cookie = `theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      document.documentElement.dataset.theme = "light";
      document.documentElement.style.colorScheme = "light";
    }
  }, []);

  return children;
}
