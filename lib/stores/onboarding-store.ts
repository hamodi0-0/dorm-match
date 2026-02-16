import { create } from "zustand";

interface OnboardingData {
  // Personal Info
  full_name: string;
  phone?: string;
  avatar_url?: string;
  gender: string;

  // University Info
  university_name: string;
  year_of_study: string;
  major: string;

  // Lifestyle
  sleep_schedule: string;
  cleanliness: number;
  noise_level: string;
  guests_frequency: string;
  study_location: string;

  // Preferences
  smoking: boolean;
  pets: boolean;
  diet_preference: string;

  // About (optional)
  bio?: string;
  hobbies?: string[];
}

interface OnboardingStore {
  currentStep: number;
  totalSteps: number;
  data: Partial<OnboardingData>;

  // Actions
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  updateData: (newData: Partial<OnboardingData>) => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  currentStep: 0,
  totalSteps: 5, // Personal Info, University, Lifestyle, Preferences, Bio
  data: {
    // Initialize with defaults
    full_name: "",
    phone: "",
    gender: "",
    university_name: "",
    year_of_study: "",
    major: "",
    sleep_schedule: "flexible",
    cleanliness: 3,
    noise_level: "moderate",
    guests_frequency: "sometimes",
    study_location: "both",
    smoking: false,
    pets: false,
    diet_preference: "no_preference",
    hobbies: [],
  },

  setCurrentStep: (step) => set({ currentStep: step }),

  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, state.totalSteps - 1),
    })),

  previousStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 0),
    })),

  updateData: (newData) =>
    set((state) => ({
      data: { ...state.data, ...newData },
    })),

  resetOnboarding: () =>
    set({
      currentStep: 0,
      data: {
        full_name: "",
        phone: "",
        gender: "",
        university_name: "",
        year_of_study: "",
        major: "",
        sleep_schedule: "flexible",
        cleanliness: 3,
        noise_level: "moderate",
        guests_frequency: "sometimes",
        study_location: "both",
        smoking: false,
        pets: false,
        diet_preference: "no_preference",
        hobbies: [],
      },
    }),
}));
