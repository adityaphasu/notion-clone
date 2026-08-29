import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import Image from "next/image";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const Logo = () => {
  return (
    <div className="flex items-center justify-center gap-x-2">
      <Image
        width={485.44}
        height={505.7}
        src="/logo.svg"
        alt="logo"
        className="h-10 w-10 dark:hidden"
      />
      <Image
        width={485.44}
        height={505.7}
        src="/logo-dark.svg"
        alt="logo"
        className="hidden h-10 w-10 dark:block"
      />
      <span
        className={cn(
          "bg-linear-to-r from-[#111111] via-[#4b4b4b] to-[#a4a4a4] bg-clip-text text-xl font-semibold tracking-tighter text-transparent",
          "dark:from-[#f5f5f5] dark:via-[#d4d4d4] dark:to-[#8e8e8e]",
          font.className,
        )}
      >
        <span className="text-2xl">Z</span>otion
      </span>
    </div>
  );
};
