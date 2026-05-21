import type { ComponentType } from "react";

import type { TenantCompatibilityProfile } from "@/lib/types/compatibility";
import type { Listing, ListingImage } from "@/lib/types/listing";

export interface ListingDetailClientProps {
  listing: Listing;
  /** Other tenants only - viewer's profile already filtered out server-side */
  tenantProfiles: TenantCompatibilityProfile[];
  userId: string;
  isViewerTenant: boolean;
}

export interface ListingDetailImageGalleryProps {
  images: ListingImage[];
}

export interface ListingDetailStatBadgeProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

export interface ListingDetailAmenity {
  key: keyof Listing;
  label: string;
  icon: ComponentType<{ className?: string }>;
}
