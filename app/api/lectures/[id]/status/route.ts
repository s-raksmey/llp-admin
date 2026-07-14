import { graphqlRequest } from "@/lib/graphql-client";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type UpdateLectureStatusRequest = {
  status?: unknown;
};

type UpdateLectureStatusMutation = {
  updateLectureStatus: {
    id: string;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  };
};

function isLectureStatus(
  value: unknown,
): value is "DRAFT" | "PUBLISHED" | "ARCHIVED" {
  return value === "DRAFT" || value === "PUBLISHED" || value === "ARCHIVED";
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = ((await request.json().catch(() => ({}))) ??
    {}) as UpdateLectureStatusRequest;

  if (!isLectureStatus(body.status)) {
    return Response.json(
      { error: "Valid lecture status is required." },
      { status: 400 },
    );
  }

  const data = await graphqlRequest<UpdateLectureStatusMutation>(
    `
      mutation UpdateLectureStatus($input: UpdateLectureStatusInput!) {
        updateLectureStatus(input: $input) {
          id
          status
        }
      }
    `,
    {
      input: {
        id,
        status: body.status,
      },
    },
  );

  return Response.json({ lecture: data.updateLectureStatus });
}

