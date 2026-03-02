"use client";

import {
  BlockNoteEditor,
  PartialBlock,
  createCodeBlockSpec,
  BlockNoteSchema,
} from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { useCoverImage } from "@/hooks/useCoverImage";
import { BlockNoteView } from "@blocknote/mantine";
import { useTheme } from "next-themes";
import { useEdgeStore } from "@/lib/edgestore";
import { codeBlockOptions } from "@blocknote/code-block";
import "@blocknote/core/style.css";
import "@blocknote/mantine/style.css";
import { useEffect, useRef } from "react";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
  onEditorReady?: (editor: BlockNoteEditor) => void;
}

const schema = BlockNoteSchema.create().extend({
  blockSpecs: {
    codeBlock: createCodeBlockSpec({
      ...codeBlockOptions,
      defaultLanguage: "typescript",
      supportedLanguages: {
        typescript: { name: "TypeScript", aliases: ["ts"] },
        javascript: { name: "JavaScript", aliases: ["js"] },
        python: { name: "Python", aliases: ["py"] },
        cpp: { name: "C++", aliases: ["cpp", "c++"] },
        java: { name: "Java" },
        rust: { name: "Rust", aliases: ["rs"] },
        go: { name: "Go" },
        sql: { name: "SQL" },
        html: { name: "HTML" },
        css: { name: "CSS" },
      },
    }),
  },
});
const MEDIA_BLOCK_TYPES = new Set(["image", "video", "audio", "file"]);

const Editor = ({
  onChange,
  initialContent,
  editable = true,
  onEditorReady,
}: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();
  const coverImage = useCoverImage();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleUpload = async (file: File) => {
    const res = await edgestore.publicFiles.upload({ file });
    return res.url;
  };

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    uploadFile: handleUpload,
    schema,
  });

  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor]);

  const handleEditorChange = () => {
    onChange(JSON.stringify(editor.document, null, 2));
  };

  const handleCapture = (e: React.DragEvent) => {
    if (coverImage.isOpen) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!editable || coverImage.isOpen) return;

    const target = e.target as HTMLElement;
    const blockEl = target.closest<HTMLElement>(
      "[data-node-type='blockContainer']",
    );
    if (!blockEl) return;

    const blockId = blockEl.getAttribute("data-id");
    if (!blockId) return;

    const blocks = editor.document;
    const blockIndex = blocks.findIndex((b) => b.id === blockId);
    if (blockIndex < 1) return;

    const prevBlock = blocks[blockIndex - 1];
    const thisBlock = blocks[blockIndex];

    if (
      !MEDIA_BLOCK_TYPES.has(prevBlock?.type as string) ||
      thisBlock?.type !== "paragraph" ||
      (thisBlock.content as any[])?.length !== 0
    ) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    editor.setTextCursorPosition(blockId, "end");
    editor.focus();
  };

  return (
    <div
      ref={wrapperRef}
      className="relative flex-1 shrink-0"
      onDropCapture={handleCapture}
      onDragOverCapture={handleCapture}
      onMouseDown={handleMouseDown}
    >
      <BlockNoteView
        editable={editable && !coverImage.isOpen}
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        onChange={handleEditorChange}
        className="wrap-break-word"
      />
    </div>
  );
};

export default Editor;
