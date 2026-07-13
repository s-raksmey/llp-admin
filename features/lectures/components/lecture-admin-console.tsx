"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { OutlineBuilder } from "@/components/ui/outline-builder";
import type { AdminLecture } from "@/features/lectures/data";
import { defaultLessonOutline, parseOutline } from "@/lib/outline";

const statusStyles = {
  DRAFT: "text-amber-600 bg-amber-50 border-amber-200",
  PUBLISHED: "text-emerald-600 bg-emerald-50 border-emerald-200",
  SCHEDULED: "text-blue-600 bg-blue-50 border-blue-200",
  ARCHIVED: "text-slate-600 bg-slate-100 border-slate-200",
} as const;

const statusLabels = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  SCHEDULED: "Scheduled",
  ARCHIVED: "Archived",
} as const;

export type LectureAdminConsoleProps = {
  initialLectures: AdminLecture[];
};

export function LectureAdminConsole({ initialLectures }: LectureAdminConsoleProps) {
  const [lectures, setLectures] = useState<AdminLecture[]>(initialLectures);
  const [query, setQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [draftOutline, setDraftOutline] = useState(defaultLessonOutline);

  const filteredLectures = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return lectures;
    }

    return lectures.filter((lecture) =>
      [lecture.title, lecture.category, lecture.id, lecture.status]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [lectures, query]);

  function createDraft(formData: FormData) {
    const title = String(formData.get("title") ?? "").trim();
    const category = String(formData.get("category") ?? "General").trim();

    if (!title) {
      return;
    }

    const nextIndex = lectures.length + 1;
    const lecture: AdminLecture = {
      id: `MOD_${nextIndex}.1`,
      courseId: category.toLowerCase().replaceAll(" ", "-"),
      title,
      slug: title.toLowerCase().replaceAll(" ", "-"),
      status: "DRAFT",
      category,
      description: "New draft lecture ready for rich text content.",
      readingTime: "5 minutes",
      updatedAt: "Now",
      tableOfContents: parseOutline(draftOutline),
    };

    setLectures((current) => [lecture, ...current]);
    setIsCreating(false);
    setDraftOutline(defaultLessonOutline);
  }

  function removeLecture(id: string) {
    setLectures((current) => current.filter((lecture) => lecture.id !== id));
  }

  return (
    <div className="space-y-8">
      <section className="admin-stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Courses" value="3" />
        <MetricCard label="Total Lectures" value={String(lectures.length)} />
        <MetricCard
          label="Published Lectures"
          value={String(
            lectures.filter((lecture) => lecture.status === "PUBLISHED").length,
          )}
        />
        <MetricCard label="GraphQL Sync" value="Ready" tone="success" />
      </section>

      <section>
        <div className="admin-panel admin-scale-in overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-[var(--border)] p-5 sm:flex-row sm:items-end sm:justify-between">
            <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
              Search catalog
              <input
                className="h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--panel)] px-3 text-sm font-medium normal-case tracking-normal text-foreground outline-none transition focus:border-blue-500 sm:w-80"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Title, category, status..."
                value={query}
              />
            </label>

            <button
              className="admin-interactive inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-700"
              onClick={() => {
                setDraftOutline(defaultLessonOutline);
                setIsCreating(true);
              }}
              type="button"
            >
              + Create module
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead className="border-b border-[var(--border)] bg-[var(--panel-strong)] text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                <tr>
                  <th className="px-5 py-4">Index Key</th>
                  <th className="px-5 py-4">Module Title</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filteredLectures.map((lecture, index) => (
                  <tr
                    className="admin-row-enter transition hover:bg-[var(--panel-strong)]"
                    key={lecture.id}
                    style={{ animationDelay: `${140 + index * 55}ms` }}
                  >
                    <td className="px-5 py-4 font-mono text-xs text-[var(--muted)]">
                      {lecture.id}
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        className="admin-interactive inline-block text-left font-semibold text-foreground hover:text-blue-600"
                        href={`/lectures/${encodeURIComponent(lecture.slug)}`}
                      >
                        {lecture.title}
                      </Link>
                      <p className="mt-1 text-xs text-[var(--muted)]">
                        Updated {lecture.updatedAt}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-md bg-[var(--panel-strong)] px-2 py-1 text-xs font-semibold text-[var(--muted)]">
                        {lecture.category}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${statusStyles[lecture.status]}`}
                      >
                        {statusLabels[lecture.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-3">
                        <Link
                          className="admin-interactive inline-block font-bold text-blue-600 hover:text-blue-700"
                          href={`/lectures/${encodeURIComponent(lecture.slug)}`}
                        >
                          Configure
                        </Link>
                        <button
                          className="admin-interactive font-semibold text-[var(--muted)] hover:text-red-600"
                          onClick={() => removeLecture(lecture.id)}
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {isCreating ? (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
          <form
            action={createDraft}
            className="admin-panel admin-scale-in flex max-h-[calc(100dvh-2rem)] w-full max-w-6xl flex-col overflow-hidden"
          >
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[var(--border)] px-6 py-5">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Append new record
                </p>
                <h2 className="mt-1 text-xl font-bold text-foreground">
                  Create Module
                </h2>
              </div>
              <button
                className="admin-interactive rounded-md px-2 py-1 text-sm font-bold text-[var(--muted)] hover:bg-[var(--panel-strong)] hover:text-foreground"
                onClick={() => setIsCreating(false)}
                type="button"
              >
                X
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                    Module title
                    <input
                      className="h-11 rounded-lg border border-[var(--border)] bg-[var(--panel-strong)] px-3 text-sm font-medium normal-case tracking-normal text-foreground outline-none focus:border-blue-500"
                      name="title"
                      placeholder="Advanced data spaces"
                      required
                    />
                  </label>

                  <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                    Category domain
                    <select
                      className="h-11 rounded-lg border border-[var(--border)] bg-[var(--panel-strong)] px-3 text-sm font-medium normal-case tracking-normal text-foreground outline-none focus:border-blue-500"
                      name="category"
                    >
                      <option>Core UI</option>
                      <option>Data Engineering</option>
                      <option>Media Library</option>
                    </select>
                  </label>
                </div>

                <aside className="rounded-lg border border-[var(--border)] bg-[var(--panel-strong)] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                    Module structure
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                    Create the lesson sequence here first. Each item becomes a module
                    section, and sub-items stay attached to the correct lesson.
                  </p>
                </aside>
              </div>

              <div className="mt-5">
                <OutlineBuilder onChange={setDraftOutline} value={draftOutline} />
              </div>
            </div>

            <div className="flex shrink-0 justify-end gap-2 border-t border-[var(--border)] bg-[var(--panel)] px-6 py-4">
              <button
                className="admin-interactive rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted)] hover:bg-[var(--panel-strong)]"
                onClick={() => setIsCreating(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="admin-interactive rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                type="submit"
              >
                Create module
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
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
    <article className="admin-panel p-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
        {label}
      </p>
      <p
        className={`mt-3 text-3xl font-semibold tracking-normal ${
          tone === "success" ? "text-emerald-600" : "text-foreground"
        }`}
      >
        {value}
      </p>
    </article>
  );
}






