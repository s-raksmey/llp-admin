import { graphqlRequest } from "@/lib/graphql-client";

type SaveContentRequest = {
  lectureId?: unknown;
  outlineItemId?: unknown;
  content?: unknown;
  status?: unknown;
};

type SaveContentMutation = {
  saveLectureContent: {
    id: string;
    lectureId: string;
    outlineItemId: string;
    content: unknown;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    updatedAt: string | null;
  };
};

export async function POST(request: Request) {
  const body = ((await request.json().catch(() => ({}))) ??
    {}) as SaveContentRequest;

  const lectureId =
    typeof body.lectureId === "string" ? body.lectureId.trim() : "";
  const outlineItemId =
    typeof body.outlineItemId === "string" ? body.outlineItemId.trim() : "";

  if (!lectureId || !outlineItemId) {
    return Response.json(
      { error: "Lecture and outline item are required." },
      { status: 400 },
    );
  }

  const data = await graphqlRequest<SaveContentMutation>(
    `
      mutation SaveLectureContent($input: SaveLectureContentInput!) {
        saveLectureContent(input: $input) {
          id
          lectureId
          outlineItemId
          content
          status
          updatedAt
        }
      }
    `,
    {
      input: {
        lectureId,
        outlineItemId,
        content: body.content ?? { type: "doc", content: [] },
        status: body.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
      },
    },
  );

  return Response.json({ content: data.saveLectureContent });
}
