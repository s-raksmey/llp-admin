import { createAdminCategory } from "@/features/categories/data";
import type { CategoryScope } from "@/features/categories/types";

const scopes: CategoryScope[] = ["COURSE", "LECTURE", "BOTH"];

type CreateCategoryRequest = {
  name?: unknown;
  slug?: unknown;
  description?: unknown;
  scope?: unknown;
};

export async function POST(request: Request) {
  const body = ((await request.json().catch(() => ({}))) ?? {}) as CreateCategoryRequest;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  const description =
    typeof body.description === "string" ? body.description.trim() : "";
  const scope = body.scope;

  if (!name || !slug || !scopes.includes(scope as CategoryScope)) {
    return Response.json(
      { error: "Name, slug, and scope are required." },
      { status: 400 },
    );
  }

  try {
    const category = await createAdminCategory({
      name,
      slug,
      description,
      scope: scope as CategoryScope,
    });

    return Response.json({ category }, { status: 201 });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create category.",
      },
      { status: 500 },
    );
  }
}

