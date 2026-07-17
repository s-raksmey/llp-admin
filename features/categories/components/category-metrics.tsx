import type { Category } from "@/features/categories/types";

type CategoryMetricsProps = {
  categories: Category[];
  activeCount: number;
  archivedCount: number;
};

export function CategoryMetrics({
  activeCount,
  archivedCount,
  categories,
}: Readonly<CategoryMetricsProps>) {
  return (
    <section className="admin-stagger grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard label="Total Categories" value={String(categories.length)} />
      <MetricCard label="Active" value={String(activeCount)} tone="success" />
      <MetricCard label="Archived" value={String(archivedCount)} />
      <MetricCard label="GraphQL API" value="Connected" tone="success" />
    </section>
  );
}

function MetricCard({
  label,
  value,
  tone = "default",
}: Readonly<{
  label: string;
  value: string;
  tone?: "default" | "success";
}>) {
  return (
    <article className="admin-panel p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
        {label}
      </p>
      <p
        className={`mt-2 text-2xl font-semibold tracking-normal ${
          tone === "success" ? "text-emerald-600" : "text-foreground"
        }`}
      >
        {value}
      </p>
    </article>
  );
}
