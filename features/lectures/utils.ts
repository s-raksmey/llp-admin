import type { AdminLecture } from "@/features/lectures/data";

export const lectureStatusStyles = {
  DRAFT: "text-amber-600 bg-amber-50 border-amber-200",
  PUBLISHED: "text-emerald-600 bg-emerald-50 border-emerald-200",
  SCHEDULED: "text-blue-600 bg-blue-50 border-blue-200",
  ARCHIVED: "text-slate-600 bg-slate-100 border-slate-200",
} as const;

export const lectureStatusLabels = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  SCHEDULED: "Scheduled",
  ARCHIVED: "Archived",
} as const;

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function filterLectures(lectures: AdminLecture[], query: string) {
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
}
