import { CheckCircle2, FileEdit, Home, UserPlus } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

export default function HowItWorks({
  isLoggedIn,
  isOnboarded,
  handleSetupProfile,
  handleGoToDashboard,
}: {
  isLoggedIn: boolean;
  isOnboarded: boolean;
  handleSetupProfile: () => void;
  handleGoToDashboard: () => void;
}) {
  return (
    <section
      id="how-it-works"
      className="py-24 bg-linear-to-br from-muted/50 to-indigo-50/50 dark:from-muted/20 dark:to-indigo-950/10"
    >
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground">
            Get started in three simple steps
          </p>
        </div>

        <div className="space-y-6">
          {/* Step 1 */}
          <Card className="overflow-hidden border-2 border-border hover:border-indigo-300 dark:hover:border-indigo-700/40 transition-all duration-300 hover:shadow-lg dark:hover:shadow-indigo-900/20">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 dark:from-indigo-500 dark:to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    1
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <UserPlus className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="text-2xl font-bold text-foreground">
                      Create Your Account
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-lg mb-4">
                    Sign up with your university email to get started. It&apos;s
                    quick, free, and secure.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="overflow-hidden border-2 border-border hover:border-purple-300 dark:hover:border-purple-700/40 transition-all duration-300 hover:shadow-lg dark:hover:shadow-purple-900/20">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 dark:from-purple-500 dark:to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    2
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <FileEdit className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-2xl font-bold text-foreground">
                      Complete Your Profile
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-lg mb-6">
                    Tell us about your lifestyle, preferences, and what
                    you&apos;re looking for in a roommate. This helps us find
                    your perfect match.
                  </p>
                  {isLoggedIn && !isOnboarded ? (
                    <Button
                      size="lg"
                      onClick={handleSetupProfile}
                      className="bg-purple-600 text-white font-semibold hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
                    >
                      Set Up My Profile
                    </Button>
                  ) : !isLoggedIn ? (
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={handleSetupProfile}
                      className="border-purple-300 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/50"
                    >
                      Sign In to Continue
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-500 font-medium">
                      <CheckCircle2 className="h-5 w-5" />
                      <span>Profile Complete!</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="overflow-hidden border-2 border-border hover:border-pink-300 dark:hover:border-pink-700/40 transition-all duration-300 hover:shadow-lg dark:hover:shadow-pink-900/20">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-600 to-pink-700 dark:from-pink-500 dark:to-pink-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    3
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Home className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                    <h3 className="text-2xl font-bold text-foreground">
                      Start Browsing & Matching
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-lg mb-6">
                    Browse available listings, see your compatibility scores,
                    and connect with potential roommates. Your perfect match is
                    waiting!
                  </p>
                  {isLoggedIn && isOnboarded ? (
                    <Button
                      size="lg"
                      onClick={handleGoToDashboard}
                      className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 dark:from-pink-500 dark:to-purple-500 dark:hover:from-pink-600 dark:hover:to-purple-600"
                    >
                      Go to Dashboard
                    </Button>
                  ) : (
                    <div className="text-sm text-muted-foreground italic">
                      Complete steps 1 & 2 to unlock dashboard access
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
