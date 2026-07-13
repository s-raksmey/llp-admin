"use client";

import { FormEvent, useMemo, useState } from "react";
import { OutlineBuilder } from "@/components/ui/outline-builder";
import { adminCategories } from "@/features/categories/data";
import type { Category, CategoryFormInput, CategoryScope } from "@/features/categories/types";
import { defaultLessonOutline, parseOutline, serializeOutline } from "@/lib/outline";

const emptyForm: CategoryFormInput = {
  name: "",
  slug: "",
  description: "",
  scope: "BOTH",
  outline: defaultLessonOutline,
};

const scopeOptions: Array<{ label: string; value: CategoryScope }> = [
  { label: "Courses and lectures", value: "BOTH" },
  { label: "Courses only", value: "COURSE" },
  { label: "Lectures only", value: "LECTURE" },
];

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function CategoryAdminConsole() {
  const [categories, setCategories] = useState<Category[]>(adminCategories);
  const [form, setForm] = useState<CategoryFormInput>(emptyForm);
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredCategories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return categories;
    }

    return categories.filter((category) =>
      [
        category.name,
        category.slug,
        category.description,
        category.scope,
        category.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [categories, query]);

  const activeCount = useMemo(
    () => categories.filter((category) => category.status === "ACTIVE").length,
    [categories],
  );

  const archivedCount = categories.length - activeCount;
  const editingCategory = categories.find((category) => category.id === editingId);
  const outlinePreview = useMemo(() => parseOutline(form.outline), [form.outline]);

  function updateForm(field: keyof CategoryFormInput, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
      slug: field === "name" && !editingId ? slugify(value) : current.slug,
    }));
  }

  function openCreateModal() {
    setForm(emptyForm);
    setEditingId(null);
    setIsModalOpen(true);
  }

  function closeModal() {
    setForm(emptyForm);
    setEditingId(null);
    setIsModalOpen(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedSlug = slugify(form.slug || form.name);

    if (!normalizedSlug) {
      return;
    }

    if (editingId) {
      setCategories((current) =>
        current.map((category) =>
          category.id === editingId
            ? {
                ...category,
                ...form,
                slug: normalizedSlug,
                tableOfContents: outlinePreview,
                updatedAt: "Just now",
              }
            : category,
        ),
      );
      closeModal();
      return;
    }

    setCategories((current) => [
      {
        id: `cat-${normalizedSlug || Date.now()}`,
        ...form,
        slug: normalizedSlug,
        status: "ACTIVE",
        itemCount: 0,
        updatedAt: "Just now",
        tableOfContents: outlinePreview,
      },
      ...current,
    ]);
    closeModal();
  }

  function startEditing(category: Category) {
    setEditingId(category.id);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description,
      scope: category.scope,
      outline: serializeOutline(category.tableOfContents),
    });
    setIsModalOpen(true);
  }

  function toggleArchive(categoryId: string) {
    setCategories((current) =>
      current.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              status: category.status === "ACTIVE" ? "ARCHIVED" : "ACTIVE",
              updatedAt: "Just now",
            }
          : category,
      ),
    );
  }

  function deleteCategory(categoryId: string) {
    setCategories((current) =>
      current.filter((category) => category.id !== categoryId),
    );

    if (editingId === categoryId) {
      closeModal();
    }
  }

  return (
    <div className="admin-fade-up space-y-8">
      <section className="admin-stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Categories" value={String(categories.length)} />
        <MetricCard label="Active" value={String(activeCount)} tone="success" />
        <MetricCard label="Archived" value={String(archivedCount)} />
        <MetricCard label="GraphQL CRUD" value="Ready" tone="success" />
      </section>

      <section>
        <div className="admin-panel admin-scale-in overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-[var(--border)] p-5 sm:flex-row sm:items-end sm:justify-between">
            <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
              Search taxonomy
              <input
                className="h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--panel)] px-3 text-sm font-medium normal-case tracking-normal text-foreground outline-none transition focus:border-blue-500 sm:w-80"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Name, slug, scope..."
                value={query}
              />
            </label>

            <button
              className="admin-interactive inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-700"
              onClick={openCreateModal}
              type="button"
            >
              + Create category
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-left text-sm">
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
                {filteredCategories.map((category, index) => (
                  <tr
                    className="admin-row-enter transition hover:bg-[var(--panel-strong)]"
                    key={category.id}
                    style={{ animationDelay: `${120 + index * 55}ms` }}
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-foreground">
                        {category.name}
                      </p>
                      <p className="mt-1 font-mono text-xs text-[var(--muted)]">
                        /{category.slug}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-md bg-[var(--panel-strong)] px-2 py-1 text-xs font-semibold text-[var(--muted)]">
                        {formatScope(category.scope)}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-[var(--muted)]">
                      {category.itemCount}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${statusClassName(category.status)}`}
                      >
                        {category.status === "ACTIVE" ? "Active" : "Archived"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[var(--muted)]">
                      {category.updatedAt}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-3">
                        <button
                          className="admin-interactive font-bold text-blue-600 hover:text-blue-700"
                          onClick={() => startEditing(category)}
                          type="button"
                        >
                          Configure
                        </button>
                        <button
                          className="admin-interactive font-semibold text-[var(--muted)] hover:text-foreground"
                          onClick={() => toggleArchive(category.id)}
                          type="button"
                        >
                          {category.status === "ACTIVE" ? "Archive" : "Restore"}
                        </button>
                        <button
                          className="admin-interactive font-semibold text-[var(--muted)] hover:text-red-600"
                          onClick={() => deleteCategory(category.id)}
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

      {isModalOpen ? (
        <div className="admin-fade-up fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm">
          <form
            className="admin-panel admin-scale-in max-h-[90vh] w-full max-w-6xl space-y-6 overflow-y-auto p-6"
            onSubmit={handleSubmit}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                  {editingCategory ? "Configure Taxonomy" : "Append New Record"}
                </p>
                <h2 className="mt-1 text-xl font-bold text-foreground">
                  {editingCategory?.name ?? "Create Category"}
                </h2>
              </div>
              <button
                className="admin-interactive rounded-md px-2 py-1 text-sm font-bold text-[var(--muted)] hover:bg-[var(--panel-strong)] hover:text-foreground"
                onClick={closeModal}
                type="button"
              >
                X
              </button>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Category name
                  <input
                    className="h-11 rounded-lg border border-[var(--border)] bg-[var(--panel-strong)] px-3 text-sm font-medium normal-case tracking-normal text-foreground outline-none focus:border-blue-500"
                    onChange={(event) => updateForm("name", event.target.value)}
                    placeholder="Foundations"
                    required
                    type="text"
                    value={form.name}
                  />
                </label>

                <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                  URL slug
                  <input
                    className="h-11 rounded-lg border border-[var(--border)] bg-[var(--panel-strong)] px-3 font-mono text-sm font-medium normal-case tracking-normal text-foreground outline-none focus:border-blue-500"
                    onChange={(event) => updateForm("slug", event.target.value)}
                    placeholder="foundations"
                    required
                    type="text"
                    value={form.slug}
                  />
                </label>

                <label className="grid gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Category scope
                  <select
                    className="h-11 rounded-lg border border-[var(--border)] bg-[var(--panel-strong)] px-3 text-sm font-medium normal-case tracking-normal text-foreground outline-none focus:border-blue-500"
                    onChange={(event) =>
                      updateForm("scope", event.target.value as CategoryScope)
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
                    onChange={(event) =>
                      updateForm("description", event.target.value)
                    }
                    placeholder="What kind of courses or lectures should use this category?"
                    value={form.description}
                  />
                </label>
              </div>

              <aside className="rounded-lg border border-[var(--border)] bg-[var(--panel-strong)] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Config rules
                </p>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  Use main items for lessons. Add sub-items only for details that belong
                  under that lesson, like formulas, examples, or checkpoints.
                </p>
              </aside>
            </div>

            <OutlineBuilder
              onChange={(value) => updateForm("outline", value)}
              value={form.outline}
            />

            <div className="flex justify-end gap-2">
              <button
                className="admin-interactive rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted)] hover:bg-[var(--panel-strong)]"
                onClick={closeModal}
                type="button"
              >
                Cancel
              </button>
              <button
                className="admin-interactive rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                type="submit"
              >
                {editingId ? "Save changes" : "Commit entry"}
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

function formatScope(scope: CategoryScope) {
  if (scope === "BOTH") {
    return "Courses and lectures";
  }

  return scope === "COURSE" ? "Courses" : "Lectures";
}

function statusClassName(status: Category["status"]) {
  if (status === "ACTIVE") {
    return "border-emerald-200 bg-emerald-50 text-emerald-600";
  }

  return "border-slate-200 bg-slate-100 text-slate-600";
}
