"use client";

import { Toaster, ToasterProps } from "sonner";
import { useTheme } from "next-themes";

export function ToasterProvider() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      richColors
      toastOptions={{
        classNames: {
          toast:
            resolvedTheme === "dark"
              ? "bg-[#171717]! text-white!"
              : "bg-white!",
        },
      }}
      position="bottom-center"
      theme={resolvedTheme as ToasterProps["theme"]}
    />
  );
}
