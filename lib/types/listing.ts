export type ListingStatus = "draft" | "active" | "paused" | "archived";
export type RoomType = "single" | "shared" | "studio" | "entire_apartment";
export type GenderPref =
  | "male_only"
  | "female_only"
  | "mixed"
  | "no_preference";

export interface ListingImage {
  id: string;
  listing_id: string;
  storage_path: string;
  public_url: string;
  position: number;
  is_cover: boolean;
  created_at: string;
}

export interface Listing {
  id: string;
  lister_id: string;
  title: string;
  description: string | null;
  room_type: RoomType;
  price_per_month: number;
  available_from: string;
  min_stay_months: number;
  max_occupants: number;
  address_line: string;
  city: string;
  country: string;
  postcode: string | null;
  latitude: number | null;
  longitude: number | null;
  gender_preference: GenderPref;
  university_name: string | null;
  wifi: boolean;
  parking: boolean;
  laundry: boolean;
  gym: boolean;
  bills_included: boolean;
  furnished: boolean;
  status: ListingStatus;
  views_count: number;
  created_at: string;
  updated_at: string;
  // joined
  listing_images?: ListingImage[];
}

export interface CreateListingInput {
  title: string;
  description?: string;
  room_type: RoomType;
  price_per_month: number;
  available_from: string;
  min_stay_months: number;
  max_occupants: number;
  address_line: string;
  city: string;
  country: string;
  postcode?: string;
  latitude?: number;
  longitude?: number;
  gender_preference: GenderPref;
  university_name?: string;
  wifi: boolean;
  parking: boolean;
  laundry: boolean;
  gym: boolean;
  bills_included: boolean;
  furnished: boolean;
}
