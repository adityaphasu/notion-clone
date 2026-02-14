"use client";

import { ActionTooltip } from "@/components/action-tooltip";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Coffee, Search, Trash, Trash2, Undo } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const TrashBox = () => {
  const router = useRouter();
  const params = useParams();
  const documents = useQuery(api.documents.getTrash);
  const restore = useMutation(api.documents.restore);
  const remove = useMutation(api.documents.remove);
  const removeAll = useMutation(api.documents.removeAll);

  const [search, setSearch] = useState("");

  const filteredDocuments = documents?.filter((document) => {
    return document.title.toLowerCase().includes(search.toLowerCase());
  });

  const onClick = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  const onRestore = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    documentId: Id<"documents">,
  ) => {
    event.stopPropagation();
    const promise = restore({ id: documentId });

    toast.promise(promise, {
      loading: "Restoring note..",
      success: "Note restored!",
      error: "Failed to restore note.",
    });
  };

  const onRemove = (documentId: Id<"documents">) => {
    const promise = remove({ id: documentId });

    toast.promise(promise, {
      loading: "Deleting note..",
      success: "Note deleted!",
      error: "Failed to delete note.",
    });

    if (params.documentId === documentId) {
      router.push("/documents");
    }
  };

  const onEmptyTrash = () => {
    const promise = removeAll();

    toast.promise(promise, {
      loading: "Emptying trash..",
      success: "Trash emptied!",
      error: "Failed to empty trash.",
    });

    if (params.documentId) {
      const isCurrentDocInTrash = documents?.some(
        (doc) => doc._id === params.documentId,
      );
      if (isCurrentDocInTrash) {
        router.push("/documents");
      }
    }
  };

  if (documents === undefined) {
    return (
      <div
        className="flex h-full items-center justify-center p-4"
        aria-busy="true"
        aria-label="loading"
      >
        <Spinner size="md" />
      </div>
    );
  }

  return (
    <section className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-secondary h-7 px-2 focus-visible:ring-transparent"
          placeholder="Filter by page title..."
          aria-label="Filter by page title"
        />
        {documents.length > 0 && (
          <ConfirmModal onConfirm={onEmptyTrash}>
            <div>
              <ActionTooltip label="Empty trash">
                <div
                  role="button"
                  className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                >
                  <Trash2 className="size-4 text-rose-500" />
                </div>
              </ActionTooltip>
            </div>
          </ConfirmModal>
        )}
      </div>

      <div className="mt-2 px-1 pb-1">
        {documents.length === 0 ? (
          <p className="text-muted-foreground pb-2 text-center text-xs">
            Trash is empty
            <Coffee className="mb-1 ml-1 inline-block size-4" />
          </p>
        ) : (
          filteredDocuments?.length === 0 && (
            <p className="text-muted-foreground pb-2 text-center text-xs">
              No documents found.
            </p>
          )
        )}
        {filteredDocuments?.map((document) => (
          <div
            key={document._id}
            role="button"
            onClick={() => onClick(document._id)}
            className="text-primary hover:bg-primary/5 flex w-full items-center justify-between rounded-sm text-sm"
            aria-label="Document"
          >
            <span className="truncate pl-2">{document.title}</span>
            <div className="flex items-center">
              <ActionTooltip label="Restore page">
                <button
                  onClick={(e) => onRestore(e, document._id)}
                  className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                  aria-label="Restore Document"
                >
                  <Undo className="text-muted-foreground h-4 w-4" />
                </button>
              </ActionTooltip>
              <ConfirmModal onConfirm={() => onRemove(document._id)}>
                <div>
                  <ActionTooltip label="Delete forever">
                    <button
                      className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                      aria-label="Delete Permanently"
                    >
                      <Trash className="text-muted-foreground h-4 w-4" />
                    </button>
                  </ActionTooltip>
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
