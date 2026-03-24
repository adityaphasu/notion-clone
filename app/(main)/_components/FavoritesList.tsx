"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Item } from "./Item";
import { DocumentList } from "./DocumentList";
import { FileIcon } from "lucide-react";
import { toast } from "sonner";

export const FavoritesList = () => {
  const params = useParams();
  const router = useRouter();
  const documents = useQuery(api.documents.getFavorites);
  const toggleFavorite = useMutation(api.documents.toggleFavorite);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onToggleFavorite = (id: Id<"documents">) => {
    const promise = toggleFavorite({ id });
    toast.promise(promise, {
      loading: "Updating favorites...",
      success: "Favorites updated!",
      error: "Failed to update favorites.",
    });
  };

  const onExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (documents === undefined) {
    return (
      <>
        <Item.Skeleton level={0} />
        <Item.Skeleton level={0} />
      </>
    );
  }

  if (documents.length === 0) return null;

  return (
    <div className="w-full">
      <p className="text-muted-foreground/60 px-3 py-1 text-xs font-medium">
        Favorites
      </p>
      {documents.map((document) => (
        <div key={document._id}>
          <Item
            id={document._id}
            onClick={() => router.push(`/documents/${document._id}`)}
            label={document.title}
            icon={FileIcon}
            documentIcon={document.icon}
            active={params.documentId === document._id}
            level={0}
            expanded={expanded[document._id]}
            onExpand={() => onExpand(document._id)}
            isFavorite={document.isFavorite}
            onFavorite={() => onToggleFavorite(document._id)}
          />
          {expanded[document._id] && (
            <DocumentList parentDocumentId={document._id} level={1} />
          )}
        </div>
      ))}
    </div>
  );
};
