import { SectionHeader } from "@/components/ui/section-header";
import { CategoryAdminConsole } from "@/features/categories/components/category-admin-console";

export default function CategoriesPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Taxonomy"
        title="Categories"
        description="Create, edit, archive, and maintain category labels for courses and lectures."
      />
      <CategoryAdminConsole />
    </div>
  );
}
