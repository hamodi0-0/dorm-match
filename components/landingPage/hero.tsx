import FadeInSection from "@/components/animations/FadeInSection";
import Image from "next/image";

export default function Hero() {
  return (
    <FadeInSection>
      <section className="relative overflow-hidden bg-accent dark:bg-accent/40">
        <div className="max-w-7xl mx-auto px-6 pt-22 pb-28 md:py-44">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-10 md:gap-4 items-center">
            {/* Heading */}
            <div className="max-w-2xl space-y-6">
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
              <div className="relative w-full aspect-[4/3] md:-mr-16 lg:-mr-32">
                <Image
                  src="/images/hero-image3.png"
                  alt="Dormr room illustration"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 65vw"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </FadeInSection>
  );
}
