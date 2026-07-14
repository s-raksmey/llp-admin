"use client";

import { useMemo, useState } from "react";
import { LectureCreateModal } from "@/features/lectures/components/lecture-create-modal";
import { LectureMetrics } from "@/features/lectures/components/lecture-metrics";
import { LectureTable } from "@/features/lectures/components/lecture-table";
import type { Category } from "@/features/categories/types";
import type { AdminLecture } from "@/features/lectures/data";
import { filterLectures, slugify } from "@/features/lectures/utils";
import { parseOutline } from "@/lib/outline";

const emptyLessonOutline = "";

export type LectureAdminConsoleProps = {
  initialCategories: Category[];
  initialLectures: AdminLecture[];
};

type CreateLectureResponse = {
  lecture: AdminLecture;
  error?: string;
};

export function LectureAdminConsole({
  initialCategories,
  initialLectures,
}: Readonly<LectureAdminConsoleProps>) {
  const [lectures, setLectures] = useState<AdminLecture[]>(initialLectures);
  const [query, setQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [draftOutline, setDraftOutline] = useState(emptyLessonOutline);

  const filteredLectures = useMemo(
    () => filterLectures(lectures, query),
    [lectures, query],
  );

  async function createDraft(formData: FormData) {
    const title = String(formData.get("title") ?? "").trim();
    const categoryId = String(formData.get("categoryId") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    if (!title) {
      return;
    }

    try {
      const response = await fetch("/api/lectures", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          categoryId: categoryId || null,
          title,
          slug: slugify(title),
          description,
          readingTime: "5 minutes",
          outlineItems: parseOutline(draftOutline),
        }),
      });

      const result = (await response.json()) as CreateLectureResponse;

      if (!response.ok || !result.lecture) {
        window.alert(result.error ?? "Failed to create lecture.");
        return;
      }

      setLectures((current) => [result.lecture, ...current]);
      setIsCreating(false);
      setDraftOutline(emptyLessonOutline);
    } catch {
      window.alert("Failed to create lecture.");
    }
  }

  function openCreateModal() {
    setDraftOutline(emptyLessonOutline);
    setIsCreating(true);
  }

  function closeCreateModal() {
    setIsCreating(false);
  }

  function removeLecture(id: string) {
    setLectures((current) => current.filter((lecture) => lecture.id !== id));
  }

  return (
    <div className="space-y-8">
      <LectureMetrics lectures={lectures} />

      <LectureTable
        lectures={filteredLectures}
        query={query}
        onCreate={openCreateModal}
        onDelete={removeLecture}
        onQueryChange={setQuery}
      />

      {isCreating ? (
        <LectureCreateModal
          categories={initialCategories}
          draftOutline={draftOutline}
          onClose={closeCreateModal}
          onCreate={createDraft}
          onDraftOutlineChange={setDraftOutline}
        />
      ) : null}
    </div>
  );
}

