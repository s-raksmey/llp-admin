import { SectionHeader } from "@/components/ui/section-header";

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Content"
        title="Courses"
        description="Create, edit, archive, and manage SEO details for courses."
      />
      <div className="admin-panel admin-scale-in border-dashed p-8 text-sm text-[var(--muted)]">
        Course table and editor actions will live here.
      </div>
    </div>
  );
}
