"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Upload, X, ImageIcon } from "lucide-react";
import { toast } from "sonner";

import {
  createListingSchema,
  type CreateListingValues,
} from "@/lib/schemas/listing-schema";
import { geocodeAddress } from "@/lib/geocoding";
import { useCreateListingMutation } from "@/hooks/use-create-listing-mutation";
import { useUpdateListingMutation } from "@/hooks/use-update-listing-mutation";
import { createClient } from "@/lib/supabase/client";
import type { Listing, ListingImage } from "@/lib/types/listing";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ListingFormProps {
  mode: "create" | "edit";
  listing?: Listing; // required when mode === "edit"
}

interface PendingImage {
  id: string; // client-side UUID for stable keys
  file: File;
  preview: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const AMENITIES = [
  { name: "wifi" as const, label: "WiFi" },
  { name: "parking" as const, label: "Parking" },
  { name: "laundry" as const, label: "Laundry" },
  { name: "gym" as const, label: "Gym" },
  { name: "bills_included" as const, label: "Bills Included" },
  { name: "furnished" as const, label: "Furnished" },
] satisfies { name: keyof CreateListingValues; label: string }[];

const ROOM_TYPE_LABELS: Record<string, string> = {
  single: "Single Room",
  shared: "Shared Room",
  studio: "Studio",
  entire_apartment: "Entire Apartment",
};

const GENDER_PREF_LABELS: Record<string, string> = {
  male_only: "Male Only",
  female_only: "Female Only",
  mixed: "Mixed",
  no_preference: "No Preference",
};

// ─── Image Helpers ────────────────────────────────────────────────────────────

async function uploadImageToStorage(
  supabase: ReturnType<typeof createClient>,
  file: File,
  userId: string,
  listingId: string,
  position: number,
  isCover: boolean,
): Promise<void> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `${crypto.randomUUID()}.${ext}`;
  const storagePath = `${userId}/${listingId}/${filename}`;

  const { error: uploadError } = await supabase.storage
    .from("listing-images")
    .upload(storagePath, file, { contentType: file.type, upsert: false });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from("listing-images")
    .getPublicUrl(storagePath);

  const { error: dbError } = await supabase.from("listing_images").insert({
    listing_id: listingId,
    storage_path: storagePath,
    public_url: urlData.publicUrl,
    position,
    is_cover: isCover,
  });

  if (dbError) throw dbError;
}

