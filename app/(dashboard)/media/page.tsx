import { SectionHeader } from "@/components/ui/section-header";

export default function MediaPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Files"
        title="Media Library"
        description="Upload, preview, search, delete, and copy URLs for teaching files."
      />
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">
        Media browser and upload queue will live here.
      </div>
    </div>
  );
}
