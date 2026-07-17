import { deleteAdminLecture } from "@/features/lectures/data";

export async function DELETE(
  _request: Request,
  context: RouteContext<"/api/lectures/[id]">,
) {
  const { id } = await context.params;

  try {
    const result = await deleteAdminLecture(id);

    return Response.json(result, { status: result.success ? 200 : 404 });
  } catch (error) {
    return Response.json(
      {
        id,
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to delete lecture.",
      },
      { status: 500 },
    );
  }
}
