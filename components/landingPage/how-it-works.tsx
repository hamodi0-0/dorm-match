"use client";

import { CheckCircle2, FileEdit, Home, UserPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import FadeInSection from "@/components/animations/FadeInSection";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import Image from "next/image";

export default function HowItWorks() {
  const router = useRouter();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const isOnboarded = useAuthStore((s) => s.isOnboarded);
  const setShowLogin = useAuthStore((s) => s.setShowLogin);
  const handleSetupProfile = useAuthStore((s) => s.handleSetupProfile);

  const handleGoToDashboard = () => {
    if (!isLoggedIn) {
      setShowLogin(true);
    } else if (!isOnboarded) {
      router.push("/onboarding");
    } else {
      router.push("/student/dashboard");
    }
  };
  return (
    <FadeInSection>
      <section id="how-it-works" className="py-32 bg-accent overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-4xl font-serif font-medium text-foreground mb-4">
              How It Works ?
            </h2>
            <p className="text-xl text-muted-foreground">
              Get started in three simple steps
            </p>
          </div>

          <div className="flex flex-col lg:block relative space-y-12 lg:space-y-0">
            {/* Step 1 */}
            <div className="lg:w-[42%] lg:ml-[22%] relative z-10 lg:-mb-12 lg:rotate-[-3deg] lg:origin-bottom-right">
              <FadeInSection>
                <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg bg-background/95 backdrop-blur-sm hover:scale-[1.02] border-primary/10">
                  <CardContent className="p-6 md:p-7">
                    <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-5 py-2 text-sm font-semibold tracking-wide text-primary mb-5">
                      STEP 1
                    </div>
                    <h3 className="text-2xl font-serif font-medium text-foreground mb-3 flex items-center gap-2">
                      <UserPlus className="h-5 w-5 text-primary" /> Create Your
                      Account
                    </h3>
                    <p className="text-muted-foreground text-lg">
                      Sign up with your university email to get started.
                      It&apos;s quick, free, and secure.
                    </p>
                  </CardContent>
                </Card>
              </FadeInSection>
            </div>

            {/* Row 2 (Image + Step 2) */}
            <div className="lg:flex lg:items-center relative z-0">
              {/* Image */}
              <div className="lg:w-[58%] flex justify-center lg:justify-end pointer-events-none lg:pr-8 lg:rotate-[2deg] lg:origin-center">
                <FadeInSection>
                  <Image
                    src="/images/how-it-works-image2.png"
                    alt="Dormr match process workflow"
                    width={800}
                    height={800}
                    className="w-full max-w-[400px] lg:rotate-[-5deg] lg:max-w-[600px] h-auto object-contain drop-shadow-xl transition-transform duration-500"
                  />
                </FadeInSection>
              </div>

              {/* Step 2 */}
              <div className="lg:w-[42%] relative z-10 lg:-ml-0 lg:mt-20 lg:rotate-[5deg] lg:origin-top-left">
                <FadeInSection>
                  <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg bg-background/95 backdrop-blur-sm hover:scale-[1.02] border-primary/10">
                    <CardContent className="p-6 md:p-7">
                      <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-semibold tracking-wide text-primary mb-5">
                        STEP 2
                      </div>
                      <h3 className="text-2xl font-serif font-medium text-foreground mb-3 flex items-center gap-2">
                        <FileEdit className="h-5 w-5 text-primary" /> Complete
                        Your Profile
                      </h3>
                      <p className="text-muted-foreground text-lg mb-6">
                        Tell us about your lifestyle, preferences, and what
                        you&apos;re looking for in a roommate. This helps us
                        find your perfect match.
                      </p>
                      {isLoggedIn && !isOnboarded ? (
                        <Button
                          size="lg"
                          className="w-full sm:w-auto transition-transform hover:scale-105"
                          onClick={() => handleSetupProfile(isLoggedIn)}
                        >
                          Set Up My Profile
                        </Button>
                      ) : !isLoggedIn ? (
                        <Button
                          size="lg"
                          variant="default"
                          className="w-full sm:w-auto transition-transform hover:scale-105"
                          onClick={() => setShowLogin(true)}
                        >
                          Sign In to Continue
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2 text-primary font-medium bg-primary/5 p-3 rounded-lg border border-primary/10">
                          <CheckCircle2 className="h-5 w-5" />
                          <span>Profile Complete!</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </FadeInSection>
              </div>
            </div>

            {/* Step 3 */}
            <div className="lg:w-[42%] lg:ml-[22%] relative z-10 lg:mt-16 lg:rotate-[-3deg] lg:origin-top-right">
              <FadeInSection>
                <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg bg-background/95 backdrop-blur-sm hover:scale-[1.02] border-primary/10">
                  <CardContent className="p-6 md:p-7">
                    <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-semibold tracking-wide text-primary mb-5">
                      STEP 3
                    </div>
                    <h3 className="text-2xl font-serif font-medium text-foreground mb-3 flex items-center gap-2">
                      <Home className="h-5 w-5 text-primary" /> Start Browsing
                      &amp; Matching
                    </h3>
                    <p className="text-muted-foreground text-lg mb-6">
                      Browse available listings, see your compatibility scores,
                      and connect with potential roommates. Your perfect match
                      is waiting!
                    </p>
                    {isLoggedIn && isOnboarded ? (
                      <Button
                        size="lg"
                        className="w-full sm:w-auto transition-transform hover:scale-105"
                        onClick={handleGoToDashboard}
                      >
                        Go to Dashboard
                      </Button>
                    ) : (
                      <div className="text-sm text-amber-600/90 bg-amber-500/10 p-4 rounded-lg border border-amber-500/20 italic">
                        Complete steps 1 &amp; 2 to unlock dashboard access
                      </div>
                    )}
                  </CardContent>
                </Card>
              </FadeInSection>
            </div>
          </div>

          {/* Test Account Info Block */}
          <div className="mt-20 text-center">
            <FadeInSection>
              <div className="inline-flex rounded-xl border-2 border-primary/20 bg-primary/5 px-8 py-4 shadow-sm">
                <span className="font-medium text-primary">
                  Use the test account in Sign In for a read-only walkthrough
                </span>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>
    </FadeInSection>
  );
}
