import { OutlineBuilder } from "@/components/ui/outline-builder";
import type { Category } from "@/features/categories/types";

type LectureCreateModalProps = {
  categories: Category[];
  draftOutline: string;
  onClose: () => void;
  onCreate: (formData: FormData) => void;
  onDraftOutlineChange: (outline: string) => void;
};

export function LectureCreateModal({
  categories,
  draftOutline,
  onClose,
  onCreate,
  onDraftOutlineChange,
}: Readonly<LectureCreateModalProps>) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
      <form
        action={onCreate}
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
            onClick={onClose}
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
                  placeholder="Module title"
                  required
                />
              </label>

              <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                Category domain
                <select
                  className="h-11 rounded-lg border border-[var(--border)] bg-[var(--panel-strong)] px-3 text-sm font-medium normal-case tracking-normal text-foreground outline-none focus:border-blue-500"
                  name="categoryId"
                >
                  <option value="">Uncategorized</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
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
            <OutlineBuilder onChange={onDraftOutlineChange} value={draftOutline} />
          </div>
        </div>

        <div className="flex shrink-0 justify-end gap-2 border-t border-[var(--border)] bg-[var(--panel)] px-6 py-4">
          <button
            className="admin-interactive rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted)] hover:bg-[var(--panel-strong)]"
            onClick={onClose}
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
  );
}


