"use client";

import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListingsBrowseSkeleton } from "./listings-browse-skeleton";
import { ListingsBrowsePagination } from "./listings-browse-pagination";
import { ListingCard } from "@/components/listings/listing-card";
import { cn } from "@/lib/utils";
import type { Listing } from "@/lib/types/listing";
import type { TenantCompatibilityProfile } from "@/lib/types/compatibility";
import type { ListingsPaginationProps } from "@/lib/types/listings-browse";

interface ResultsProps extends ListingsPaginationProps {
  listings: Listing[];
  tenantProfiles: Record<string, TenantCompatibilityProfile[]>;
  viewerProfile: any;
  isFetching: boolean;
  isPlaceholderData: boolean;
  isSuggestedView: boolean;
  isOutOfRangePage: boolean;
  showNoSearchResults: boolean;
}

export function ListingsResults({
  listings,
  tenantProfiles,
  viewerProfile,
  isFetching,
  isPlaceholderData,
  isSuggestedView,
  isOutOfRangePage,
  showNoSearchResults,
  page,
  totalCount,
  isPlaceholder,
  onPageChange,
}: ResultsProps) {
  return (
    <main className="flex-1 px-4 sm:px-6 py-5 max-w-5xl mx-auto w-full mb-20">
      <div
        className={cn(
          "transition-opacity duration-150",
          isPlaceholderData && "opacity-60",
        )}
      >
        {isFetching && listings.length === 0 ? (
          <ListingsBrowseSkeleton count={10} />
        ) : isOutOfRangePage ? (
          <Card className="py-20 text-center mt-4">
            <CardContent className="flex flex-col items-center gap-3">
              <p className="font-medium text-foreground">
                No listings on this page
              </p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Your current page is out of range for the available results.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(1)}
              >
                Go to page 1
              </Button>
            </CardContent>
          </Card>
        ) : showNoSearchResults ? (
          <Card className="py-20 text-center mt-4">
            <CardContent className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="font-medium text-foreground">
                No listings match your search
              </p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Try a different keyword or clear your search query
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(1)}
              >
                Clear Search
              </Button>
            </CardContent>
          </Card>
        ) : listings.length === 0 ? (
          <Card className="py-20 text-center mt-4">
            <CardContent className="flex flex-col items-center gap-3">
              <p className="font-medium text-foreground">
                No suggested listings yet
              </p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Check back soon or refine your filters to browse more options.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {isSuggestedView && (
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground px-0.5">
                Suggested
              </p>
            )}
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                tenantProfiles={tenantProfiles[listing.id] ?? []}
                viewerProfile={viewerProfile}
              />
            ))}
          </div>
        )}
      </div>

      <ListingsBrowsePagination
        page={page}
        totalCount={totalCount}
        isPlaceholder={isPlaceholder}
        onPageChange={onPageChange}
      />
    </main>
  );
}
