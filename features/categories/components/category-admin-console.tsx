"use client";

import { FormEvent, useMemo, useState } from "react";
import { CategoryFormModal } from "@/features/categories/components/category-form-modal";
import { CategoryMetrics } from "@/features/categories/components/category-metrics";
import { CategoryTable } from "@/features/categories/components/category-table";
import type { Category, CategoryFormInput } from "@/features/categories/types";
import { isCategory, slugify } from "@/features/categories/utils";
import { defaultLessonOutline, serializeOutline } from "@/lib/outline";

const emptyForm: CategoryFormInput = {
  name: "",
  slug: "",
  description: "",
  scope: "BOTH",
  outline: defaultLessonOutline,
};

type CategoryAdminConsoleProps = {
  initialCategories?: Category[];
};

type CreateCategoryResponse = {
  category?: Category;
  error?: string;
};

type UpdateCategoryResponse = {
  category?: Category;
  error?: string;
};

type UpdateCategoryStatusResponse = {
  category?: Category;
  error?: string;
};

type DeleteCategoryResponse = {
  id?: string;
  success: boolean;
  message: string;
};

export function CategoryAdminConsole({
  initialCategories,
}: Readonly<CategoryAdminConsoleProps>) {
  const [categories, setCategories] = useState<Category[]>(() =>
    (initialCategories ?? []).filter(isCategory),
  );
  const [form, setForm] = useState<CategoryFormInput>(emptyForm);
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const validCategories = useMemo(
    () => categories.filter(isCategory),
    [categories],
  );

  const filteredCategories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return validCategories;
    }

    return validCategories.filter((category) =>
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
  }, [query, validCategories]);

  const activeCount = useMemo(
    () =>
      validCategories.filter((category) => category.status === "ACTIVE").length,
    [validCategories],
  );

  const archivedCount = validCategories.length - activeCount;
  const editingCategory = validCategories.find(
    (category) => category.id === editingId,
  );

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
        const response = await fetch(`/api/categories/${editingId}`, {
          method: "PATCH",
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
        const result = (await response.json()) as UpdateCategoryResponse;
        const updatedCategory = result.category;

        if (!response.ok || !updatedCategory) {
          throw new Error(result.error ?? "Failed to update category.");
        }

        setCategories((current) =>
          current
            .filter(isCategory)
            .map((category) =>
              category.id === editingId ? updatedCategory : category,
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

      setCategories((current) => [
        createdCategory,
        ...current.filter(isCategory),
      ]);
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

  async function toggleArchive(categoryId: string) {
    const category = validCategories.find((item) => item.id === categoryId);

    if (!category) {
      return;
    }

    const nextStatus = category.status === "ACTIVE" ? "ARCHIVED" : "ACTIVE";

    try {
      const response = await fetch(`/api/categories/${categoryId}/status`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      const result = (await response.json()) as UpdateCategoryStatusResponse;
      const updatedCategory = result.category;

      if (!response.ok || !updatedCategory) {
        window.alert(result.error ?? "Failed to update category status.");
        return;
      }

      setCategories((current) =>
        current
          .filter(isCategory)
          .map((item) => (item.id === categoryId ? updatedCategory : item)),
      );
    } catch {
      window.alert("Failed to update category status.");
    }
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
    <div className="space-y-6">
      <CategoryMetrics
        activeCount={activeCount}
        archivedCount={archivedCount}
        categories={validCategories}
      />

      <CategoryTable
        categories={filteredCategories}
        query={query}
        onCreate={openCreateModal}
        onDelete={deleteCategory}
        onEdit={startEditing}
        onQueryChange={setQuery}
        onToggleArchive={toggleArchive}
      />

      {isModalOpen ? (
        <CategoryFormModal
          editingCategory={editingCategory}
          form={form}
          formError={formError}
          isSaving={isSaving}
          onClose={closeModal}
          onSubmit={handleSubmit}
          onUpdateForm={updateForm}
        />
      ) : null}
    </div>
  );
}
