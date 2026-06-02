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
      <p className={cn("font-semibold", font.className)}>Zotion</p>
    </div>
  );
};
