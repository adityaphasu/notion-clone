"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useMediaQuery } from "usehooks-ts";
import { Button } from "./ui/button";
import { EllipsisVertical, ImageIcon, X } from "lucide-react";
import { useCoverImage } from "@/hooks/useCoverImage";
import { useFocusMode } from "@/hooks/useFocusMode";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { useEdgeStore } from "@/lib/edgestore";
import { Skeleton } from "./ui/skeleton";
import { Spinner } from "./spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface CoverImageProps {
  url?: string;
  preview?: boolean;
}

export const Cover = ({ url, preview }: CoverImageProps) => {
  const { edgestore } = useEdgeStore();
  const [isRemoving, setIsRemoving] = useState(false);

  const params = useParams();
  const coverImage = useCoverImage();
  const { focusMode } = useFocusMode({ enabled: !preview });

  const removeCoverImage = useMutation(api.documents.removeCoverImage);

  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");

  const onRemove = async () => {
    setIsRemoving(true);
    try {
      await removeCoverImage({
        id: params.documentId as Id<"documents">,
      });
      if (url && url.startsWith("http")) {
        await edgestore.publicFiles.delete({ url });
      }
    } catch (err) {
      console.error("Failed to remove cover image:", err);
    } finally {
      setIsRemoving(false);
    }
  };

  const isUrl = url?.startsWith("http");

  return (
    <div
      className={cn(
        "group relative z-10 w-full",
        url && "bg-muted h-[35vh] md:h-48.5",
        !url && !focusMode && "h-[12vh] md:h-25",
        !url && focusMode && "h-20 md:h-20",
      )}
    >
      {!!url &&
        (isUrl ? (
          <Image src={url} fill alt="cover" className="object-cover" priority />
        ) : (
          <div className="h-full w-full" style={{ background: url }} />
        ))}
      {url && !preview && canHover && (
        <div className="absolute right-5 bottom-5 flex items-center gap-x-2 opacity-0 group-hover:opacity-100">
          <Button
            onClick={() => coverImage.onReplace(url)}
            className="text-muted-foreground dark:bg-dark dark:hover:bg-dark/80 text-xs"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Change cover
          </Button>
          <Button
            onClick={onRemove}
            className="text-muted-foreground dark:bg-dark dark:hover:bg-dark/80 text-xs"
            variant="outline"
            size="sm"
            disabled={isRemoving}
          >
            {isRemoving ? (
              <Spinner size="sm" />
            ) : (
              <>
                <X className="mr-2 h-4 w-4" />
                Remove
              </>
            )}
          </Button>
        </div>
      )}
      {url && !preview && !canHover && (
        <div className="absolute right-2 bottom-2 flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-muted-foreground dark:bg-dark flex size-8 items-center justify-center rounded-full bg-white p-1 text-xs">
                <EllipsisVertical className="size-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" alignOffset={7} sideOffset={5}>
              <DropdownMenuItem onClick={() => coverImage.onReplace(url)}>
                <ImageIcon className="mr-2 h-4 w-4" />
                Change cover
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onRemove} disabled={isRemoving}>
                <X className="mr-2 h-4 w-4" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
};

Cover.Skeleton = function CoverSkeleton() {
  return <Skeleton className="h-[12vh] w-full" />;
};
