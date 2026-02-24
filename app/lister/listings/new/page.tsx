import { ListerDashboardHeader } from "@/components/lister/lister-dashboard-header";
import { ListingForm } from "@/components/listings/listing-form";

export default function NewListingPage() {
  return (
    <>
      <ListerDashboardHeader title="Create Listing" />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
        <ListingForm mode="create" />
      </main>
    </>
  );
}
