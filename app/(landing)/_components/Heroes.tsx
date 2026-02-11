import Image from "next/image";

export const Heroes = () => {
  return (
    <div className="flex max-w-5xl flex-col items-center justify-center">
      <div className="flex items-center">
        <div className="relative h-75 w-75 sm:h-87.5 sm:w-87.5 md:h-100 md:w-100">
          <Image
            src="/idea.svg"
            fill
            className="object-contain dark:hidden"
            alt="Idea"
          />
          <Image
            src="/idea-dark.svg"
            fill
            className="hidden object-contain dark:block"
            alt="Idea"
          />
        </div>
        <div className="relative hidden h-100 w-100 md:block">
          <Image
            src="/team.svg"
            fill
            className="object-contain dark:hidden"
            alt="Team"
          />
          <Image
            src="/team-dark.svg"
            fill
            className="hidden object-contain dark:block"
            alt="Team"
          />
        </div>
      </div>
    </div>
  );
};
