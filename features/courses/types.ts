export type CourseStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type Course = {
  id: string;
  title: string;
  slug: string;
  description: string;
  status: CourseStatus;
  thumbnailUrl?: string;
};
