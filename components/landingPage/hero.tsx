import { CheckCircle2, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-full text-sm font-medium text-indigo-700 dark:text-indigo-300">
              <Sparkles className="h-4 w-4" />
              Find Your Perfect Match
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Find compatible{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                roommates
              </span>{" "}
              for university
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed">
              Match with students who share your lifestyle, study habits, and
              interests. Make university housing stress-free.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />
                <span>Free to use</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />
                <span>Verified students</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />
                <span>Secure & private</span>
              </div>
            </div>
          </div>

          {/* Right: Visual/Mockup */}
          <div className="relative">
            <div className="relative bg-card rounded-2xl shadow-2xl dark:shadow-indigo-900/20 p-8 border border-border">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-indigo-500 to-purple-500"></div>
                  <div>
                    <div className="h-4 w-32 bg-muted rounded"></div>
                    <div className="h-3 w-24 bg-muted/50 rounded mt-2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-muted/50 rounded"></div>
                  <div className="h-3 w-5/6 bg-muted/50 rounded"></div>
                  <div className="h-3 w-4/6 bg-muted/50 rounded"></div>
                </div>
                <div className="flex gap-2 pt-4">
                  <div className="h-8 w-24 bg-indigo-100 dark:bg-indigo-900/50 rounded-full"></div>
                  <div className="h-8 w-24 bg-purple-100 dark:bg-purple-900/50 rounded-full"></div>
                  <div className="h-8 w-24 bg-pink-100 dark:bg-pink-900/50 rounded-full"></div>
                </div>
                <div className="pt-4 flex items-center justify-between border-t border-border">
                  <div className="h-9 w-28 flex items-center justify-center bg-green-100 dark:bg-green-900/50 rounded-full">
                    <div className="text-md font-semibold text-green-500">
                      98% Match
                    </div>
                  </div>

                  <div className="h-10 w-28 bg-linear-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 rounded-lg"></div>
                </div>
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-card rounded-2xl shadow-lg dark:shadow-indigo-900/20 px-6 py-3 border border-border">
              <div className="text-2xl font-bold text-foreground">1000+</div>
              <div className="text-sm text-muted-foreground">
                Active Students
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
