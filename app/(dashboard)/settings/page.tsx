import { SectionHeader } from "@/components/ui/section-header";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Configuration"
        title="Settings"
        description="Configure branding, contact details, social links, SEO, and analytics."
      />
      <div className="admin-panel admin-scale-in border-dashed p-8 text-sm text-[var(--muted)]">
        Website settings forms will live here.
      </div>
    </div>
  );
}
