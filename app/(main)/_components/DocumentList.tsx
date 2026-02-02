"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { useParams, useRouter } from "next/navigation";

import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";

import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";

import { Item } from "./Item";

import { FileIcon } from "lucide-react";

interface SortableItemProps {
  document: Doc<"documents">;
  level: number;
  onExpand: (id: string) => void;
  expanded: boolean;
  onRedirect: (id: string) => void;
  activeId?: string | string[];
}
interface DocumentListProps {
  parentDocumentId?: Id<"documents">;
  level?: number;
  data?: Doc<"documents">[];
}

const SortableItem = ({
  document,
  level,
  onExpand,
  expanded,
  onRedirect,
  activeId,
}: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: document._id });

  const style = {
    transform: CSS.Transform.toString(
      transform ? { ...transform, scaleY: 1, scaleX: 1 } : null,
    ),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Item
        id={document._id}
        onClick={() => onRedirect(document._id)}
        label={document.title}
        icon={FileIcon}
        documentIcon={document.icon}
        active={activeId === document._id}
        level={level}
        onExpand={() => onExpand(document._id)}
        expanded={expanded}
      />
      {expanded && (
        <DocumentList parentDocumentId={document._id} level={level + 1} />
      )}
    </div>
  );
};

export const DocumentList = ({
  parentDocumentId,
  level = 0,
}: DocumentListProps) => {
  const params = useParams();
  const router = useRouter();
  const reorder = useMutation(api.documents.reorder);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [orderedDocuments, setOrderedDocuments] = useState<Doc<"documents">[]>(
    [],
  );

  const documents = useQuery(api.documents.getSidebar, {
    parentDocument: parentDocumentId,
  });

  useEffect(() => {
    if (isDragging) {
      return;
    }
    if (documents) {
      setOrderedDocuments(documents);
    }
  }, [documents]);

  const onExpand = (documentId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId],
    }));
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    setIsDragging(false);

    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = orderedDocuments.findIndex(
        (doc) => doc._id === active.id,
      );
      const newIndex = orderedDocuments.findIndex((doc) => doc._id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        setOrderedDocuments((prev) => arrayMove(prev, oldIndex, newIndex));
        reorder({
          id: active.id as Id<"documents">,
          parentDocument: parentDocumentId,
          newOrder: newIndex,
        });
      }
    }
  };

  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  if (documents === undefined) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    );
  }

  return (
    <div className="w-full">
      {orderedDocuments.length === 0 && level !== 0 && (
        <p
          style={{ paddingLeft: level ? `${level * 12 + 25}px` : undefined }}
          className="py-1 text-sm font-medium text-muted-foreground/80"
        >
          No pages inside
        </p>
      )}

      <DndContext
        sensors={sensors}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        collisionDetection={closestCorners}
      >
        <SortableContext
          items={orderedDocuments.map((doc) => doc._id)}
          strategy={verticalListSortingStrategy}
        >
          {orderedDocuments.map((document) => (
            <SortableItem
              key={document._id}
              document={document}
              level={level}
              onExpand={onExpand}
              expanded={expanded[document._id]}
              onRedirect={onRedirect}
              activeId={params.documentId}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};
