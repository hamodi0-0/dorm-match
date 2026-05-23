import FadeInSection from "@/components/animations/FadeInSection";
import { Sparkle } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <FadeInSection>
      <section className="relative overflow-hidden bg-accent dark:bg-accent/40">
        <div className="max-w-7xl mx-auto px-6 pt-22 pb-28 md:py-44">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-10 md:gap-4 items-center">
            {/* Heading */}

            <div className="max-w-2xl space-y-6">
              <div className="flex items-center">
                <span className="rounded-full inline-flex items-center gap-2 bg-green-500/20 pr-5 pl-3 py-2 text-sm font-bold tracking-wide dark:text-green-500 text-green-700 shadow-sm">
                  <Sparkle className="h-4 w-4 mr-2 dark:text-green-500 text-green-800 animate-pulse" />
                  Find your perfect match
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-medium text-foreground leading-[0.95] tracking-tight">
                Find compatible <span className="text-primary">roommates</span>{" "}
                for university
              </h1>
              <p className="max-w-xl text-base sm:text-lg md:text-xl leading-8 text-muted-foreground">
                Dormr helps university students find places and people that fit
                their lifestyle, with compatibility scoring, real-time chat, and
                a smoother way to manage housing.
              </p>
            </div>

            {/* Right: Hero Image */}
            <div className="relative w-full flex items-center justify-end">
              <div className="relative w-full aspect-4/3 md:-mr-16 lg:-mr-32">
                {/* Main orange bubble */}
                <div className="absolute left-20 top-14 z-0 h-48 w-48 rounded-[2rem] bg-primary/18 dark:bg-primary/60 shadow-[0_26px_50px_-36px_rgba(0,0,0,0.35)] ring-1 ring-primary/20 md:left-24 md:top-16 md:h-56 md:w-56"></div>
                {/* Match card */}
                <div className="absolute right-16 top-14 z-0 h-24 w-24 rounded-[1.5rem] border border-border/70 dark:border-border dark:bg-muted/99 bg-card/90 shadow-[0_22px_40px_-30px_rgba(0,0,0,0.35)] backdrop-blur-sm md:right-20 md:top-16 md:h-28 md:w-28 lg:right-18 lg:top-16">
                  <div className="flex h-full w-full items-center justify-center p-3"></div>
                </div>
                {/* Join button mock */}
                <div className="absolute left-10 bottom-12 z-0 flex h-20 w-28 -rotate-3 items-center justify-center rounded-4xl border border-border/70 bg-background/95  dark:border-border dark:bg-muted/99 shadow-[0_18px_36px_-28px_rgba(0,0,0,0.35)] md:left-14 md:bottom-16 md:h-22 md:w-32 lg:left-16 lg:bottom-14" />
                {/* Small accent square */}
                <div className="absolute right-28 bottom-10 z-0 h-14 w-14 rounded-[1.35rem] dark:bg-primary/60 bg-primary/15 shadow-[0_16px_32px_-24px_rgba(0,0,0,0.35)] md:right-36 md:bottom-14 md:h-16 md:w-16 lg:right-40 lg:bottom-30" />

                <Image
                  src="/images/hero-image3.png"
                  alt="Dormr room illustration"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 65vw"
                  className="relative z-10 object-contain scale-[1.05] md:scale-[1.08]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </FadeInSection>
  );
}
