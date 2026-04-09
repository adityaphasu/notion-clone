import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export type EditorFont = "default" | "Lora" | "JetBrains Mono";

interface UseEditorFontOptions {
  enabled?: boolean;
}

export const useEditorFont = ({ enabled = true }: UseEditorFontOptions) => {
  const settings = useQuery(
    api.userSettings.getUserSettings,
    enabled ? {} : "skip",
  );
  const updateSettings = useMutation(api.userSettings.updateUserSettings);

  const editorFont: EditorFont =
    (settings?.editorFont as EditorFont) ?? "default";

  const setEditorFont = (font: EditorFont) => {
    if (!enabled) return;
    updateSettings({ editorFont: font }).catch(console.error);
  };

  return [editorFont, setEditorFont] as const;
};
