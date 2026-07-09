import { SectionHeader } from "@/components/ui/section-header";

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Content"
        title="Courses"
        description="Create, edit, archive, and manage SEO details for courses."
      />
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">
        Course table and editor actions will live here.
      </div>
    </div>
  );
}
