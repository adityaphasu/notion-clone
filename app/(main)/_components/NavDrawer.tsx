import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNavDrawer } from "@/hooks/useNavDrawer";
import { UserItem } from "./UserItem";
import { ActionTooltip } from "@/components/action-tooltip";
import {
  ChevronsRight,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
} from "lucide-react";
import { FavoritesList } from "./FavoritesList";
import { DocumentList } from "./DocumentList";
import { Item } from "./Item";
import { TrashBox } from "./TrashBox";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useSearch } from "@/hooks/useSearch";
import { useSettings } from "@/hooks/useSettingsModal";

type NavDrawerProps = {
  resetWidth: () => void;
  isMobile: boolean;
};

const NavDrawer = ({ resetWidth, isMobile }: NavDrawerProps) => {
  const router = useRouter();

  const search = useSearch();
  const settings = useSettings();

  const [isEdgeHovered, setIsEdgeHovered] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const create = useMutation(api.documents.create);

  const { isInnerPopoverOpen, setInnerPopoverOpen } = useNavDrawer();
  const open = isEdgeHovered || isDrawerOpen || isInnerPopoverOpen;

  const handleCreate = () => {
    const promise = create({ title: "Untitled" }).then((documentId) =>
      router.push(`/documents/${documentId}`),
    );

    toast.promise(promise, {
      loading: "Creating a new note....",
      success: "New note created.",
      error: "Failed to create a note.",
    });
  };

  return (
    <div>
      <Popover open={open}>
        <PopoverTrigger asChild>
          <span
            onMouseEnter={() => setIsEdgeHovered(true)}
            onMouseLeave={() => setTimeout(() => setIsEdgeHovered(false), 500)}
            className="absolute top-0 left-0 z-200 h-full w-3.5"
          ></span>
        </PopoverTrigger>
        <PopoverContent
          side="right"
          align="center"
          sideOffset={-24}
          className="bg-secondary w-75 rounded-tl-none rounded-bl-none border border-gray-300 pt-2 pr-0 pb-3 pl-2"
          onMouseEnter={() => setIsDrawerOpen(true)}
          onMouseLeave={() => setIsDrawerOpen(false)}
        >
          <div className="relative flex items-center justify-between gap-4 px-2">
            <UserItem navDrawer />
            <ActionTooltip label="Lock sidebar open (Ctrl + \)">
              <div
                onClick={resetWidth}
                role="button"
                aria-label="Open full sidebar"
                className={cn(
                  "text-muted-foreground h-6 w-6 rounded-sm transition hover:bg-neutral-300 dark:hover:bg-neutral-600",
                )}
              >
                <ChevronsRight className="h-6 w-6" />
              </div>
            </ActionTooltip>
          </div>
          <div className="flex items-center justify-between gap-2 px-2 pb-2">
            <div className="flex items-center justify-center">
              <Item
                label="Search"
                icon={Search}
                onClick={search.onOpen}
                navDrawer
              />
              <Item
                label="New Page"
                icon={PlusCircle}
                onClick={handleCreate}
                navDrawer
              />
            </div>
            <ActionTooltip label="Settings">
              <div className="justify-end">
                <Item icon={Settings} onClick={settings.onOpen} navDrawer />
              </div>
            </ActionTooltip>
          </div>
          <div className="max-h-[65vh] overflow-y-auto pb-3">
            <FavoritesList navDrawer />
            <div>
              <p className="text-muted-foreground/60 px-3 py-1 text-xs font-medium">
                Notes
              </p>
              <DocumentList navDrawer />
            </div>
            <Item onClick={handleCreate} icon={Plus} label="Add a page" />
            <Popover onOpenChange={setInnerPopoverOpen}>
              <PopoverTrigger className="mt-3 w-full">
                <Item label="Trash" icon={Trash} />
              </PopoverTrigger>
              <PopoverContent
                side={isMobile ? "bottom" : "right"}
                className="w-72 p-0"
                collisionPadding={16}
              >
                <TrashBox />
              </PopoverContent>
            </Popover>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
export default NavDrawer;
