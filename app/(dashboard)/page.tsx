import { dashboardStats, recentActivities } from "@/features/dashboard/data";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="admin-fade-up">
        <p className="text-sm font-semibold text-blue-600">Overview</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal text-foreground">
          Lecture Learning Platform
        </h1>
      </section>

      <section className="admin-stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {dashboardStats.map((stat) => (
          <article className="admin-panel p-5" key={stat.label}>
            <p className="text-sm text-[var(--muted)]">{stat.label}</p>
            <p className="mt-3 text-3xl font-semibold text-foreground">
              {stat.value}
            </p>
          </article>
        ))}
      </section>

      <section className="admin-panel admin-scale-in p-6">
        <h2 className="text-lg font-semibold text-foreground">
          Recent Activities
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Content and account changes will appear here.
        </p>

        <div className="mt-6 divide-y divide-[var(--border)]">
          {recentActivities.map((activity) => (
            <div
              className="flex items-center justify-between gap-4 py-4"
              key={activity.id}
            >
              <div>
                <p className="font-medium text-foreground">{activity.title}</p>
                <p className="text-sm text-[var(--muted)]">{activity.actor}</p>
              </div>
              <time className="shrink-0 text-sm text-[var(--muted)]">
                {activity.time}
              </time>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
