import {
  AMENITY_CONFIG,
  LISTING_DETAIL_DESCRIPTION_PREVIEW_LENGTH,
} from "@/lib/constants";
import type { Listing } from "@/lib/types/listing";
import type { ListingDetailAmenity } from "@/lib/types/listing-detail";

function formatListingDate(
  availableFrom: string,
  options: Intl.DateTimeFormatOptions,
): string {
  return new Date(availableFrom).toLocaleDateString("en-GB", options);
}

export function formatListingAvailableDate(availableFrom: string): string {
  return formatListingDate(availableFrom, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatListingAvailableShortDate(availableFrom: string): string {
  return formatListingDate(availableFrom, {
    day: "numeric",
    month: "short",
  });
}

export function formatListingMinStay(minStayMonths: number): string {
  return `${minStayMonths} month${minStayMonths !== 1 ? "s" : ""}`;
}

export function buildListingFullAddress(
  listing: Pick<Listing, "address_line" | "city" | "postcode" | "country">,
): string {
  return [listing.address_line, listing.city, listing.postcode, listing.country]
    .filter(Boolean)
    .join(", ");
}

export function buildGoogleMapsSearchUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function getListingActiveAmenities(
  listing: Listing,
): ListingDetailAmenity[] {
  return AMENITY_CONFIG.filter(({ key }) => listing[key] === true);
}

export function shouldTruncateListingDescription(
  description: string | null,
): description is string {
  return Boolean(
    description &&
    description.length > LISTING_DETAIL_DESCRIPTION_PREVIEW_LENGTH,
  );
}

export function getListingDescriptionPreview(
  description: string | null,
  expanded: boolean,
): string | null {
  if (!description) return null;
  if (
    expanded ||
    description.length <= LISTING_DETAIL_DESCRIPTION_PREVIEW_LENGTH
  ) {
    return description;
  }

  return `${description.slice(0, LISTING_DETAIL_DESCRIPTION_PREVIEW_LENGTH)}…`;
}
