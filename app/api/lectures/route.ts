import { createAdminLecture } from "@/features/lectures/data";

type CreateLectureRequest = {
  categoryId?: unknown;
  title?: unknown;
  slug?: unknown;
  description?: unknown;
  readingTime?: unknown;
  outlineItems?: unknown;
};

type OutlineItemInput = {
  title: string;
  children: string[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object");
}

function normalizeOutlineItems(value: unknown): OutlineItemInput[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(isRecord)
    .map((item) => {
      const title = typeof item.title === "string" ? item.title.trim() : "";
      const children = Array.isArray(item.children)
        ? item.children
            .filter((child): child is string => typeof child === "string")
            .map((child) => child.trim())
            .filter(Boolean)
        : [];

      return {
        title,
        children,
      };
    })
    .filter((item) => item.title);
}

export async function POST(request: Request) {
  const body = ((await request.json().catch(() => ({}))) ??
    {}) as CreateLectureRequest;

  const categoryId =
    typeof body.categoryId === "string" && body.categoryId.trim()
      ? body.categoryId.trim()
      : undefined;
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  const description =
    typeof body.description === "string" ? body.description.trim() : "";
  const readingTime =
    typeof body.readingTime === "string" && body.readingTime.trim()
      ? body.readingTime.trim()
      : "5 minutes";
  const outlineItems = normalizeOutlineItems(body.outlineItems);

  if (!title || !slug) {
    return Response.json(
      { error: "Title and slug are required." },
      { status: 400 },
    );
  }

  try {
    const lecture = await createAdminLecture({
      categoryId,
      title,
      slug,
      description,
      readingTime,
      outlineItems,
    });

    return Response.json({ lecture }, { status: 201 });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create lecture.",
      },
      { status: 500 },
    );
  }
}
