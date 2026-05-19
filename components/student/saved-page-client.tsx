"use client";

import { useSavedListingsQuery } from "@/hooks/use-saved-listings";
import { ListingCard } from "@/components/listings/listing-card";
import { ListingsBrowseSkeleton } from "@/components/listings/listings-browse-skeleton";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SavedPageClient() {
  const { data: savedListings = [], isLoading } = useSavedListingsQuery();

  if (isLoading) {
    return (
      <main className="flex-1 px-4 sm:px-6 py-5 max-w-5xl mx-auto w-full mb-20">
        <h1 className="text-2xl font-serif font-bold text-foreground mb-6">
          Saved Listings
        </h1>
        <ListingsBrowseSkeleton count={3} />
      </main>
    );
  }

  if (savedListings.length === 0) {
    return (
      <main className="flex-1 px-4 sm:px-6 py-5 max-w-5xl mx-auto w-full mb-20">
        <h1 className="text-2xl font-serif font-bold text-foreground mb-6">
          Saved Listings
        </h1>
        <div className="bg-card border border-border rounded-xl p-12 flex flex-col items-center justify-center text-center">
          <div className="h-16 w-16 bg-rose-50 dark:bg-rose-950/20 rounded-full flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-rose-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No saved listings yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            When you find a room you like, click the heart icon to save it here
            for later.
          </p>
          <Button asChild>
            <Link href="/student/listings">Browse Listings</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 px-4 sm:px-6 py-5 max-w-5xl mx-auto w-full mb-20">
      <h1 className="text-2xl font-serif font-bold text-foreground mb-6">
        Saved Listings
      </h1>
      <div className="flex flex-col gap-4">
        {savedListings.map((saved) => (
          <ListingCard
            key={saved.id}
            listing={saved.listing}
            // Tenant profiles are omitted here since they require a complex batch fetch,
            // but we can pass empty or load them individually if necessary.
          />
        ))}
      </div>
    </main>
  );
}
