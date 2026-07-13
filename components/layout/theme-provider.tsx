"use client";

import { useEffect } from "react";

export function ThemeProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("theme");
      const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      document.documentElement.dataset.theme = savedTheme || preferredTheme;
    } catch {
      document.documentElement.dataset.theme = "light";
    }
  }, []);

  return children;
}
