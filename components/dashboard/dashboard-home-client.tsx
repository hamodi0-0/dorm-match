"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useStudentProfile,
} from "@/hooks/use-student-profile";
import { fetchListingsPage } from "@/hooks/use-public-listings-page";
import type { ListingsPageResult } from "@/lib/types/listings-browse";
import { prefetchCoverImages } from "@/lib/helpers/image";
import {
  EMPTY_FILTERS,
  PUBLIC_LISTINGS_QUERY_BASE,
} from "@/lib/constants";
import type { DashboardHomeClientProps } from "@/lib/types/student-dashboard";

import { DashboardHero } from "./dashboard-hero";
import { DashboardApplications } from "./dashboard-applications";
import { DashboardChats } from "./dashboard-chats";
import { DashboardProfileCompletion } from "./dashboard-profile-completion";

const QUERY_KEY = [PUBLIC_LISTINGS_QUERY_BASE, 1, EMPTY_FILTERS] as const;

export function DashboardHomeClient({
  initialProfile,
  recentConversations,
  tenantRequests,
}: DashboardHomeClientProps) {
  const queryClient = useQueryClient();
  const { data: profile } = useStudentProfile(initialProfile ?? undefined);

  useEffect(() => {
    const cached = queryClient.getQueryData<ListingsPageResult>(QUERY_KEY);
    if (cached) {
      prefetchCoverImages(cached.listings);
      return;
    }
    queryClient
      .prefetchQuery({
        queryKey: QUERY_KEY,
        queryFn: () => fetchListingsPage(1, EMPTY_FILTERS),
        staleTime: 60 * 1000,
      })
      .then(() => {
        const data = queryClient.getQueryData<ListingsPageResult>(QUERY_KEY);
        if (data) prefetchCoverImages(data.listings);
      });
  }, [queryClient]);

  if (!profile) return null;

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-5">
      <DashboardHero profile={profile} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <DashboardApplications requests={tenantRequests} />
        <DashboardChats conversations={recentConversations} />
      </div>

      <DashboardProfileCompletion profile={profile} />
    </main>
  );
}
