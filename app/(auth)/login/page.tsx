export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <section className="admin-panel admin-scale-in w-full max-w-sm p-8">
        <p className="text-sm font-semibold text-blue-600">LLP Admin</p>
        <h1 className="mt-2 text-2xl font-semibold text-foreground">Sign in</h1>
        <form className="mt-8 space-y-5">
          <label className="block text-sm font-medium text-[var(--muted)]">
            Email
            <input
              className="mt-2 h-11 w-full rounded-md border border-[var(--border)] bg-[var(--panel-strong)] px-3 text-foreground outline-none transition focus:border-blue-600"
              name="email"
              type="email"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--muted)]">
            Password
            <input
              className="mt-2 h-11 w-full rounded-md border border-[var(--border)] bg-[var(--panel-strong)] px-3 text-foreground outline-none transition focus:border-blue-600"
              name="password"
              type="password"
            />
          </label>
          <button
            className="admin-interactive h-11 w-full rounded-md bg-foreground px-4 text-sm font-semibold text-background hover:opacity-85"
            type="submit"
          >
            Sign in
          </button>
        </form>
      </section>
    </main>
  );
}
