import { SectionHeader } from "@/components/ui/section-header";
import { getLectureCategoryOptions } from "@/features/categories/data";
import { LectureAdminConsole } from "@/features/lectures/components/lecture-admin-console";
import { getAdminLectures } from "@/features/lectures/data";

export default async function LecturesPage() {
  const [lectures, categories] = await Promise.all([
    getAdminLectures(),
    getLectureCategoryOptions(),
  ]);

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Content Operations"
        title="Lecture Console"
        description="Draft, publish, duplicate, and maintain rich lecture content before it flows through the GraphQL API to the public website."
      />
      <LectureAdminConsole
        initialCategories={categories}
        initialLectures={lectures}
      />
    </div>
  );
}
