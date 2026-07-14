import type { Category, CategoryScope } from "./types";

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isCategory(category: Category | null | undefined): category is Category {
  return Boolean(
    category &&
      category.id !== undefined &&
      typeof category.name === "string" &&
      typeof category.slug === "string" &&
      typeof category.scope === "string" &&
      typeof category.status === "string",
  );
}

export function formatScope(scope: CategoryScope) {
  if (scope === "BOTH") {
    return "Courses and lectures";
  }

  return scope === "COURSE" ? "Courses" : "Lectures";
}

export function statusClassName(status: Category["status"]) {
  if (status === "ACTIVE") {
    return "border-emerald-200 bg-emerald-50 text-emerald-600";
  }

  return "border-slate-200 bg-slate-100 text-slate-600";
}