async function removeImageFromStorage(
  supabase: ReturnType<typeof createClient>,
  image: ListingImage,
): Promise<void> {
  // Best-effort — don't throw if storage removal partially fails
  await supabase.storage.from("listing-images").remove([image.storage_path]);
  const { error } = await supabase
    .from("listing_images")
    .delete()
    .eq("id", image.id);
  if (error) throw error;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ListingForm({ mode, listing }: ListingFormProps) {
  const router = useRouter();
  const createMutation = useCreateListingMutation();
  const updateMutation = useUpdateListingMutation();

  // Image state is kept outside RHF — uploaded after the listing row is created
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [existingImages, setExistingImages] = useState<ListingImage[]>(
    listing?.listing_images ?? [],
  );
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const isSubmitting =
    createMutation.isPending || updateMutation.isPending || isUploadingImages;

  // ─── Form ─────────────────────────────────────────────────────────────────

  const form = useForm<CreateListingValues>({
    resolver: zodResolver(createListingSchema),
    defaultValues: listing
      ? {
          title: listing.title,
          description: listing.description ?? "",
          room_type: listing.room_type,
          price_per_month: listing.price_per_month,
          available_from: listing.available_from,
          min_stay_months: listing.min_stay_months,
          max_occupants: listing.max_occupants,
          address_line: listing.address_line,
          city: listing.city,
          postcode: listing.postcode ?? "",
          country: listing.country,
          gender_preference: listing.gender_preference,
          university_name: listing.university_name ?? "",
          wifi: listing.wifi,
          parking: listing.parking,
          laundry: listing.laundry,
          gym: listing.gym,
          bills_included: listing.bills_included,
          furnished: listing.furnished,
          latitude: listing.latitude ?? undefined,
          longitude: listing.longitude ?? undefined,
        }
      : {
          country: "United Kingdom",
          min_stay_months: 1,
          max_occupants: 1,
          gender_preference: "no_preference",
          wifi: false,
          parking: false,
          laundry: false,
          gym: false,
          bills_included: false,
          furnished: true,
        },
  });

  // ─── Image Handlers ───────────────────────────────────────────────────────

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      const validFiles = files.filter((f) => f.type.startsWith("image/"));

      const previews: PendingImage[] = validFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
      }));

      setPendingImages((prev) => [...prev, ...previews]);
      // Reset so the same file can be re-selected if needed
      e.target.value = "";
    },
    [],
  );

  const removePendingImage = useCallback((imageId: string) => {
    setPendingImages((prev) => {
      const target = prev.find((img) => img.id === imageId);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((img) => img.id !== imageId);
    });
  }, []);

  const handleDeleteExistingImage = useCallback(async (image: ListingImage) => {
    const supabase = createClient();
    setDeletingImageId(image.id);
    try {
      await removeImageFromStorage(supabase, image);
      setExistingImages((prev) => prev.filter((i) => i.id !== image.id));
      toast.success("Photo removed");
    } catch {
      toast.error("Failed to remove photo. Please try again.");
    } finally {
      setDeletingImageId(null);
    }
  }, []);

  // ─── Upload Images Helper ─────────────────────────────────────────────────

  const uploadPendingImages = async (
    listingId: string,
    startPosition: number,
    firstIsCover: boolean,
  ) => {
    if (pendingImages.length === 0) return;

    setIsUploadingImages(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setIsUploadingImages(false);
      return;
    }

    try {
      for (let i = 0; i < pendingImages.length; i++) {
        await uploadImageToStorage(
          supabase,
          pendingImages[i].file,
          user.id,
          listingId,
          startPosition + i,
          firstIsCover && i === 0,
        );
      }
    } catch {
      toast.error(
        "Listing saved, but some photos failed to upload. You can add them by editing the listing.",
      );
    } finally {
      setIsUploadingImages(false);
    }
  };

  // ─── Submit ───────────────────────────────────────────────────────────────

  const onSubmit = async (values: CreateListingValues) => {
    // 1. Geocode silently — failure is non-fatal, listing saves without coords
    try {
      const query = [values.address_line, values.city, values.postcode]
        .filter(Boolean)
        .join(", ");
      const coords = await geocodeAddress(query);
      if (coords) {
        values.latitude = coords.lat;
        values.longitude = coords.lng;
      }
    } catch {
      // intentionally swallowed
    }

    // Normalise optional string fields — don't store empty strings in the DB
    const normalised = {
      ...values,
      description: values.description || undefined,
      university_name: values.university_name || undefined,
      postcode: values.postcode || undefined,
    };

    if (mode === "create") {
      createMutation.mutate(normalised, {
        onSuccess: async (newListing) => {
          await uploadPendingImages(newListing.id, 0, true);
          toast.success("Listing created!");
          router.push("/lister/dashboard");
        },
        onError: (error) => {
          toast.error(
            error.message ?? "Failed to create listing. Please try again.",
          );
        },
      });
    } else {
      if (!listing) return;

      updateMutation.mutate(
        { id: listing.id, updates: normalised },
        {
          onSuccess: async () => {
            // New images start after existing ones; only the first is a cover
            // if there are no existing images
            await uploadPendingImages(
              listing.id,
              existingImages.length,
              existingImages.length === 0,
            );
            toast.success("Listing updated!");
            router.push("/lister/dashboard");
          },
          onError: (error) => {
            toast.error(
              error.message ?? "Failed to update listing. Please try again.",
            );
          },
        },
      );
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* ── 1. Basic Info ──────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Listing Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Bright en-suite near University of Manchester"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description{" "}
                    <span className="text-xs text-muted-foreground">
                      (optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the room, house rules, what's nearby…"
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="room_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select room type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(ROOM_TYPE_LABELS).map(
                          ([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price_per_month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Per Month (£)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        placeholder="650"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : e.target.valueAsNumber,
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="available_from"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available From</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="min_stay_months"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Stay (months)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        placeholder="1"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : e.target.valueAsNumber,
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_occupants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Occupants</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        placeholder="1"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : e.target.valueAsNumber,
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* ── 2. Location ────────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="address_line"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 12 Oak Street" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Manchester" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Postcode{" "}
                      <span className="text-xs text-muted-foreground">
                        (optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="M1 1AE" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="United Kingdom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Your exact address is used to generate a map pin for students.
              Only the general area is shown publicly.
            </p>
          </CardContent>
        </Card>

        {/* ── 3. Preferences ─────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tenant Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="gender_preference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender Preference</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select preference" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(GENDER_PREF_LABELS).map(
                          ([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="university_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Target University{" "}
                      <span className="text-xs text-muted-foreground">
                        (optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. University of Manchester"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* ── 4. Amenities ───────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {AMENITIES.map(({ name, label }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2.5 space-y-0 rounded-md border px-3 py-2.5">
                      <FormControl>
                        <Checkbox
                          checked={field.value as boolean}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer text-sm font-normal leading-none">
                        {label}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── 5. Photos ──────────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Photos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Existing images (edit mode only) */}
            {existingImages.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Current photos</p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                  {existingImages.map((img) => (
                    <div
                      key={img.id}
                      className="relative aspect-square overflow-hidden rounded-md border bg-muted"
                    >
                      <Image
                        src={img.public_url}
                        alt="Listing photo"
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 33vw, 20vw"
                      />
                      {img.is_cover && (
                        <span className="absolute left-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        disabled={deletingImageId === img.id}
                        onClick={() => handleDeleteExistingImage(img)}
                        aria-label="Remove photo"
                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow transition-opacity hover:opacity-90 disabled:opacity-50"
                      >
                        {deletingImageId === img.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <X className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pending previews */}
            {pendingImages.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  {existingImages.length > 0
                    ? "New photos to add"
                    : "Selected photos"}
                </p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                  {pendingImages.map((img, index) => (
                    <div
                      key={img.id}
                      className="relative aspect-square overflow-hidden rounded-md border bg-muted"
                    >
                      {/* Local blob preview — not from a remote URL, so next/image is overkill here */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.preview}
                        alt="Photo preview"
                        className="h-full w-full object-cover"
                      />
                      {existingImages.length === 0 && index === 0 && (
                        <span className="absolute left-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removePendingImage(img.id)}
                        aria-label="Remove photo"
                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Drop zone / file picker */}
            <label className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-muted-foreground/25 px-4 py-8 text-muted-foreground transition-colors hover:border-muted-foreground/50 hover:text-foreground">
              <Upload className="h-6 w-6 transition-transform group-hover:scale-105" />
              <span className="text-sm font-medium">
                {pendingImages.length === 0 && existingImages.length === 0
                  ? "Click to add photos"
                  : "Add more photos"}
              </span>
              <span className="text-xs">JPEG, PNG, WebP · up to 5 MB each</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="sr-only"
                onChange={handleFileChange}
              />
            </label>

            {pendingImages.length === 0 && existingImages.length === 0 && (
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ImageIcon className="h-3.5 w-3.5 shrink-0" />
                The first photo you upload will be used as the cover image.
              </p>
            )}
          </CardContent>
        </Card>

        {/* ── Actions ────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-end gap-3 pb-8">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => router.push("/lister/dashboard")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "create" ? "Create Listing" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
