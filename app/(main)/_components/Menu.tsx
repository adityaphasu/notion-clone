"use client";

import { useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AArrowDown,
  Maximize2,
  MoreHorizontal,
  Settings,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSettings } from "@/hooks/useSettingsModal";
import { ActionTooltip } from "@/components/action-tooltip";
import { useWordCount } from "@/hooks/useWordCount";
import { Switch } from "@/components/ui/switch";

interface MenuProps {
  documentId: Id<"documents">;
}

export const Menu = ({ documentId }: MenuProps) => {
  const router = useRouter();

  const settings = useSettings();
  const words = useWordCount();

  const document = useQuery(api.documents.getById, {
    documentId,
  });
  const archive = useMutation(api.documents.archive);
  const update = useMutation(api.documents.update);

  const isFullWidth = document?.fullWidth ?? true;
  const isSmallText = !!document?.smallText;
  console.log(document?.fullWidth);

  const onArchive = () => {
    router.push("/documents");
    const promise = archive({ id: documentId });

    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Note moved to trash!",
      error: "Failed to archive note.",
    });
  };

  const onFullWidthChange = (checked: boolean) => {
    update({
      id: documentId,
      fullWidth: checked,
    });
  };

  const onSmallTextChange = (checked: boolean) => {
    update({
      id: documentId,
      smallText: checked,
    });
  };

  return (
    <DropdownMenu>
      <ActionTooltip label="Page actions">
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="ghost" aria-label="Page actions">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
      </ActionTooltip>
      <DropdownMenuContent
        className="w-65 px-2"
        align="end"
        alignOffset={8}
        forceMount
      >
        <DropdownMenuItem
          className="flex items-center justify-between"
          onSelect={(e) => e.preventDefault()}
          onClick={() => {
            onSmallTextChange(!isSmallText);
          }}
        >
          <div className="flex items-center justify-between gap-1">
            <AArrowDown className="mr-2 h-4 w-4" />
            Small text
          </div>
          <Switch
            size="sm"
            checked={isSmallText}
            onCheckedChange={onSmallTextChange}
          />
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          onClick={() => {
            onFullWidthChange(!isFullWidth);
          }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center justify-between gap-1">
            <Maximize2 className="mr-2 h-4 w-4 rotate-45" />
            Full width
          </div>
          <Switch
            size="sm"
            checked={isFullWidth}
            onCheckedChange={onFullWidthChange}
          />
        </DropdownMenuItem>
        <DropdownMenuSeparator className="h-px" />
        <DropdownMenuItem onClick={settings.onOpen}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onArchive}>
          <Trash className="mr-2 h-4 w-4" />
          Move to Trash
        </DropdownMenuItem>
        <DropdownMenuSeparator className="text-gray-500" />
        <div className="text-muted-foreground/70 space-y-0.5 p-2 text-[.6875rem]">
          <p>
            Word count: {words.wordCount}{" "}
            {words.wordCount === 1 ? "word" : "words"}
          </p>
          <p>
            Last edited on{" "}
            {document
              ? new Date(
                  document.updatedAt ?? document._creationTime,
                ).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : "..."}
          </p>
          <p>
            Created on{" "}
            {document
              ? new Date(document._creationTime).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "..."}
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

Menu.Skeleton = function MenuSkeleton() {
  return <Skeleton className="h-8 w-8" />;
};
