"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface StudentProfile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  university_name: string;
  year_of_study: string;
  major: string;
  bio: string | null;
  hobbies: string[];
  sleep_schedule: string;
  cleanliness: number;
  noise_level: string;
  guests_frequency: string;
  study_location: string;
  smoking: boolean;
  pets: boolean;
  diet_preference: string;
  gender: string;
}

interface UseStudentProfileReturn {
  profile: StudentProfile | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useStudentProfile(): UseStudentProfileReturn {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Not authenticated");
        return;
      }

      const { data, error: profileError } = await supabase
        .from("student_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      setProfile(data as StudentProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { profile, isLoading, error, refetch: fetchProfile };
}
