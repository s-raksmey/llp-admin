import { SectionHeader } from "@/components/ui/section-header";
import { CategoryAdminConsole } from "@/features/categories/components/category-admin-console";
import { getAdminCategories } from "@/features/categories/data";

export default async function CategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Taxonomy"
        title="Categories"
        description="Create, edit, archive, and maintain category labels for courses and lectures."
      />
      <CategoryAdminConsole initialCategories={categories} />
    </div>
  );
}
