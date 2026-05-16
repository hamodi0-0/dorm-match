"use client";

import { useState } from "react";
import { useStudentProfile } from "@/hooks/use-student-profile";
import { usePublicListingsPage } from "@/hooks/use-public-listings-page";
import { ListingsFilterBar } from "@/components/listings/listings-filter-bar";
import { ListingsResults } from "@/components/listings/listings-results";
import { useDebounce } from "@/hooks/use-debounce";
import { useListingFilters } from "@/lib/stores/listing-filters-store";
import type {
  ListingsBrowseClientProps,
  ListingsFilterChange,
} from "@/lib/types/listings-browse";
import {
  normalizeFilters,
  computeActiveFilterCount,
} from "@/lib/helpers/listings";

export function ListingsGridClient({ initialData }: ListingsBrowseClientProps) {
  const [page, setPage] = useState(1);

  const {
    searchQuery,
    roomType,
    maxPrice,
    genderPreference,
    setSearchQuery,
    setRoomType,
    setMaxPrice,
    setGenderPreference,
    resetFilters,
  } = useListingFilters();

  const debouncedSearch = useDebounce(searchQuery, 350);

  const filters = normalizeFilters({
    search: debouncedSearch,
    roomType,
    maxPrice,
    genderPreference,
  });

  const { data, isFetching, isPlaceholderData } = usePublicListingsPage(
    page,
    filters,
    initialData,
  );

  const { data: viewerProfile } = useStudentProfile();

  const listings = data?.listings ?? [];
  const tenantProfiles = data?.tenantProfiles ?? {};
  const totalCount = data?.totalCount ?? 0;

  function handleFilterChange(next: ListingsFilterChange) {
    if ("roomType" in next) setRoomType(next.roomType ?? null);
    if ("maxPrice" in next) setMaxPrice(next.maxPrice ?? null);
    if ("genderPreference" in next)
      setGenderPreference(next.genderPreference ?? null);
    setPage(1);
  }

  function handleSearch(value: string) {
    setSearchQuery(value);
    setPage(1);
  }

  function handleReset() {
    resetFilters();
    setPage(1);
  }

  const hasActiveFilters =
    !!filters.search ||
    !!filters.roomType ||
    filters.maxPrice !== null ||
    !!filters.genderPreference;

  const isSuggestedView = page === 1 && !hasActiveFilters;

  const isOutOfRangePage = totalCount > 0 && listings.length === 0 && page > 1;

  const showNoSearchResults =
    !isFetching && listings.length === 0 && filters.search.length > 0;

  const activeFilterCount = computeActiveFilterCount(filters);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <ListingsFilterBar
        searchQuery={searchQuery}
        onSearch={handleSearch}
        onClearSearch={() => handleSearch("")}
        roomType={filters.roomType}
        maxPrice={filters.maxPrice}
        genderPreference={filters.genderPreference}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        activeFilterCount={activeFilterCount}
        totalCount={totalCount}
      />

      {/* ── Page title ─────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-1 w-full">
        <h1 className="text-2xl sm:text-3xl font-serif font-medium text-foreground">
          Browse Listings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Find your ideal student housing match
        </p>
      </div>

      <ListingsResults
        listings={listings}
        tenantProfiles={tenantProfiles}
        viewerProfile={viewerProfile}
        isFetching={isFetching}
        isPlaceholderData={isPlaceholderData}
        isSuggestedView={isSuggestedView}
        isOutOfRangePage={isOutOfRangePage}
        showNoSearchResults={showNoSearchResults}
        page={page}
        totalCount={totalCount}
        isPlaceholder={isPlaceholderData}
        onPageChange={setPage}
      />
    </div>
  );
}
