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

const getMediaUrls = (editor: BlockNoteEditor): Set<string> => {
  const urls = new Set<string>();

  editor.forEachBlock((block) => {
    if (MEDIA_BLOCK_TYPES.has(block.type)) {
      const url = (block.props as any)?.url;
      if (url && typeof url === "string" && url.trim() !== "") {
        urls.add(url);
      }
    }
    return true;
  });

  return urls;
};

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
  const trackedUrlsRef = useRef<Set<string>>(new Set());

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
    if (editor) {
      trackedUrlsRef.current = getMediaUrls(editor);
    }
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor]);

  const handleEditorChange = () => {
    const currentUrls = getMediaUrls(editor);
    const previousUrls = trackedUrlsRef.current;

    const removedUrls = [...previousUrls].filter(
      (url) => !currentUrls.has(url),
    );

    removedUrls.forEach((url) => {
      edgestore.publicFiles.delete({ url }).catch((err) => {
        console.warn("Failed to delete file in edgestore:", url, err);
      });
    });
    trackedUrlsRef.current = currentUrls;

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

    const blockEl = (e.target as HTMLElement).closest<HTMLElement>(
      "[data-node-type='blockContainer']",
    );
    if (!blockEl) return;

    const blockId = blockEl.getAttribute("data-id");
    if (!blockId) return;

    const currentBlock = editor.getBlock(blockId);
    if (!currentBlock) return;
    const prevBlock = editor.getPrevBlock(blockId);
    if (!prevBlock) return;

    if (!MEDIA_BLOCK_TYPES.has(prevBlock?.type as string)) return;

    e.stopPropagation();

    const view = (editor as any)._tiptapEditor.view;
    const pos = view.posAtCoords({ left: e.clientX, top: e.clientY });

    if (pos) {
      view.dispatch(
        view.state.tr.setSelection(
          view.state.selection.constructor.near(
            view.state.doc.resolve(pos.pos),
          ),
        ),
      );
    }
    editor.focus();
  };

  return (
    <div
      ref={wrapperRef}
      className="relative flex-1 shrink-0 pb-10"
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
