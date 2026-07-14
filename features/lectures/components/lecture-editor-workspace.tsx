"use client";

import Link from "next/link";
import { useMemo } from "react";
import { EditorContent, type JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import type { AdminLecture } from "@/features/lectures/data";

export function LectureEditorWorkspace({
  lecture,
}: Readonly<{
  lecture: AdminLecture;
}>) {
  const initialContent = useMemo<JSONContent>(
    () => ({
      type: "doc",
      content: [],
    }),
    [],
  );
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "admin-tiptap-editor",
      },
    },
  });

  const editorJson = editor?.getJSON() ?? initialContent;
  const formattedJson = JSON.stringify(editorJson, null, 2);

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
          <span className="text-sm font-bold text-foreground">
            {lecture.title}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <ThemeToggle />
          <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-emerald-500">
            <span className="admin-saved-dot h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Saved to Core
          </span>
          <button
            className="admin-interactive h-10 rounded-lg bg-foreground px-5 text-sm font-bold text-background hover:opacity-85"
            type="button"
          >
            Save & Publish
          </button>
        </div>
      </header>

      <section className="grid min-h-[calc(100vh-65px)] xl:grid-cols-[minmax(0,1fr)_480px]">
        <div className="flex min-w-0 flex-col border-b border-[var(--border)] xl:border-b-0 xl:border-r">
          <div className="admin-fade-up sticky top-0 z-10 flex min-h-12 flex-wrap items-center gap-1 border-b border-[var(--border)] bg-[var(--panel)] px-5 py-2">
            <ToolbarButton
              active={editor?.isActive("bold")}
              disabled={!editor}
              label="B"
              onClick={() => editor?.chain().focus().toggleBold().run()}
            />
            <ToolbarButton
              active={editor?.isActive("italic")}
              disabled={!editor}
              label="I"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
            />
            <ToolbarButton
              active={editor?.isActive("strike")}
              disabled={!editor}
              label="S"
              onClick={() => editor?.chain().focus().toggleStrike().run()}
            />
            <ToolbarDivider />
            <ToolbarButton
              active={editor?.isActive("heading", { level: 1 })}
              disabled={!editor}
              label="H1"
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 1 }).run()
              }
            />
            <ToolbarButton
              active={editor?.isActive("heading", { level: 2 })}
              disabled={!editor}
              label="H2"
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 2 }).run()
              }
            />
            <ToolbarButton
              active={editor?.isActive("heading", { level: 3 })}
              disabled={!editor}
              label="H3"
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 3 }).run()
              }
            />
            <ToolbarDivider />
            <ToolbarButton
              active={editor?.isActive("orderedList")}
              disabled={!editor}
              label="Ordered List"
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            />
            <ToolbarButton
              active={editor?.isActive("bulletList")}
              disabled={!editor}
              label="Bullet List"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
            />
            <ToolbarButton
              active={editor?.isActive("blockquote")}
              disabled={!editor}
              label="Quote Block"
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            />
            <ToolbarDivider />
            <ToolbarButton
              active={editor?.isActive("codeBlock")}
              disabled={!editor}
              label="<Code />"
              mono
              onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
            />
          </div>

          <article className="admin-fade-up mx-auto w-full max-w-4xl px-6 py-12 md:px-12 md:py-16 [animation-delay:90ms]">
            {editor ? (
              <EditorContent editor={editor} />
            ) : (
              <div className="rounded-lg border border-[var(--border)] bg-[var(--panel)] p-6 text-sm text-[var(--muted)]">
                Loading editor...
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
              Realtime abstract syntax tree output mapping structural content.
            </p>

            <pre className="admin-scale-in mt-6 overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--panel-strong)] p-5 font-mono text-xs leading-6 text-[var(--muted)]">
              {formattedJson}
            </pre>
          </section>

          <div className="my-8 h-px bg-[var(--border)]" />

          <section className="admin-stagger space-y-5">
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

