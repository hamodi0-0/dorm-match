"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useOnboardingStore } from "@/lib/stores/onboarding-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

// Import step components
import { PersonalInfoStep } from "@/components/onboarding/personal-info-step";
import { UniversityInfoStep } from "@/components/onboarding/university-info-step";
import {
  LifestyleStep,
  PreferencesStep,
  BioStep,
} from "@/components/onboarding/lifestyle-hobbies-steps";

const STEPS = [
  {
    id: 0,
    component: PersonalInfoStep,
    title: "Personal Info",
    requiredFields: ["full_name", "gender"],
  },
  {
    id: 1,
    component: UniversityInfoStep,
    title: "University",
    requiredFields: ["university_name", "year_of_study", "major"],
  },
  {
    id: 2,
    component: LifestyleStep,
    title: "Lifestyle",
    requiredFields: [
      "sleep_schedule",
      "cleanliness",
      "noise_level",
      "guests_frequency",
      "study_location",
    ],
  },
  {
    id: 3,
    component: PreferencesStep,
    title: "Preferences",
    requiredFields: ["smoking", "pets", "diet_preference"],
  },
  { id: 4, component: BioStep, title: "About You", requiredFields: [] }, // bio and hobbies are optional
];

export default function OnboardingPage() {
  const router = useRouter();
  const {
    currentStep,
    totalSteps,
    data,
    nextStep,
    previousStep,
    resetOnboarding,
  } = useOnboardingStore();
  const [canProceed, setCanProceed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  // Check if all required fields for current step are filled
  useEffect(() => {
    const requiredFields = STEPS[currentStep].requiredFields;
    const allFieldsFilled = requiredFields.every((field) => {
      const value = data[field as keyof typeof data];
      return value !== undefined && value !== "" && value !== null;
    });
    setCanProceed(allFieldsFilled);
  }, [currentStep, data]);

  const handleFinish = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("You must be logged in");
        return;
      }

      // Prepare data for student_profiles table (matches new schema)
      const profileData = {
        id: user.id,
        full_name: data.full_name,
        phone: data.phone,
        avatar_url: data.avatar_url || null,
        gender: data.gender,
        university_name: data.university_name,
        university_email: user.email, // From auth.users
        email_verified: true, // Already verified via email link
        year_of_study: data.year_of_study,
        major: data.major,
        bio: data.bio || null,
        sleep_schedule: data.sleep_schedule,
        cleanliness: data.cleanliness,
        noise_level: data.noise_level,
        guests_frequency: data.guests_frequency,
        study_location: data.study_location,
        smoking: data.smoking,
        pets: data.pets,
        diet_preference: data.diet_preference,
        hobbies: data.hobbies || [],
        profile_completed: true,
        updated_at: new Date().toISOString(),
      };

      // Save to database
      const { error } = await supabase
        .from("student_profiles")
        .upsert(profileData);

      if (error) throw error;

      toast.success("Profile created successfully!");
      resetOnboarding();
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-2xl">
        <Card className="shadow-xl">
          <CardHeader className="space-y-3 pb-6">
            <CardTitle className="text-3xl font-bold text-center">
              Complete Your Profile
            </CardTitle>
            <CardDescription className="text-center text-base">
              Help us match you with compatible roommates by completing your
              profile
            </CardDescription>

            {/* Progress Indicator */}
            <div className="pt-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {totalSteps}
                </p>
                <p className="text-sm font-medium">
                  {STEPS[currentStep].title}
                </p>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{
                    width: `${((currentStep + 1) / totalSteps) * 100}%`,
                  }}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step Content - Only render current step to fix tab navigation */}
            <div className="min-h-80">
              {STEPS.map((step, index) => (
                <div
                  key={step.id}
                  className={`${
                    index === currentStep ? "block" : "hidden"
                  } animate-in fade-in-50 duration-200`}
                >
                  <step.component />
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={previousStep}
                disabled={isFirstStep || isLoading}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              {!isLastStep ? (
                <Button
                  onClick={nextStep}
                  disabled={!canProceed || isLoading}
                  className="gap-2"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleFinish}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Complete Profile
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
