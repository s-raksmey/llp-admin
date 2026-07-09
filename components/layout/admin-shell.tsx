import Link from "next/link";
import type { ReactNode } from "react";
import { mainNavigation } from "@/config/navigation";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function AdminShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen bg-background">
      <aside className="admin-fade-left fixed inset-y-0 left-0 hidden w-64 border-r border-[var(--border)] bg-[var(--panel)] px-5 py-6 lg:block">
        <Link className="flex items-center gap-3" href="/">
          <span className="h-5 w-5 rounded-md bg-blue-600 shadow-[0_8px_18px_rgb(37_99_235_/_0.24)]" />
          <span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
              Control Panel
            </span>
            <span className="mt-1 block text-lg font-semibold text-foreground">
              LLP Admin
            </span>
          </span>
        </Link>

        <nav className="mt-8 space-y-1">
          {mainNavigation.map((item) => (
            <Link
              className="admin-interactive block rounded-md px-3 py-2 text-sm font-medium text-[var(--muted)] hover:bg-[var(--panel-strong)] hover:text-foreground"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="admin-slide-down sticky top-0 z-10 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_88%,transparent)] px-5 py-4 backdrop-blur lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <Link className="font-semibold text-foreground lg:hidden" href="/">
              LLP Admin
            </Link>
            <div className="hidden text-sm text-[var(--muted)] lg:block">
              Administration Dashboard // CMS
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link
                className="admin-interactive rounded-md border border-[var(--border)] px-3 py-2 text-sm font-medium text-[var(--muted)] hover:bg-[var(--panel-strong)] hover:text-foreground"
                href="/login"
              >
                Login
              </Link>
            </div>
          </div>
        </header>

        <main className="px-5 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
