"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useSettings } from "@/hooks/useSettingsModal";
import { ModeToggle } from "../mode-toggle";
import { EditorFont, useEditorFont } from "@/hooks/useEditorFont";
import { useFocusMode } from "@/hooks/useFocusMode";
import { fontFamilies } from "@/lib/editorFont";

const FONTS: { label: string; value: EditorFont }[] = [
  { label: "Default", value: "default" },
  { label: "Lora", value: "Lora" },
  { label: "JetBrains Mono", value: "JetBrains Mono" },
];

export const SettingsModal = () => {
  const settings = useSettings();
  const { editorFont, setEditorFont } = useEditorFont({
    enabled: settings.isOpen,
  });
  const { focusMode, setFocusMode } = useFocusMode({
    enabled: settings.isOpen,
  });

  return (
    <Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
      <DialogTitle hidden>Settings</DialogTitle>
      <DialogContent className="dark:bg-dark">
        <DialogHeader className="border-b pb-2">
          <h2 className="text-lg font-medium">My settings</h2>
        </DialogHeader>
        <div className="divide-primary/10 divide-y">
          <div className="flex items-center justify-between py-2">
            <div className="flex flex-col gap-y-1">
              <Label>Appearance</Label>
              <span className="text-muted-foreground text-[0.8rem]">
                Customize how Zotion looks on your device.
              </span>
            </div>
            <ModeToggle />
          </div>
          <div className="flex flex-col gap-y-3 py-2">
            <div className="flex flex-col gap-y-1">
              <Label>Editor font</Label>
              <span className="text-muted-foreground text-[0.8rem]">
                Choose the font used in the editor.
              </span>
            </div>
            <div className="flex gap-2">
              {FONTS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setEditorFont(option.value)}
                  className={cn(
                    "hover:bg-primary/5 flex flex-1 flex-col items-center gap-1 rounded-md border px-3 py-2 text-sm transition",
                    editorFont === option.value && "ring-primary ring",
                  )}
                >
                  <span
                    className="text-xl"
                    style={{
                      fontFamily: fontFamilies[option.value],
                    }}
                  >
                    Ag
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 py-2">
            <div className="flex flex-col gap-y-1">
              <Label>Focus mode</Label>
              <span className="text-muted-foreground text-[0.8rem]">
                Collapse the sidebar and topbar to minimize distractions and
                focus on your content.
              </span>
            </div>
            <Switch checked={focusMode} onCheckedChange={setFocusMode} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
