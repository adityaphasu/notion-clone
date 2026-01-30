"use client";

import { ElementRef, useEffect, useRef, useState } from "react";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

import { useCoverImage } from "@/hooks/useCoverImage";

import { Button } from "./ui/button";
import TextareaAutosize from "react-textarea-autosize";
import { IconPicker } from "./icon-picker";
import { ImageIcon, Smile, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  initialData: Doc<"documents">;
  preview?: boolean;
}

export const Toolbar = ({ initialData, preview }: ToolbarProps) => {
  const inputRef = useRef<ElementRef<"textarea">>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialData.title);

  const update = useMutation(api.documents.update);
  const removeIcon = useMutation(api.documents.removeIcon);
  const coverImage = useCoverImage();

  const enableInput = () => {
    if (preview) return;
    setIsEditing(true);
    inputRef.current?.focus();
  };

  const disableInput = () => setIsEditing(false);

  useEffect(() => {
    if (!isEditing) {
      setValue(initialData.title);
    }
  }, [initialData.title, isEditing]);

  useEffect(() => {
    if (value === initialData.title) return;

    const timer = setTimeout(() => {
      update({
        id: initialData._id,
        title: value || "Untitled",
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [value, initialData._id, initialData.title, update]);

  const onInput = (value: string) => {
    setValue(value);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      inputRef.current?.blur();
    }
  };

  const onIconSelect = (icon: string) => {
    update({
      id: initialData._id,
      icon,
    });
  };

  const onRemoveIcon = () => {
    removeIcon({
      id: initialData._id,
    });
  };

  return (
    <div className="group relative pl-12">
      {!!initialData.icon && !preview && (
        <div
          className={cn(
            "group/icon flex items-center gap-x-2",
            !initialData.coverImage && "pt-6",
            initialData.coverImage && "-mt-8",
          )}
        >
          <IconPicker onChange={onIconSelect}>
            <p className="text-6xl transition hover:opacity-75">
              {initialData.icon}
            </p>
          </IconPicker>
          <Button
            onClick={onRemoveIcon}
            className="rounded-full text-xs text-muted-foreground opacity-0 transition group-hover/icon:opacity-100"
            variant="outline"
            size="icon"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {!!initialData.icon && preview && (
        <p
          className={cn(
            "text-6xl",
            !initialData.coverImage && "pt-6",
            initialData.coverImage && "-mt-8",
          )}
        >
          {initialData.icon}
        </p>
      )}
      <div className="flex items-center gap-x-1 py-2 group-hover:opacity-100 md:opacity-0">
        {!initialData.icon && !preview && (
          <IconPicker asChild onChange={onIconSelect}>
            <Button
              className="text-xs text-muted-foreground"
              variant="outline"
              size="sm"
            >
              <Smile className="mr-2 h-4 w-4" />
              Add icon
            </Button>
          </IconPicker>
        )}
        {!initialData.coverImage && !preview && (
          <Button
            onClick={coverImage.onOpen}
            className="text-xs text-muted-foreground"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Add Cover
          </Button>
        )}
      </div>

      <TextareaAutosize
        ref={inputRef}
        placeholder="Untitled"
        spellCheck="false"
        onBlur={disableInput}
        onFocus={() => setIsEditing(true)}
        onKeyDown={onKeyDown}
        value={value}
        disabled={preview}
        onChange={(e) => onInput(e.target.value)}
        className={cn(
          "resize-none break-words bg-transparent text-5xl font-bold outline-none",
          "text-[#3F3F3F] placeholder:text-gray-300 disabled:cursor-default dark:text-[#CFCFCF]",
          !isEditing && "cursor-pointer",
        )}
      />
    </div>
  );
};
