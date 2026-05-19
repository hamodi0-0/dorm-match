import { ListingsBrowseSkeleton } from "@/components/listings/listings-browse-skeleton";

export default function SavedLoading() {
  return (
    <main className="flex-1 px-4 sm:px-6 py-5 max-w-5xl mx-auto w-full mb-20">
      <h1 className="text-2xl font-serif font-bold text-foreground mb-6">
        Saved Listings
      </h1>
      <ListingsBrowseSkeleton count={3} />
    </main>
  );
}
