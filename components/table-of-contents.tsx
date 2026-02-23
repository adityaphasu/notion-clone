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
  const [observerHeadingId, setObserverHeadingId] = useState<string | null>(
    null,
  );
  const [open, setOpen] = useState(false);

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

  useEffect(() => {
    if (!headings.length) return;

    const observers: IntersectionObserver[] = [];

    headings.forEach((heading) => {
      const el = document.querySelector(`[data-id="${heading.id}"]`);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setObserverHeadingId(heading.id);
          }
        },
        {
          root: null,
          rootMargin: "-20% 0px -70% 0px",
          threshold: 0,
        },
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [headings]);

  const handleClick = (id: string) => {
    setActiveId(id);
    const el = document.querySelector(`[data-id="${id}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleMouseEnter = () => {
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

  if (!headings.length) return null;

  return (
    <div className="fixed top-1/2 right-5 z-50 -translate-y-1/2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            className="flex cursor-default flex-col items-center gap-2 px-1.5 py-3"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {headings.map((heading) => (
              <span
                key={heading.id}
                title={heading.text}
                className={cn(
                  "bg-muted-foreground/40 hover:bg-muted-foreground/80 rounded-full transition-all duration-150",
                  heading.level === 1 && "h-0.75 w-6",
                  heading.level === 2 && "h-0.75 w-5",
                  heading.level === 3 && "h-0.75 w-4",
                  observerHeadingId === heading.id && "bg-primary/80",
                )}
              />
            ))}
          </div>
        </PopoverTrigger>
        <PopoverContent
          side="left"
          align="center"
          sideOffset={-30}
          className="w-56 px-1 py-3"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <p className="text-muted-foreground mb-2 px-2 text-[10px] font-semibold tracking-widest uppercase">
            Page Navigation
          </p>
          <div className="max-h-[50vh] space-y-0.5 overflow-y-auto">
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
