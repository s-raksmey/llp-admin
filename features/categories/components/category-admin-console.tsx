"use client";

import { FormEvent, useMemo, useState } from "react";
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

type CategoryAdminConsoleProps = {
  initialCategories?: Category[];
};

type CreateCategoryResponse = {
  category?: Category;
  error?: string;
};

type DeleteCategoryResponse = {
  id?: string;
  success: boolean;
  message: string;
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function CategoryAdminConsole({ initialCategories }: CategoryAdminConsoleProps) {
  const [categories, setCategories] = useState<Category[]>(() => (initialCategories ?? []).filter(isCategory));
  const [form, setForm] = useState<CategoryFormInput>(emptyForm);
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return categories.filter(isCategory);
    }

    return categories.filter(isCategory).filter((category) =>
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
    () => categories.filter(isCategory).filter((category) => category.status === "ACTIVE").length,
    [categories],
  );

  const validCategories = categories.filter(isCategory);
  const archivedCount = validCategories.length - activeCount;
  const editingCategory = validCategories.find((category) => category.id === editingId);
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
    setFormError(null);
    setIsModalOpen(true);
  }

  function closeModal() {
    setForm(emptyForm);
    setEditingId(null);
    setFormError(null);
    setIsModalOpen(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    const normalizedSlug = slugify(form.slug || form.name);

    if (!normalizedSlug) {
      setFormError("Please enter a valid category name or slug.");
      return;
    }

    setIsSaving(true);
    setFormError(null);

    try {
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

      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          slug: normalizedSlug,
          description: form.description,
          scope: form.scope,
        }),
      });
      const result = (await response.json()) as CreateCategoryResponse;

      const createdCategory = result.category;

      if (!response.ok || !createdCategory) {
        throw new Error(result.error ?? "Failed to create category.");
      }

      setCategories((current) => [createdCategory, ...current.filter(isCategory)]);
      closeModal();
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Failed to create category.",
      );
    } finally {
      setIsSaving(false);
    }
  }
  function startEditing(category: Category) {
    if (!isCategory(category)) {
      return;
    }

    setEditingId(category.id);
    setFormError(null);
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

  async function deleteCategory(categoryId: string) {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this category?",
    );

    if (!shouldDelete) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      const result = (await response.json()) as DeleteCategoryResponse;

      if (!response.ok || !result.success) {
        window.alert(result.message || "Failed to delete category.");
        return;
      }

      setCategories((current) =>
        current.filter((category) => category.id !== categoryId),
      );

      if (editingId === categoryId) {
        closeModal();
      }
    } catch {
      window.alert("Failed to delete category.");
    }
  }

  return (
    <div className="space-y-8">
      <section className="admin-stagger grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Categories" value={String(validCategories.length)} />
        <MetricCard label="Active" value={String(activeCount)} tone="success" />
        <MetricCard label="Archived" value={String(archivedCount)} />
        <MetricCard label="GraphQL API" value="Connected" tone="success" />
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
                        {category.name ?? "Untitled category"}
                      </p>
                      <p className="mt-1 font-mono text-xs text-[var(--muted)]">
                        /{category.slug ?? "missing-slug"}
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
                      {category.updatedAt ?? "Unknown"}
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
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
          <form
            className="admin-panel admin-scale-in flex max-h-[calc(100dvh-2rem)] w-full max-w-6xl flex-col overflow-hidden"
            onSubmit={handleSubmit}
          >
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[var(--border)] px-6 py-5">
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
                onClick={closeModal}
                type="button"
              >
                X
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
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
                      onChange={(event) => updateForm("description", event.target.value)}
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

            <div className="flex shrink-0 justify-end gap-2 border-t border-[var(--border)] bg-[var(--panel)] px-6 py-4">
              <button
                className="admin-interactive rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted)] hover:bg-[var(--panel-strong)]"
                disabled={isSaving}
                onClick={closeModal}
                type="button"
              >
                Cancel
              </button>
              <button
                className="admin-interactive rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSaving}
                type="submit"
              >
                {isSaving ? "Saving..." : editingId ? "Save changes" : "Create category"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}

function isCategory(category: Category | null | undefined): category is Category {
  return Boolean(
    category &&
      category.id !== undefined &&
      typeof category.name === "string" &&
      typeof category.slug === "string" &&
      typeof category.scope === "string" &&
      typeof category.status === "string",
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











