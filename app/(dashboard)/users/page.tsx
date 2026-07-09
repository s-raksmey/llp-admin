import { SectionHeader } from "@/components/ui/section-header";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Access"
        title="Users"
        description="Manage administrators, editors, roles, and account status."
      />
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">
        User management and role assignment controls will live here.
      </div>
    </div>
  );
}
