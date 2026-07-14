import { graphqlRequest } from "@/lib/graphql-client";
import type { OutlineItem } from "@/lib/outline";
import type { Lecture } from "./types";

export type AdminLecture = Lecture & {
  category: string;
  description: string;
  readingTime: string;
  updatedAt: string;
  tableOfContents: OutlineItem[];
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

type ApiLecture = {
  id: string;
  categoryId?: string | null;
  category: { name: string } | null;
  title: string;
  slug: string;
  description?: string | null;
  status: Lecture["status"];
  readingTime?: string | null;
  publishedAt?: string | null;
  updatedAt: string | null;
  outlineItems?: Array<{
    id: string;
    parentId: string | null;
    title: string;
    sortOrder: number;
  }>;
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

export const adminLectures: AdminLecture[] = [];

export async function getAdminLectures(): Promise<AdminLecture[]> {
  const data = await graphqlRequest<LecturesQuery>(`
    query AdminLectures {
      lectures {
        id
        category {
          name
        }
        title
        slug
        status
        updatedAt
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
          id
          categoryId
          category {
            name
          }
          title
          slug
          description
          status
          readingTime
          publishedAt
          updatedAt
          outlineItems {
            id
            parentId
            title
            sortOrder
          }
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
          id
          categoryId
          category {
            name
          }
          title
          slug
          description
          status
          readingTime
          publishedAt
          updatedAt
          outlineItems {
            id
            parentId
            title
            sortOrder
          }
        }
      }
    `,
    { input },
  );

  return toAdminLecture(data.createLecture);
}

function toAdminLecture(lecture: ApiLecture): AdminLecture {
  return {
    id: String(lecture.id),
    courseId: lecture.categoryId ? String(lecture.categoryId) : "uncategorized",
    title: lecture.title,
    slug: lecture.slug,
    status: lecture.status,
    publishedAt: lecture.publishedAt ?? undefined,
    category: lecture.category?.name ?? "Uncategorized",
    description: lecture.description ?? "",
    readingTime: lecture.readingTime ?? "-",
    updatedAt: formatDate(lecture.updatedAt),
    tableOfContents: toOutline(lecture.outlineItems),
  };
}

function toOutline(items: NonNullable<ApiLecture["outlineItems"]> = []): OutlineItem[] {
  const sortedItems = [...items].sort((first, second) => first.sortOrder - second.sortOrder);

  return sortedItems
    .filter((item) => !item.parentId)
    .map((item) => ({
      title: item.title,
      children: sortedItems
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




