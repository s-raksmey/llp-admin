import { dashboardStats, recentActivities } from "@/features/dashboard/data";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-medium text-teal-700">Overview</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">
          Lecture Learning Platform
        </h1>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {dashboardStats.map((stat) => (
          <article
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            key={stat.label}
          >
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">
              {stat.value}
            </p>
          </article>
        ))}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">
          Recent Activities
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Content and account changes will appear here.
        </p>

        <div className="mt-6 divide-y divide-slate-100">
          {recentActivities.map((activity) => (
            <div
              className="flex items-center justify-between gap-4 py-4"
              key={activity.id}
            >
              <div>
                <p className="font-medium text-slate-900">{activity.title}</p>
                <p className="text-sm text-slate-500">{activity.actor}</p>
              </div>
              <time className="shrink-0 text-sm text-slate-500">
                {activity.time}
              </time>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
