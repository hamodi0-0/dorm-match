import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export interface StudentProfile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  university_name: string;
  university_email: string;
  year_of_study: "1st_year" | "2nd_year" | "3rd_year" | "4th_year" | "graduate";
  major: string;
  bio: string | null;
  hobbies: string[];
  sleep_schedule: "early_bird" | "night_owl" | "flexible";
  cleanliness: 1 | 2 | 3 | 4 | 5;
  noise_level: "quiet" | "moderate" | "social";
  guests_frequency: "rarely" | "sometimes" | "often";
  study_location: "library" | "room" | "both";
  smoking: boolean;
  pets: boolean;
  diet_preference: "no_preference" | "vegetarian" | "vegan" | "halal" | "other";
  gender: "male" | "female";
  phone: string | null;
}

async function fetchStudentProfile(): Promise<StudentProfile> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("student_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) throw error;
  if (!data) throw new Error("Profile not found");

  return data as StudentProfile;
}

export function useStudentProfile(initialData?: StudentProfile) {
  return useQuery({
    queryKey: ["student-profile"],
    queryFn: fetchStudentProfile,
    initialData,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
