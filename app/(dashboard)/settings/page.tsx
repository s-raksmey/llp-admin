import { SectionHeader } from "@/components/ui/section-header";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Configuration"
        title="Settings"
        description="Configure branding, contact details, social links, SEO, and analytics."
      />
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">
        Website settings forms will live here.
      </div>
    </div>
  );
}
