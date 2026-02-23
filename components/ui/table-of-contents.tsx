"use client";

import { useEffect, useState, useRef } from "react";
import { BlockNoteEditor } from "@blocknote/core";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type HeadingItem = {
  id: string;
  text: string;
  level: 1 | 2 | 3;
};

interface TableOfContentsProps {
  editor: BlockNoteEditor | null;
}

export const TableOfContents = ({ editor }: TableOfContentsProps) => {
  const [headings, setHeadings] = useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!editor) return;

    const extractHeadings = () => {
      const items: HeadingItem[] = [];

      editor.forEachBlock((block) => {
        if (
          block.type === "heading" &&
          (block.props.level === 1 ||
            block.props.level === 2 ||
            block.props.level === 3)
        ) {
          const text = block.content
            .filter((c) => c.type === "text")
            .map((c) => c.text)
            .join("");

          if (text.trim()) {
            items.push({
              id: block.id,
              text,
              level: block.props.level as 1 | 2 | 3,
            });
          }
        }
        return true;
      });

      setHeadings(items);
    };

    extractHeadings();
    const unsubscribe = editor.onChange(extractHeadings);
    return () => unsubscribe();
  }, [editor]);

  const handleClick = (id: string) => {
    setActiveId(id);
    const el = document.querySelector(`[data-id="${id}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 200);
  };

  if (!headings.length) return null;

  return (
    <div className="fixed top-1/2 right-5 z-50 -translate-y-1/2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            className="flex cursor-default flex-col items-center gap-1.5 px-1.5 py-3"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {headings.map((heading) => (
              <button
                key={heading.id}
                onClick={() => handleClick(heading.id)}
                title={heading.text}
                className={cn(
                  "bg-muted-foreground/40 hover:bg-muted-foreground/80 rounded-full transition-all duration-150 hover:scale-110",
                  heading.level === 1 && "h-0.75 w-6",
                  heading.level === 2 && "h-0.75 w-4",
                  heading.level === 3 && "h-0.75 w-3",
                  activeId === heading.id && "bg-primary/80",
                )}
              />
            ))}
          </div>
        </PopoverTrigger>
        <PopoverContent
          side="left"
          align="center"
          sideOffset={8}
          className="w-56 p-3"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <p className="text-muted-foreground mb-2 text-[10px] font-semibold tracking-widest uppercase">
            Page Navigation
          </p>
          <div className="flex flex-col gap-0.5">
            {headings.map((heading) => (
              <button
                key={heading.id}
                onClick={() => handleClick(heading.id)}
                className={cn(
                  "hover:bg-accent hover:text-accent-foreground text-foreground/80 w-full truncate rounded-sm px-3 py-1 text-left text-sm transition-colors",
                  activeId === heading.id &&
                    "bg-accent text-accent-foreground font-semibold",
                )}
              >
                {heading.text}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
