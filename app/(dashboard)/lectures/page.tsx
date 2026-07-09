import { SectionHeader } from "@/components/ui/section-header";

export default function LecturesPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Content"
        title="Lectures"
        description="Draft, publish, duplicate, and schedule rich lecture content."
      />
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">
        Lecture list, filters, and rich text editor entry points will live here.
      </div>
    </div>
  );
}
