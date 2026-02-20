"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { StudentProfile } from "@/hooks/use-student-profile";
import type { ProfileUpdate } from "@/lib/schemas/profile-edit-schema";

const updateStudentProfile = async (
  updates: ProfileUpdate,
): Promise<StudentProfile> => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("student_profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", user.id)
    .select()
    .single();

  if (error) throw error;
  return data as StudentProfile;
};

/**
 * User actively edits individual fields → optimistic updates so the UI
 * feels instant. On error, cache rolls back and a toast surfaces the failure.
 */
export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStudentProfile,
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: ["student-profile"] });

      const previousProfile = queryClient.getQueryData<StudentProfile>([
        "student-profile",
      ]);

      queryClient.setQueryData<StudentProfile>(["student-profile"], (old) =>
        old ? { ...old, ...updates } : old,
      );

      return { previousProfile };
    },
    onError: (_error, _updates, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(["student-profile"], context.previousProfile);
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["student-profile"], data);
    },
  });
}
