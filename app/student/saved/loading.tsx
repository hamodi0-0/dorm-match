import ListingCardSkeleton from "@/components/listings/listing-card-skeleton";

export default function SavedLoading() {
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
      <h1 className="text-2xl font-serif font-bold text-foreground mb-6">
        Saved Listings
      </h1>
      <div className="grid grid-cols-1 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <ListingCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
