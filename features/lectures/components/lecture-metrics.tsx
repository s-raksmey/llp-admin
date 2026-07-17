import type { AdminLecture } from "@/features/lectures/data";

type LectureMetricsProps = {
  lectures: AdminLecture[];
};

export function LectureMetrics({ lectures }: Readonly<LectureMetricsProps>) {
  const publishedCount = lectures.filter(
    (lecture) => lecture.status === "PUBLISHED",
  ).length;

  return (
    <section className="admin-stagger grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard label="Total Courses" value="3" />
      <MetricCard label="Total Lectures" value={String(lectures.length)} />
      <MetricCard label="Published Lectures" value={String(publishedCount)} />
      <MetricCard label="GraphQL Sync" value="Ready" tone="success" />
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
