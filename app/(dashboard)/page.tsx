import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Page() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-4xl font-bold text-primary-900 dark:text-primary-50">
        Hello, Kel!
      </h1>
      <p className="text-lg text-secondary-700 dark:text-secondary-300">
        Gassssssssssssssss dev time
      </p>
      <Button className="mt-4 w-full max-w-xs">
        Order !
      </Button>
    </div>
  );
}
