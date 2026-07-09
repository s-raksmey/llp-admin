import { SectionHeader } from "@/components/ui/section-header";

export default function MediaPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Files"
        title="Media Library"
        description="Upload, preview, search, delete, and copy URLs for teaching files."
      />
      <div className="admin-panel admin-scale-in border-dashed p-8 text-sm text-[var(--muted)]">
        Media browser and upload queue will live here.
      </div>
    </div>
  );
}
