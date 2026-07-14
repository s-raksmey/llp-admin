import Link from "next/link";
import type { AdminLecture } from "@/features/lectures/data";
import {
  lectureStatusLabels,
  lectureStatusStyles,
} from "@/features/lectures/utils";

type LectureTableProps = {
  lectures: AdminLecture[];
  query: string;
  onCreate: () => void;
  onDelete: (lectureId: string) => void;
  onQueryChange: (query: string) => void;
};

export function LectureTable({
  lectures,
  query,
  onCreate,
  onDelete,
  onQueryChange,
}: Readonly<LectureTableProps>) {
  return (
    <section>
      <div className="admin-panel admin-scale-in overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-[var(--border)] p-5 sm:flex-row sm:items-end sm:justify-between">
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
            Search catalog
            <input
              className="h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--panel)] px-3 text-sm font-medium normal-case tracking-normal text-foreground outline-none transition focus:border-blue-500 sm:w-80"
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Title, category, status..."
              value={query}
            />
          </label>

          <button
            className="admin-interactive inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-700"
            onClick={onCreate}
            type="button"
          >
            + Create module
          </button>
        </div>

        <div>
          <table className="w-full table-fixed border-collapse text-left text-sm">
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
              {lectures.map((lecture, index) => (
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
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${lectureStatusStyles[lecture.status]}`}
                    >
                      {lectureStatusLabels[lecture.status]}
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
                        onClick={() => onDelete(lecture.id)}
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
  );
}
