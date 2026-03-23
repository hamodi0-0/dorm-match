import Image from "next/image";
import { BeatLoader } from "react-spinners";

export default function RootLoading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-6">
      <div className="flex flex-col items-center gap-5 text-primary">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 p-1.5">
            <Image
              src="/images/rounded-logo.png"
              alt="Dormr Logo"
              width={40}
              height={40}
              priority
            />
          </div>
          <span className="hidden sm:inline font-serif text-3xl font-semibold tracking-[-0.02em] logo-serif text-foreground">
            Dormr
          </span>
        </div>

        <BeatLoader
          color="currentColor"
          size={20}
          margin={4}
          speedMultiplier={0.85}
        />
      </div>
    </div>
  );
}
