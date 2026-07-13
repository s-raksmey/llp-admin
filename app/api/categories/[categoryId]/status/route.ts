import { updateAdminCategoryStatus } from "@/features/categories/data";
import type { CategoryStatus } from "@/features/categories/types";

const statuses: CategoryStatus[] = ["ACTIVE", "ARCHIVED"];

type CategoryStatusRouteContext = {
  params: Promise<{
    categoryId: string;
  }>;
};

type UpdateCategoryStatusRequest = {
  status?: unknown;
};

export async function PATCH(
  request: Request,
  context: CategoryStatusRouteContext,
) {
  const { categoryId } = await context.params;
  const body = ((await request.json().catch(() => ({}))) ?? {}) as UpdateCategoryStatusRequest;
  const status = body.status;

  if (!categoryId || !statuses.includes(status as CategoryStatus)) {
    return Response.json(
      { error: "Category id and valid status are required." },
      { status: 400 },
    );
  }

  try {
    const category = await updateAdminCategoryStatus({
      id: categoryId,
      status: status as CategoryStatus,
    });

    return Response.json({ category }, { status: 200 });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update category status.",
      },
      { status: 500 },
    );
  }
}
