import type { FormEvent } from "react";
import type { Category, CategoryFormInput, CategoryScope } from "@/features/categories/types";

const scopeOptions: Array<{ label: string; value: CategoryScope }> = [
  { label: "Courses and lectures", value: "BOTH" },
  { label: "Courses only", value: "COURSE" },
  { label: "Lectures only", value: "LECTURE" },
];

type CategoryFormModalProps = {
  editingCategory?: Category;
  form: CategoryFormInput;
  formError: string | null;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onUpdateForm: (field: keyof CategoryFormInput, value: string) => void;
};

export function CategoryFormModal({
  editingCategory,
  form,
  formError,
  isSaving,
  onClose,
  onSubmit,
  onUpdateForm,
}: Readonly<CategoryFormModalProps>) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-end justify-center bg-black/55 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <form
        className="admin-panel admin-scale-in flex max-h-[100dvh] w-full max-w-6xl flex-col overflow-hidden rounded-b-none sm:max-h-[calc(100dvh-2rem)] sm:rounded-[10px]"
        onSubmit={onSubmit}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[var(--border)] px-4 py-4 sm:px-6 sm:py-5">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
              {editingCategory ? "Configure taxonomy" : "Append new record"}
            </p>
            <h2 className="mt-1 text-xl font-bold text-foreground">
              {editingCategory?.name ?? "Create Category"}
            </h2>
          </div>
          <button
            className="admin-interactive rounded-md px-2 py-1 text-sm font-bold text-[var(--muted)] hover:bg-[var(--panel-strong)] hover:text-foreground"
            disabled={isSaving}
            onClick={onClose}
            type="button"
          >
            X
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          {formError ? (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {formError}
            </div>
          ) : null}

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                Category name
                <input
                  className="h-10 rounded-md border border-[var(--border)] bg-[var(--panel-strong)] px-3 text-[13px] font-medium normal-case tracking-normal text-foreground outline-none focus:border-blue-500"
                  onChange={(event) => onUpdateForm("name", event.target.value)}
                  placeholder="Foundations"
                  required
                  type="text"
                  value={form.name}
                />
              </label>

              <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                URL slug
                <input
                  className="h-10 rounded-md border border-[var(--border)] bg-[var(--panel-strong)] px-3 font-mono text-[13px] font-medium normal-case tracking-normal text-foreground outline-none focus:border-blue-500"
                  onChange={(event) => onUpdateForm("slug", event.target.value)}
                  placeholder="foundations"
                  required
                  type="text"
                  value={form.slug}
                />
              </label>

              <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                Category scope
                <select
                  className="h-10 rounded-md border border-[var(--border)] bg-[var(--panel-strong)] px-3 text-[13px] font-medium normal-case tracking-normal text-foreground outline-none focus:border-blue-500"
                  onChange={(event) =>
                    onUpdateForm("scope", event.target.value as CategoryScope)
                  }
                  value={form.scope}
                >
                  {scopeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)] sm:col-span-2">
                Description
                <textarea
                  className="min-h-24 resize-none rounded-lg border border-[var(--border)] bg-[var(--panel-strong)] p-3 text-sm font-medium normal-case leading-6 tracking-normal text-foreground outline-none focus:border-blue-500"
                  onChange={(event) => onUpdateForm("description", event.target.value)}
                  placeholder="What kind of courses or lectures should use this category?"
                  value={form.description}
                />
              </label>
            </div>

            <aside className="rounded-lg border border-[var(--border)] bg-[var(--panel-strong)] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                Category rules
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                Categories group courses and lectures. Use scope to control where this category can be selected.
              </p>
            </aside>
          </div>
        </div>

        <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-[var(--border)] bg-[var(--panel)] px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            className="admin-interactive rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted)] hover:bg-[var(--panel-strong)]"
            disabled={isSaving}
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="admin-interactive rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSaving}
            type="submit"
          >
            {isSaving ? "Saving..." : editingCategory ? "Save changes" : "Create category"}
          </button>
        </div>
      </form>
    </div>
  );
}
