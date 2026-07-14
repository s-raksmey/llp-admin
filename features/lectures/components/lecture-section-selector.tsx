import type { AdminLectureOutlineItem } from "@/features/lectures/data";

type LectureSectionSelectorProps = {
  items: AdminLectureOutlineItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function LectureSectionSelector({
  items,
  selectedId,
  onSelect,
}: Readonly<LectureSectionSelectorProps>) {
  const parents = items.filter((item) => !item.parentId);

  return (
    <aside className="admin-fade-up min-h-0 border-b border-[var(--border)] bg-[var(--panel)] p-4 xl:border-b-0 xl:border-r">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
        Lecture sections
      </p>

      {parents.length ? (
        <div className="space-y-2">
          {parents.map((parent, index) => {
            const children = items.filter((item) => item.parentId === parent.id);

            return (
              <div key={parent.id}>
                <button
                  className={`admin-interactive w-full rounded-lg px-3 py-2 text-left text-sm font-semibold ${
                    selectedId === parent.id
                      ? "bg-blue-600 text-white"
                      : "text-foreground hover:bg-[var(--panel-strong)]"
                  }`}
                  onClick={() => onSelect(parent.id)}
                  type="button"
                >
                  {index + 1}. {parent.title}
                </button>

                {children.length ? (
                  <div className="ml-4 mt-1 space-y-1 border-l border-[var(--border)] pl-2">
                    {children.map((child, childIndex) => (
                      <button
                        className={`admin-interactive w-full rounded-lg px-3 py-2 text-left text-sm ${
                          selectedId === child.id
                            ? "bg-blue-600 text-white"
                            : "text-[var(--muted)] hover:bg-[var(--panel-strong)] hover:text-foreground"
                        }`}
                        key={child.id}
                        onClick={() => onSelect(child.id)}
                        type="button"
                      >
                        {index + 1}.{childIndex + 1} {child.title}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--panel-strong)] p-4 text-sm leading-6 text-[var(--muted)]">
          Create outline items first before writing section papers.
        </div>
      )}
    </aside>
  );
}
