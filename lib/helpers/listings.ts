import type { ListingFiltersQuery } from "@/lib/types/listings-browse";
import type { RoomType, GenderPreference } from "@/lib/types/listing";
import {
  ROOM_TYPES,
  GENDER_PREFERENCES,
  MAX_PRICE_OPTIONS,
} from "@/lib/constants";

export function isValidRoomType(value: unknown): value is RoomType {
  return ROOM_TYPES.includes(value as RoomType);
}

export function isValidGenderPreference(
  value: unknown,
): value is GenderPreference {
  return GENDER_PREFERENCES.includes(value as GenderPreference);
}

export function normalizeFilters(f: ListingFiltersQuery): ListingFiltersQuery {
  const search = f.search.trim();
  const roomType = isValidRoomType(f.roomType) ? f.roomType : null;
  const genderPreference = isValidGenderPreference(f.genderPreference)
    ? f.genderPreference
    : null;
  const maxPrice =
    typeof f.maxPrice === "number" &&
    Number.isFinite(f.maxPrice) &&
    MAX_PRICE_OPTIONS.includes(f.maxPrice as (typeof MAX_PRICE_OPTIONS)[number])
      ? f.maxPrice
      : null;

  return { search, roomType, maxPrice, genderPreference };
}

export function isEmptyFilters(f: ListingFiltersQuery): boolean {
  const n = normalizeFilters(f);
  return !n.search && !n.roomType && n.maxPrice === null && !n.genderPreference;
}

export function computeActiveFilterCount(f: ListingFiltersQuery): number {
  const n = normalizeFilters(f);
  return [
    n.search,
    n.roomType,
    n.maxPrice !== null ? true : false,
    n.genderPreference,
  ].filter(Boolean).length;
}
