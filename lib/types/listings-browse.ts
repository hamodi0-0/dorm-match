import type { TenantCompatibilityProfile } from "@/lib/types/compatibility";
import type { Listing, GenderPreference, RoomType } from "@/lib/types/listing";

export interface ListingsBrowseClientProps {
  initialData: ListingsPageResult;
}

export interface ListingsFilterChange {
  roomType?: RoomType | null;
  maxPrice?: number | null;
  genderPreference?: GenderPreference | null;
}

export interface ListingsPaginationProps {
  page: number;
  totalCount: number;
  isPlaceholder: boolean;
  onPageChange: (page: number) => void;
}

export interface ListingsBrowseSkeletonProps {
  count?: number;
}

export interface ListingFiltersQuery {
  search: string;
  roomType: RoomType | null;
  maxPrice: number | null;
  genderPreference: GenderPreference | null;
}

export interface ListingsPageResult {
  listings: Listing[];
  tenantProfiles: Record<string, TenantCompatibilityProfile[]>;
  totalCount: number;
}
