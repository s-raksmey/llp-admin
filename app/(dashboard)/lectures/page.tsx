import { SectionHeader } from "@/components/ui/section-header";
import { LectureAdminConsole } from "@/features/lectures/components/lecture-admin-console";

export default function LecturesPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Content Operations"
        title="Lecture Console"
        description="Draft, publish, duplicate, and maintain rich lecture content before it flows through the GraphQL API to the public website."
      />
      <LectureAdminConsole />
    </div>
  );
}
