import type { Category } from "@/features/categories/types";
import { formatScope, statusClassName } from "@/features/categories/utils";

type CategoryTableProps = {
  categories: Category[];
  query: string;
  onCreate: () => void;
  onDelete: (categoryId: string) => void;
  onEdit: (category: Category) => void;
  onQueryChange: (query: string) => void;
  onToggleArchive: (categoryId: string) => void;
};

export function CategoryTable({
  categories,
  query,
  onCreate,
  onDelete,
  onEdit,
  onQueryChange,
  onToggleArchive,
}: Readonly<CategoryTableProps>) {
  return (
    <section>
      <div className="admin-panel admin-scale-in overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-[var(--border)] p-4 sm:flex-row sm:items-end sm:justify-between">
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
            Search taxonomy
            <input
              className="h-10 w-full rounded-md border border-[var(--border)] bg-[var(--panel)] px-3 text-[13px] font-medium normal-case tracking-normal text-foreground outline-none transition focus:border-blue-500 sm:w-72"
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Name, slug, scope..."
              value={query}
            />
          </label>

          <button
            className="admin-interactive inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-700"
            onClick={onCreate}
            type="button"
          >
            + Create category
          </button>
        </div>

        <div>
          <table className="responsive-table w-full table-fixed border-collapse text-left text-sm">
            <thead className="border-b border-[var(--border)] bg-[var(--panel-strong)] text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
              <tr>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Scope</th>
                <th className="px-5 py-4">Items</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Updated</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {categories.map((category, index) => (
                <tr
                  className="admin-row-enter transition hover:bg-[var(--panel-strong)]"
                  key={category.id}
                  style={{ animationDelay: `${120 + index * 55}ms` }}
                >
                  <td data-label="Category" className="px-5 py-4">
                    <p className="font-semibold text-foreground">
                      {category.name ?? "Untitled category"}
                    </p>
                    <p className="mt-1 font-mono text-xs text-[var(--muted)]">
                      /{category.slug ?? "missing-slug"}
                    </p>
                  </td>
                  <td data-label="Scope" className="px-5 py-4">
                    <span className="rounded-md bg-[var(--panel-strong)] px-2 py-1 text-xs font-semibold text-[var(--muted)]">
                      {formatScope(category.scope)}
                    </span>
                  </td>
                  <td data-label="Items" className="px-5 py-4 font-mono text-xs text-[var(--muted)]">
                    {category.itemCount}
                  </td>
                  <td data-label="Status" className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${statusClassName(category.status)}`}
                    >
                      {category.status === "ACTIVE" ? "Active" : "Archived"}
                    </span>
                  </td>
                  <td data-label="Updated" className="px-5 py-4 text-[var(--muted)]">
                    {category.updatedAt ?? "Unknown"}
                  </td>
                  <td data-label="Actions" className="px-5 py-4 text-right">
                    <div className="inline-flex items-center gap-3">
                      <button
                        className="admin-interactive font-bold text-blue-600 hover:text-blue-700"
                        onClick={() => onEdit(category)}
                        type="button"
                      >
                        Configure
                      </button>
                      <button
                        className="admin-interactive font-semibold text-[var(--muted)] hover:text-foreground"
                        onClick={() => onToggleArchive(category.id)}
                        type="button"
                      >
                        {category.status === "ACTIVE" ? "Archive" : "Restore"}
                      </button>
                      <button
                        className="admin-interactive font-semibold text-[var(--muted)] hover:text-red-600"
                        onClick={() => onDelete(category.id)}
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
