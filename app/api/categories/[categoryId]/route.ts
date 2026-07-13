import {
  deleteAdminCategory,
  updateAdminCategory,
} from "@/features/categories/data";
import type { CategoryScope } from "@/features/categories/types";

const scopes: CategoryScope[] = ["COURSE", "LECTURE", "BOTH"];

type CategoryRouteContext = {
  params: Promise<{
    categoryId: string;
  }>;
};

type UpdateCategoryRequest = {
  name?: unknown;
  slug?: unknown;
  description?: unknown;
  scope?: unknown;
};

export async function PATCH(
  request: Request,
  context: CategoryRouteContext,
) {
  const { categoryId } = await context.params;
  const body = ((await request.json().catch(() => ({}))) ?? {}) as UpdateCategoryRequest;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  const description =
    typeof body.description === "string" ? body.description.trim() : "";
  const scope = body.scope;

  if (!categoryId || !name || !slug || !scopes.includes(scope as CategoryScope)) {
    return Response.json(
      { error: "Category id, name, slug, and scope are required." },
      { status: 400 },
    );
  }

  try {
    const category = await updateAdminCategory({
      id: categoryId,
      name,
      slug,
      description,
      scope: scope as CategoryScope,
    });

    return Response.json({ category }, { status: 200 });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update category.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: CategoryRouteContext,
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
