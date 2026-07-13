import { deleteAdminCategory } from "@/features/categories/data";

type DeleteCategoryRouteContext = {
  params: Promise<{
    categoryId: string;
  }>;
};

export async function DELETE(
  _request: Request,
  context: DeleteCategoryRouteContext,
) {
  const { categoryId } = await context.params;

  if (!categoryId) {
    return Response.json(
      { success: false, message: "Category id is required." },
      { status: 400 },
    );
  }

  try {
    const result = await deleteAdminCategory(categoryId);

    return Response.json(result, {
      status: result.success ? 200 : 409,
    });
  } catch (error) {
    return Response.json(
      {
        id: categoryId,
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to delete category.",
      },
      { status: 500 },
    );
  }
}