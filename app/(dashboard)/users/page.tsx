import { SectionHeader } from "@/components/ui/section-header";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Access"
        title="Users"
        description="Manage administrators, editors, roles, and account status."
      />
      <div className="admin-panel admin-scale-in border-dashed p-8 text-sm text-[var(--muted)]">
        User management and role assignment controls will live here.
      </div>
    </div>
  );
}
