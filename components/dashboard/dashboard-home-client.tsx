"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Search, SlidersHorizontal, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStudentProfile } from "@/hooks/use-student-profile";
import {
  useListingFilters,
  type RoomType,
} from "@/lib/stores/listing-filters-store";
import { fetchListingsPage } from "@/hooks/use-public-listings-page";
import { ListingsPageResult } from "@/lib/types/listings-browse";
import {
  EMPTY_FILTERS,
  PUBLIC_LISTINGS_QUERY_BASE,
  YEAR_LABELS,
} from "@/lib/constants";
import { prefetchCoverImages } from "@/lib/helpers/image";

const QUERY_KEY = [PUBLIC_LISTINGS_QUERY_BASE, 1, EMPTY_FILTERS] as const;

export function DashboardHomeClient() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useStudentProfile();
  const { searchQuery, roomType, setSearchQuery, setRoomType } =
    useListingFilters();

  useEffect(() => {
    // Data already in cache (e.g. user returned to home) — prefetch images immediately
    const cached = queryClient.getQueryData<ListingsPageResult>(QUERY_KEY);
    if (cached) {
      prefetchCoverImages(cached.listings);
      return;
    }

    // No cache yet — fetch listings data first, then prefetch images once we have URLs
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

  if (!profile || isLoading) return;

  const firstName = profile!.full_name.split(" ")[0];
  const yearLabel =
    YEAR_LABELS[profile!.year_of_study] ?? profile!.year_of_study;

  function handleSearch() {
    router.push("/dashboard/listings");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSearch();
  }

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-serif font-medium text-foreground">
          Welcome back, {firstName}! 👋
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          {yearLabel} · {profile!.major} · {profile!.university_name}
        </p>
      </div>

      <Card className="mb-10 py-0 shadow-sm">
        <CardContent className="p-5 sm:p-6">
          <h2 className="text-base font-semibold text-foreground mb-1 flex items-center gap-2">
            <Search className="h-4 w-4 text-primary" />
            Find Your Perfect Room
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Search across all available student listings
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search by city, university, or room type…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-9 h-10"
              />
            </div>
            <Select
              value={roomType ?? "all"}
              onValueChange={(v) =>
                setRoomType(v === "all" ? null : (v as RoomType))
              }
            >
              <SelectTrigger className="h-10 w-auto min-w-[130px]">
                <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue placeholder="Room Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="single">Single Room</SelectItem>
                <SelectItem value="shared">Shared Room</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
                <SelectItem value="entire_apartment">
                  Entire Apartment
                </SelectItem>
              </SelectContent>
            </Select>
            <Button className="h-10 gap-2 shrink-0" onClick={handleSearch}>
              Search
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
