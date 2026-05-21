"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { isTestAccount } from "@/lib/helpers/test-user";

export function useIsTestUser() {
  const supabase = createClient();

  const { data: isTestUser = false, isLoading } = useQuery({
    queryKey: ["is-test-user"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return isTestAccount(user?.email);
    },
    staleTime: Infinity,
  });

  return { isTestUser, isLoading };
}
