import type { Lecture } from "./types";

export type AdminLecture = Lecture & {
  category: string;
  description: string;
  readingTime: string;
  updatedAt: string;
};

export const adminLectures: AdminLecture[] = [
  {
    id: "MOD_1.1",
    courseId: "visual-architecture",
    title: "Visual Architecture and Structure",
    slug: "visual-architecture-and-structure",
    status: "PUBLISHED",
    publishedAt: "2026-07-09",
    category: "Core UI",
    description:
      "Core educational breakdown handling screen whitespace, hierarchy, and content flow.",
    readingTime: "7 minutes",
    updatedAt: "Today",
  },
  {
    id: "MOD_2.1",
    courseId: "data-engineering",
    title: "Advanced State Management",
    slug: "advanced-state-management",
    status: "DRAFT",
    category: "Data Engineering",
    description:
      "Draft module for local cache strategy, GraphQL mutations, and publish state.",
    readingTime: "11 minutes",
    updatedAt: "Yesterday",
  },
  {
    id: "MOD_3.1",
    courseId: "media-delivery",
    title: "Media Attachments and Embeds",
    slug: "media-attachments-and-embeds",
    status: "SCHEDULED",
    publishedAt: "2026-07-14",
    category: "Media Library",
    description:
      "Operational notes for image, PDF, video, and YouTube resources inside lectures.",
    readingTime: "9 minutes",
    updatedAt: "2 days ago",
  },
];

export function findAdminLecture(lectureId: string) {
  const decodedLectureId = decodeURIComponent(lectureId);

  return adminLectures.find(
    (lecture) => lecture.id === decodedLectureId || lecture.slug === lectureId,
  );
}
