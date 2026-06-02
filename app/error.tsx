"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const Error = () => {
  return (
    <div className="dark:bg-dark flex h-full flex-col items-center justify-center space-y-4">
      <Image
        src="/error.svg"
        height={800}
        width={1100}
        priority
        alt="error"
        className="size-75 dark:hidden"
      />
      <Image
        src="/error-dark.svg"
        height={800}
        width={1100}
        alt="error"
        priority
        className="hidden size-75 dark:block"
      />
      <h2 className="text-xl font-medium">Something went wrong!</h2>
      <Button asChild>
        <Link href="/documents">Go back</Link>
      </Button>
    </div>
  );
};
export default Error;
