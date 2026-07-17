import { graphqlRequest } from "@/lib/graphql-client";
import type { OutlineItem } from "@/lib/outline";
import type { Lecture } from "./types";

export type LectureContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type AdminLectureContent = {
  id: string;
  content: unknown;
  status: LectureContentStatus;
};

export type AdminLectureOutlineItem = {
  id: string;
  parentId: string | null;
  title: string;
  sortOrder: number;
  content?: AdminLectureContent | null;
};

export type AdminLecture = Lecture & {
  category: string;
  description: string;
  readingTime: string;
  updatedAt: string;
  tableOfContents: OutlineItem[];
  outlineItems: AdminLectureOutlineItem[];
};

export type CreateLectureOutlineItemInput = {
  title: string;
  children: string[];
};

export type CreateLectureInput = {
  categoryId?: string;
  title: string;
  slug: string;
  description?: string;
  readingTime?: string;
  outlineItems: CreateLectureOutlineItemInput[];
};

type ApiLectureContent = {
  id: string;
  content: unknown;
  status: LectureContentStatus;
};

type ApiLectureOutlineItem = {
  id: string;
  parentId: string | null;
  title: string;
  sortOrder: number;
  content?: ApiLectureContent | null;
};

type ApiLecture = {
  id: string;
  courseId?: string | null;
  category: { name: string } | null;
  title: string;
  slug?: string | null;
  description?: string | null;
  status: Lecture["status"];
  readingTime?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  outlineItems?: ApiLectureOutlineItem[];
};

type LecturesQuery = {
  lectures: ApiLecture[];
};

type LectureQuery = {
  lecture: ApiLecture | null;
};

type CreateLectureMutation = {
  createLecture: ApiLecture;
};

export type DeleteLectureResult = {
  id: string;
  success: boolean;
  message: string;
};

type DeleteLectureMutation = {
  deleteLecture: DeleteLectureResult;
};

export const adminLectures: AdminLecture[] = [];

const adminLectureListFields = `
  id
  category {
    name
  }
  title
  slug
  status
  updatedAt
`;

const adminLectureEditorFields = `
  id
  title
  description
  status
  readingTime
  outlineItems {
    id
    parentId
    title
    sortOrder
    content {
      id
      content
      status
    }
  }
`;

export async function getAdminLectures(): Promise<AdminLecture[]> {
  const data = await graphqlRequest<LecturesQuery>(`
    query AdminLectures {
      lectures {
        ${adminLectureListFields}
      }
    }
  `);

  return data.lectures.map(toAdminLecture);
}

export async function findAdminLecture(lectureId: string) {
  const decodedLectureId = decodeURIComponent(lectureId);
  const data = await graphqlRequest<LectureQuery>(
    `
      query AdminLecture($slug: String!) {
        lecture(slug: $slug) {
          ${adminLectureEditorFields}
        }
      }
    `,
    { slug: decodedLectureId },
  );

  return data.lecture ? toAdminLecture(data.lecture) : undefined;
}

export async function createAdminLecture(
  input: CreateLectureInput,
): Promise<AdminLecture> {
  const data = await graphqlRequest<CreateLectureMutation>(
    `
      mutation CreateLecture($input: CreateLectureInput!) {
        createLecture(input: $input) {
          ${adminLectureListFields}
        }
      }
    `,
    { input },
  );

  return toAdminLecture(data.createLecture);
}

export async function deleteAdminLecture(
  id: string,
): Promise<DeleteLectureResult> {
  const data = await graphqlRequest<DeleteLectureMutation>(
    `
      mutation DeleteLecture($id: ID!) {
        deleteLecture(id: $id) {
          id
          success
          message
        }
      }
    `,
    { id },
  );

  return data.deleteLecture;
}

function toAdminLecture(lecture: ApiLecture): AdminLecture {
  const outlineItems = toOutlineItems(lecture.outlineItems);

  return {
    id: String(lecture.id),
    courseId: lecture.courseId ? String(lecture.courseId) : "uncategorized",
    title: lecture.title,
    slug: lecture.slug ?? String(lecture.id),
    status: lecture.status,
    publishedAt: lecture.publishedAt ?? undefined,
    category: lecture.category?.name ?? "Uncategorized",
    description: lecture.description ?? "",
    readingTime: lecture.readingTime ?? "-",
    updatedAt: formatDate(lecture.updatedAt ?? null),
    tableOfContents: toOutline(outlineItems),
    outlineItems,
  };
}

function toOutlineItems(
  items: NonNullable<ApiLecture["outlineItems"]> = [],
): AdminLectureOutlineItem[] {
  return [...items]
    .sort((first, second) => first.sortOrder - second.sortOrder)
    .map((item) => ({
      id: String(item.id),
      parentId: item.parentId ? String(item.parentId) : null,
      title: item.title,
      sortOrder: item.sortOrder,
      content: item.content
        ? {
            id: String(item.content.id),
            content: item.content.content,
            status: item.content.status,
          }
        : null,
    }));
}

function toOutline(items: AdminLectureOutlineItem[]): OutlineItem[] {
  return items
    .filter((item) => !item.parentId)
    .map((item) => ({
      title: item.title,
      children: items
        .filter((child) => child.parentId === item.id)
        .map((child) => child.title),
    }));
}

function formatDate(value: string | null) {
  if (!value) {
    return "Unknown";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
