export type LectureStatus = "DRAFT" | "PUBLISHED" | "SCHEDULED" | "ARCHIVED";

export type Lecture = {
  id: string;
  courseId: string;
  title: string;
  slug: string;
  status: LectureStatus;
  publishedAt?: string;
};

