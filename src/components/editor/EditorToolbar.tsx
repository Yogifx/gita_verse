"use client";

import type { ReactNode } from "react";
import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo2,
  Redo2,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

type EditorToolbarProps = {
  editor: Editor | null;
};

export function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) {
    return (
      <div className="flex h-11 items-center border-b border-border px-2 text-caption text-foreground-muted">
        Loading editor…
      </div>
    );
  }

  return (
    <div
      className="flex flex-wrap items-center gap-0.5 border-b border-border bg-surface px-2 py-1.5"
      role="toolbar"
      aria-label="Text formatting"
    >
      <ToolbarButton
        label="Undo"
        active={false}
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo2 className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        label="Redo"
        active={false}
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo2 className="h-3.5 w-3.5" />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        label="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        label="Underline"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="h-3.5 w-3.5" />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        label="Heading 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="h-3.5 w-3.5" />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        label="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        label="Quote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        label="Divider"
        active={false}
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Minus className="h-3.5 w-3.5" />
      </ToolbarButton>
    </div>
  );
}

function ToolbarDivider() {
  return <span className="mx-1 h-5 w-px bg-border" aria-hidden />;
}

function ToolbarButton({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "rounded-control p-1.5 text-foreground-secondary transition-colors duration-fast hover:bg-muted hover:text-foreground",
        active && "bg-primary-muted text-gold",
        disabled && "cursor-not-allowed opacity-40 hover:bg-transparent hover:text-foreground-secondary",
      )}
    >
      {children}
    </button>
  );
}
