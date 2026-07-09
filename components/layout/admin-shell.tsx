import Link from "next/link";
import type { ReactNode } from "react";
import { mainNavigation } from "@/config/navigation";

export function AdminShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white px-5 py-6 lg:block">
        <Link className="block" href="/">
          <p className="text-sm font-medium text-teal-700">LLP</p>
          <p className="mt-1 text-lg font-semibold text-slate-950">Admin CMS</p>
        </Link>

        <nav className="mt-8 space-y-1">
          {mainNavigation.map((item) => (
            <Link
              className="block rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <Link className="font-semibold text-slate-950 lg:hidden" href="/">
              LLP Admin
            </Link>
            <div className="hidden text-sm text-slate-500 lg:block">
              Administration Dashboard
            </div>
            <Link
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              href="/login"
            >
              Login
            </Link>
          </div>
        </header>

        <main className="px-5 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
