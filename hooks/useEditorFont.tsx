import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useLocalStorage } from "usehooks-ts";

export type EditorFont = "default" | "Lora" | "JetBrains Mono";

interface UseEditorFontOptions {
  enabled?: boolean;
}

export const useEditorFont = ({ enabled = true }: UseEditorFontOptions) => {
  const [cachedFont, setCachedFont] = useLocalStorage<EditorFont>(
    "zotion-editor-font",
    "default",
  );

  const settings = useQuery(
    api.userSettings.getUserSettings,
    enabled ? {} : "skip",
  );
  const updateSettings = useMutation(api.userSettings.updateUserSettings);
  const isFontLoading = enabled && settings === undefined;

  const editorFont: EditorFont =
    (settings?.editorFont as EditorFont) ?? cachedFont;

  const setEditorFont = (font: EditorFont) => {
    if (!enabled) return;
    setCachedFont(font);
    updateSettings({ editorFont: font }).catch(console.error);
  };

  return { editorFont, setEditorFont, isFontLoading };
};
