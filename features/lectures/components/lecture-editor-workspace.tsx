"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { EditorContent, type JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import type {
  AdminLecture,
  AdminLectureContent,
  AdminLectureOutlineItem,
  LectureContentStatus,
} from "@/features/lectures/data";
import { LectureSectionSelector } from "@/features/lectures/components/lecture-section-selector";

type SaveContentResponse = {
  content?: AdminLectureContent;
  error?: string;
};

const emptyDocument: JSONContent = {
  type: "doc",
  content: [],
};

export function LectureEditorWorkspace({
  lecture,
}: Readonly<{
  lecture: AdminLecture;
}>) {
  const [outlineItems, setOutlineItems] = useState<AdminLectureOutlineItem[]>(
    lecture.outlineItems,
  );
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    lecture.outlineItems[0]?.id ?? null,
  );
  const [editorJson, setEditorJson] = useState<JSONContent>(() =>
    toEditorContent(lecture.outlineItems[0]?.content?.content),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(() =>
    lecture.outlineItems[0]?.content ? "Saved to Core" : "New section",
  );

  const selectedSection = useMemo(
    () => outlineItems.find((item) => item.id === selectedSectionId) ?? null,
    [outlineItems, selectedSectionId],
  );

  const selectedContent = useMemo(
    () => toEditorContent(selectedSection?.content?.content),
    [selectedSection],
  );

  const editor = useEditor({
    extensions: [StarterKit],
    content: selectedContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "admin-tiptap-editor",
      },
    },
    onUpdate: ({ editor: updatedEditor }) => {
      setEditorJson(updatedEditor.getJSON());
      setSaveMessage("Unsaved changes");
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    editor.commands.setContent(selectedContent);
  }, [editor, selectedContent]);

  const formattedJson = JSON.stringify(editorJson, null, 2);

  function selectSection(sectionId: string) {
    const nextSection = outlineItems.find((item) => item.id === sectionId);
    setSelectedSectionId(sectionId);
    setEditorJson(toEditorContent(nextSection?.content?.content));
    setSaveMessage(nextSection?.content ? "Saved to Core" : "New section");
  }

  async function saveSection(status: LectureContentStatus) {
    if (!editor || !selectedSection) {
      window.alert("Please select a lecture section first.");
      return;
    }

    setIsSaving(true);
    setSaveMessage("Saving...");

    try {
      const response = await fetch("/api/lectures/contents", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          lectureId: lecture.id,
          outlineItemId: selectedSection.id,
          content: editor.getJSON(),
          status,
        }),
      });
      const result = (await response.json()) as SaveContentResponse;

      if (!response.ok || !result.content) {
        throw new Error(result.error ?? "Failed to save lecture content.");
      }

      setOutlineItems((current) =>
        current.map((item) =>
          item.id === selectedSection.id
            ? { ...item, content: result.content ?? null }
            : item,
        ),
      );
      setSaveMessage(status === "PUBLISHED" ? "Published" : "Saved to Core");
    } catch (error) {
      setSaveMessage("Save failed");
      window.alert(
        error instanceof Error ? error.message : "Failed to save lecture content.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="admin-slide-down flex min-h-16 flex-col gap-4 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_92%,transparent)] px-5 py-4 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            className="admin-interactive text-sm font-semibold text-[var(--muted)] hover:text-foreground"
            href="/lectures"
          >
            {"<- Back to Catalog"}
          </Link>
          <div className="h-5 w-px bg-[var(--border)]" />
          <span className="rounded-md bg-[var(--panel-strong)] px-2.5 py-1 font-mono text-xs font-semibold text-[var(--muted)]">
            {lecture.id}
          </span>
          <div>
            <span className="text-sm font-bold text-foreground">
              {lecture.title}
            </span>
            {selectedSection ? (
              <p className="mt-0.5 text-xs text-[var(--muted)]">
                Writing: {selectedSection.title}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ThemeToggle />
          <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-emerald-500">
            <span className="admin-saved-dot h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {saveMessage}
          </span>
          <button
            className="admin-interactive h-10 rounded-lg border border-[var(--border)] px-4 text-sm font-bold text-foreground hover:bg-[var(--panel-strong)] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSaving || !selectedSection}
            onClick={() => saveSection("DRAFT")}
            type="button"
          >
            Save Draft
          </button>
          <button
            className="admin-interactive h-10 rounded-lg bg-foreground px-5 text-sm font-bold text-background hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSaving || !selectedSection}
            onClick={() => saveSection("PUBLISHED")}
            type="button"
          >
            Save & Publish
          </button>
        </div>
      </header>

      <section className="grid min-h-[calc(100vh-65px)] xl:grid-cols-[280px_minmax(0,1fr)_480px]">
        <LectureSectionSelector
          items={outlineItems}
          selectedId={selectedSectionId}
          onSelect={selectSection}
        />

        <div className="flex min-w-0 flex-col border-b border-[var(--border)] xl:border-b-0 xl:border-r">
          <div className="admin-fade-up sticky top-0 z-10 flex min-h-12 flex-wrap items-center gap-1 border-b border-[var(--border)] bg-[var(--panel)] px-5 py-2">
            <ToolbarButton
              active={editor?.isActive("bold")}
              disabled={!editor || !selectedSection}
              label="B"
              onClick={() => editor?.chain().focus().toggleBold().run()}
            />
            <ToolbarButton
              active={editor?.isActive("italic")}
              disabled={!editor || !selectedSection}
              label="I"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
            />
            <ToolbarButton
              active={editor?.isActive("strike")}
              disabled={!editor || !selectedSection}
              label="S"
              onClick={() => editor?.chain().focus().toggleStrike().run()}
            />
            <ToolbarDivider />
            <ToolbarButton
              active={editor?.isActive("heading", { level: 1 })}
              disabled={!editor || !selectedSection}
              label="H1"
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 1 }).run()
              }
            />
            <ToolbarButton
              active={editor?.isActive("heading", { level: 2 })}
              disabled={!editor || !selectedSection}
              label="H2"
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 2 }).run()
              }
            />
            <ToolbarButton
              active={editor?.isActive("heading", { level: 3 })}
              disabled={!editor || !selectedSection}
              label="H3"
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 3 }).run()
              }
            />
            <ToolbarDivider />
            <ToolbarButton
              active={editor?.isActive("orderedList")}
              disabled={!editor || !selectedSection}
              label="Ordered List"
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            />
            <ToolbarButton
              active={editor?.isActive("bulletList")}
              disabled={!editor || !selectedSection}
              label="Bullet List"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
            />
            <ToolbarButton
              active={editor?.isActive("blockquote")}
              disabled={!editor || !selectedSection}
              label="Quote Block"
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            />
            <ToolbarDivider />
            <ToolbarButton
              active={editor?.isActive("codeBlock")}
              disabled={!editor || !selectedSection}
              label="<Code />"
              mono
              onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
            />
          </div>

          <article className="admin-fade-up mx-auto w-full max-w-4xl px-6 py-12 md:px-12 md:py-16 [animation-delay:90ms]">
            {selectedSection ? (
              editor ? (
                <EditorContent editor={editor} />
              ) : (
                <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-6 text-sm text-[var(--muted)]">
                  Loading editor...
                </div>
              )
            ) : (
              <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-6 text-sm text-[var(--muted)]">
                Select a lecture section before writing content.
              </div>
            )}
          </article>
        </div>

        <aside className="admin-fade-right min-w-0 bg-[var(--panel)] px-6 py-8 xl:px-8">
          <section>
            <h2 className="text-sm font-bold text-foreground">
              Content JSON Schema Output
            </h2>
            <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
              Realtime abstract syntax tree output for the selected section.
            </p>

            <pre className="admin-scale-in mt-6 overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--panel-strong)] p-5 font-mono text-xs leading-6 text-[var(--muted)]">
              {formattedJson}
            </pre>
          </section>

          <div className="my-8 h-px bg-[var(--border)]" />

          <section className="admin-stagger space-y-5">
            <label className="grid gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
              Selected Section
              <input
                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--panel-strong)] px-3 text-sm font-medium normal-case tracking-normal text-foreground outline-none"
                readOnly
                value={selectedSection?.title ?? "No section selected"}
              />
            </label>

            <label className="grid gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
              Lecture Meta Description
              <textarea
                className="min-h-20 resize-none rounded-lg border border-[var(--border)] bg-[var(--panel-strong)] p-3 text-sm font-medium normal-case leading-6 tracking-normal text-foreground outline-none focus:border-blue-500"
                defaultValue={lecture.description}
              />
            </label>

            <label className="grid gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
              Estimated Reading Metric Length
              <input
                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--panel-strong)] px-3 text-sm font-medium normal-case tracking-normal text-foreground outline-none focus:border-blue-500"
                defaultValue={lecture.readingTime}
              />
            </label>
          </section>
        </aside>
      </section>
    </main>
  );
}

function toEditorContent(value: unknown): JSONContent {
  if (isJsonContent(value)) {
    return value;
  }

  return emptyDocument;
}

function isJsonContent(value: unknown): value is JSONContent {
  return Boolean(
    value &&
      typeof value === "object" &&
      "type" in value &&
      typeof (value as { type?: unknown }).type === "string",
  );
}

function ToolbarButton({
  active,
  disabled,
  label,
  mono = false,
  onClick,
}: Readonly<{
  active?: boolean;
  disabled?: boolean;
  label: string;
  mono?: boolean;
  onClick: () => void;
}>) {
  return (
    <button
      className={`admin-interactive h-8 rounded-md px-2.5 text-xs font-bold text-foreground hover:bg-[var(--panel-strong)] disabled:cursor-not-allowed disabled:opacity-40 ${
        active ? "bg-blue-600 text-white hover:bg-blue-600" : ""
      } ${mono ? "font-mono" : ""}`}
      disabled={disabled}
      type="button"
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function ToolbarDivider() {
  return <span className="mx-1 hidden h-5 w-px bg-[var(--border)] sm:block" />;
}

