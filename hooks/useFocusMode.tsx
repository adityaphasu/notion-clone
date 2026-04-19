import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export const useFocusMode = () => {
  const settings = useQuery(api.userSettings.getUserSettings);
  const updateSettings = useMutation(api.userSettings.updateUserSettings);

  const focusMode = settings?.focusMode ?? false;

  const setFocusMode = (value: boolean) => {
    updateSettings({ focusMode: value });
  };

  return { focusMode, setFocusMode };
};
