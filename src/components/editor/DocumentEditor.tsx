"use client";

import { useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorToolbar } from "@/components/editor/EditorToolbar";
import { cn } from "@/lib/utils/cn";

type DocumentEditorProps = {
  content: string;
  placeholder?: string;
  onChange: (html: string) => void;
  className?: string;
};

export function DocumentEditor({
  content,
  placeholder = "Start writing…",
  onChange,
  className,
}: DocumentEditorProps) {
  const [, setEditorRevision] = useState(0);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: false,
        codeBlock: false,
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: content || "<p></p>",
    editorProps: {
      attributes: {
        class: "gv-editor-content focus:outline-none",
        "aria-label": "Content editor",
      },
    },
    onTransaction: () => {
      setEditorRevision((value) => value + 1);
    },
    onUpdate: ({ editor: instance }) => {
      onChange(instance.getHTML());
    },
  });

  return (
    <div
      className={cn(
        "flex min-h-[20rem] flex-col overflow-hidden rounded-control border border-border bg-background",
        className,
      )}
    >
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} className="gv-editor min-h-0 flex-1" />
    </div>
  );
}

export type { Editor };
