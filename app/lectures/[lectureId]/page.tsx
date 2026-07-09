import { notFound } from "next/navigation";
import {
  adminLectures,
  findAdminLecture,
} from "@/features/lectures/data";
import { LectureEditorWorkspace } from "@/features/lectures/components/lecture-editor-workspace";

type LectureEditorPageProps = {
  params: Promise<{
    lectureId: string;
  }>;
};

export function generateStaticParams() {
  return adminLectures.map((lecture) => ({
    lectureId: lecture.id,
  }));
}

export default async function LectureEditorPage({
  params,
}: Readonly<LectureEditorPageProps>) {
  const { lectureId } = await params;
  const lecture = findAdminLecture(lectureId);

  if (!lecture) {
    notFound();
  }

  return <LectureEditorWorkspace lecture={lecture} />;
}
