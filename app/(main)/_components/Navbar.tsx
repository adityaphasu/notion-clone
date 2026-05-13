"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { MenuIcon, Star } from "lucide-react";
import { useParams } from "next/navigation";
import { Title } from "./Title";
import { Banner } from "./Banner";
import { Menu } from "./Menu";
import { Publish } from "./Publish";
import { ActionTooltip } from "@/components/action-tooltip";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}

export const Navbar = ({ isCollapsed, onResetWidth }: NavbarProps) => {
  const params = useParams();

  const toggleFavorite = useMutation(api.documents.toggleFavorite);
  const document = useQuery(api.documents.getById, {
    documentId: params.documentId as Id<"documents">,
  });

  const onToggleFavorite = () => {
    if (!document) return;
    toggleFavorite({ id: document._id });
  };

  if (document === undefined) {
    return (
      <nav className="bg-background dark:bg-dark flex w-full items-center justify-between px-3 py-2">
        <Title.Skeleton />
        <div className="flex items-center gap-x-2">
          <Menu.Skeleton />
        </div>
      </nav>
    );
  }

  if (document === null) {
    return null;
  }

  return (
    <>
      <nav className="bg-background dark:bg-dark flex w-full items-center gap-x-2 px-3 py-2">
        {isCollapsed && (
          <ActionTooltip label="Open sidebar (Ctrl + \)">
            <button aria-label="Menu" onClick={onResetWidth}>
              <MenuIcon className="text-muted-foreground h-6 w-6" />
            </button>
          </ActionTooltip>
        )}
        <div className="flex w-full items-center justify-between">
          <Title initialData={document} />
          <div className="flex shrink-0 items-center">
            <Publish initialData={document} />
            <ActionTooltip
              label={document.isFavorite ? "Unfavorite" : "Favorite"}
            >
              <Button
                variant="ghost"
                onClick={onToggleFavorite}
                aria-label={document.isFavorite ? "Unfavorite" : "Favorite"}
              >
                <Star
                  className={cn(
                    "text-muted-foreground size-4.5",
                    document.isFavorite && "fill-yellow-400 text-yellow-400",
                  )}
                />
              </Button>
            </ActionTooltip>
            <Menu documentId={document._id} />
          </div>
        </div>
      </nav>
      {document.isArchived && <Banner documentId={document._id} />}
    </>
  );
};
