import { create } from "zustand";

type NavDrawer = {
  isInnerPopoverOpen: boolean;
  setInnerPopoverOpen: (open: boolean) => void;
};

export const useNavDrawer = create<NavDrawer>((set) => ({
  isInnerPopoverOpen: false,
  setInnerPopoverOpen: (open) => set({ isInnerPopoverOpen: open }),
}));
