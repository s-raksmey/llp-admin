import { notFound } from "next/navigation";
import { LectureEditorWorkspace } from "@/features/lectures/components/lecture-editor-workspace";
import { findAdminLecture } from "@/features/lectures/data";

type LectureEditorPageProps = {
  params: Promise<{
    lectureId: string;
  }>;
};

export default async function LectureEditorPage({
  params,
}: Readonly<LectureEditorPageProps>) {
  const { lectureId } = await params;
  const lecture = await findAdminLecture(lectureId);

  if (!lecture) {
    notFound();
  }

  return <LectureEditorWorkspace lecture={lecture} />;
}
