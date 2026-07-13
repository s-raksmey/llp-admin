import type { Lecture } from "./types";
import type { OutlineItem } from "@/lib/outline";

export type AdminLecture = Lecture & {
  category: string;
  description: string;
  readingTime: string;
  updatedAt: string;
  tableOfContents: OutlineItem[];
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
    tableOfContents: [
      { title: "Data, Features, and Targets" },
      { title: "Preprocessing and Feature Engineering" },
      {
        title: "Losses",
        children: ["Mean Squared Error", "Binary Cross-Entropy"],
      },
    ],
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
    tableOfContents: [
      { title: "Server State vs Local State" },
      { title: "Apollo Cache Updates" },
      { title: "Optimistic Mutations" },
    ],
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
    tableOfContents: [
      { title: "Upload Validation" },
      { title: "Attachment Rendering", children: ["PDF", "ZIP", "Video"] },
      { title: "Copy URL Workflow" },
    ],
  },
];

export function findAdminLecture(lectureId: string) {
  const decodedLectureId = decodeURIComponent(lectureId);

  return adminLectures.find(
    (lecture) => lecture.id === decodedLectureId || lecture.slug === lectureId,
  );
}
