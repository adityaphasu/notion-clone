"use client";

import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ScrollableListProps {
  children: React.ReactNode;
  className?: string;
}

export const ScrollableList = ({
  children,
  className,
}: ScrollableListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const checkForScroll = () => {
    const { current } = scrollRef;
    if (!current) return;

    const { scrollTop, scrollHeight, clientHeight } = current;

    setCanScrollUp(scrollTop > 0);
    setCanScrollDown(scrollTop + clientHeight < scrollHeight - 1);
  };

  useEffect(() => {
    checkForScroll();
  }, [children]);

  const scrollBy = (amount: number) => {
    scrollRef.current?.scrollBy({ top: amount, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        className={cn(
          "from-secondary absolute top-0 right-0 left-0 z-10 mr-1 flex h-6 items-center justify-center bg-linear-to-b to-transparent transition-opacity duration-300",
          canScrollUp ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <button
          onClick={() => scrollBy(-70)}
          className="bg-primary/5 hover:bg-primary/15 rounded-full p-0.5"
        >
          <ChevronUp className="text-muted-foreground size-4" />
        </button>
      </div>

      <div
        ref={scrollRef}
        onScroll={checkForScroll}
        className={cn(
          "max-h-[calc(100vh-224px)] overflow-y-auto",
          "no-scrollbar",
          className,
        )}
      >
        {children}
      </div>

      <div
        className={cn(
          "from-secondary absolute right-0 bottom-0 left-0 z-10 mr-1 flex h-6 items-center justify-center bg-linear-to-t to-transparent transition-opacity duration-300",
          canScrollDown ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <button
          onClick={() => scrollBy(70)}
          className="bg-primary/5 hover:bg-primary/15 rounded-full p-0.5"
        >
          <ChevronDown className="text-muted-foreground size-4" />
        </button>
      </div>
    </div>
  );
};
