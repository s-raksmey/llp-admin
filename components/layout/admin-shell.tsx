"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { mainNavigation } from "@/config/navigation";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function AdminShell({ children }: Readonly<{ children: ReactNode }>) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-background">
      <aside className="admin-fade-left fixed inset-y-0 left-0 hidden w-56 border-r border-[var(--border)] bg-[var(--panel)] px-4 py-4 lg:block">
        <Link className="flex items-center gap-3" href="/">
          <span className="h-4 w-4 rounded bg-blue-600 shadow-[0_6px_14px_rgb(37_99_235_/_0.22)]" />
          <span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
              Control Panel
            </span>
            <span className="mt-0.5 block text-base font-semibold text-foreground">
              LLP Admin
            </span>
          </span>
        </Link>

        <nav className="mt-6">
          <p className="mb-2 px-2 text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
            Workspace
          </p>
          {mainNavigation.map((item) => (
            <Link
              className={`relative mb-0.5 flex min-h-10 w-full items-center rounded-md border-l-2 px-3 py-2 text-[13px] font-semibold transition-colors ${
                pathname === item.href
                  ? "border-blue-600 bg-blue-500/10 text-blue-500"
                  : "border-transparent text-[var(--muted)] hover:bg-[var(--panel-strong)] hover:text-foreground"
              }`}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-56">
        <header className="admin-slide-down sticky top-0 z-10 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_88%,transparent)] px-3 py-2 backdrop-blur sm:px-4 lg:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 lg:hidden">
              <button
                aria-expanded={menuOpen}
                aria-label="Open navigation menu"
                className="admin-menu-button"
                onClick={() => setMenuOpen(true)}
                type="button"
              >
                <span />
                <span />
                <span />
              </button>
              <Link className="font-semibold text-foreground" href="/">
                LLP Admin
              </Link>
            </div>
            <div className="hidden text-xs font-medium text-[var(--muted)] lg:block">
              Administration / CMS
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link
                className="admin-interactive rounded-md border border-[var(--border)] px-2.5 py-1.5 text-xs font-medium text-[var(--muted)] hover:bg-[var(--panel-strong)] hover:text-foreground"
                href="/login"
              >
                Login
              </Link>
            </div>
          </div>
        </header>

        <main className="px-3 py-5 sm:px-5 sm:py-6 lg:px-6">{children}</main>
      </div>

      <button
        aria-label="Close navigation menu"
        className={`admin-mobile-backdrop lg:hidden ${menuOpen ? "is-open" : ""}`}
        onClick={() => setMenuOpen(false)}
        type="button"
      />
      <aside
        aria-label="Mobile navigation"
        className={`admin-mobile-drawer lg:hidden ${menuOpen ? "is-open" : ""}`}
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3.5">
          <Link
            className="flex items-center gap-2.5"
            href="/"
            onClick={() => setMenuOpen(false)}
          >
            <span className="h-3.5 w-3.5 rounded bg-blue-600" />
            <span>
              <strong className="block text-sm font-semibold">LLP Admin</strong>
              <small className="block text-[10px] text-[var(--muted)]">
                Administration
              </small>
            </span>
          </Link>
          <button
            aria-label="Close navigation menu"
            className="admin-drawer-close"
            onClick={() => setMenuOpen(false)}
            type="button"
          >
            ×
          </button>
        </div>
        <nav className="p-3">
          <p className="mb-2 px-2 text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
            Workspace
          </p>
          {mainNavigation.map((item) => (
            <Link
              className={`relative mb-0.5 flex min-h-10 w-full items-center rounded-md border-l-2 px-3 py-2 text-[13px] font-semibold transition-colors ${
                pathname === item.href
                  ? "border-blue-600 bg-blue-500/10 text-blue-500"
                  : "border-transparent text-[var(--muted)] hover:bg-[var(--panel-strong)] hover:text-foreground"
              }`}
              href={item.href}
              key={item.href}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </div>
  );
}
