"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Users,
  ChevronDown,
  ChevronUp,
  Phone,
  MessageCircle,
  ExternalLink,
  Shield,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import {
  BILLING_PERIOD_SUFFIX,
  ROOM_TYPE_LABELS,
  GENDER_PREFERENCE_LABELS,
} from "@/lib/types/listing";
import { TenantRequestButton } from "@/components/tenants/tenant-request-button";
import { CompatibilitySection } from "@/components/compatibility/compatibility-section";
import { useStudentProfile } from "@/hooks/use-student-profile";
import { useInitChat } from "@/hooks/use-init-chat";
import { CallConfirmDialog } from "@/components/listings/call-confirm-dialog";
import { toast } from "sonner";
import { useIsTestUser } from "@/hooks/use-test-user";
import { getDialablePhone, formatPhoneDisplay } from "@/lib/helpers/phone";
import {
  buildGoogleMapsSearchUrl,
  buildListingFullAddress,
  formatListingAvailableDate,
  formatListingAvailableShortDate,
  formatListingMinStay,
  getListingActiveAmenities,
  getListingDescriptionPreview,
  shouldTruncateListingDescription,
} from "@/lib/helpers/listing-detail";
import { ListingDetailImageGallery } from "@/components/listings/listing-detail-gallery";
import { ListingDetailStatBadge } from "@/components/listings/listing-detail-stat-badge";
import type { ListingDetailClientProps } from "@/lib/types/listing-detail";

const ListingDetailMap = dynamic(
  () =>
    import("@/components/listings/listing-detail-map").then(
      (m) => m.ListingDetailMap,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-muted/30 rounded-lg">
        <span className="text-sm text-muted-foreground">Loading map…</span>
      </div>
    ),
  },
);

// ─── Main Component ───────────────────────────────────────────────────────────

export function ListingDetailClient({
  listing,
  tenantProfiles,
  userId,
  isViewerTenant,
}: ListingDetailClientProps) {
  const { data: viewerProfile } = useStudentProfile();
  const { mutate: initChat, isPending: isInitChatPending } = useInitChat();
  const { isTestUser } = useIsTestUser();
  const [descExpanded, setDescExpanded] = useState(false);

  const images = listing.listing_images ?? [];
  const priceSuffix = BILLING_PERIOD_SUFFIX[listing.billing_period] ?? "/mo";

  const availableDate = formatListingAvailableDate(listing.available_from);
  const availableShortDate = formatListingAvailableShortDate(
    listing.available_from,
  );

  const activeAmenities = getListingActiveAmenities(listing);

  const dialablePhone = getDialablePhone(listing.contact_phone);
  const callHref = dialablePhone ? `tel:${dialablePhone}` : null;
  const formattedPhone = formatPhoneDisplay(listing.contact_phone);
  const isChatDisabled = isInitChatPending || isTestUser;

  const fullAddress = buildListingFullAddress(listing);
  const mapsUrl = buildGoogleMapsSearchUrl(fullAddress);

  const shouldTruncateDesc = shouldTruncateListingDescription(
    listing.description,
  );
  const displayDesc = getListingDescriptionPreview(
    listing.description,
    descExpanded,
  );

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <Link
        href="/student/listings"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-5"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to listings
      </Link>

      <div className="relative mb-6">
        <ListingDetailImageGallery images={images} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 xl:gap-8">
        {/* ── LEFT ── */}
        <div className="space-y-5 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-serif font-semibold text-foreground">
                £{listing.price_per_month.toLocaleString()}
              </span>
              <span className="text-base text-muted-foreground font-normal">
                {priceSuffix}
              </span>
            </div>
            <div className="flex flex-wrap gap-4">
              <ListingDetailStatBadge
                icon={Users}
                label="Max Occupants"
                value={String(listing.max_occupants)}
              />
              <ListingDetailStatBadge
                icon={Clock}
                label="Min Stay"
                value={formatListingMinStay(listing.min_stay_months)}
              />
              <ListingDetailStatBadge
                icon={Calendar}
                label="Available"
                value={availableDate}
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
              {ROOM_TYPE_LABELS[listing.room_type]} · {listing.city}
              {listing.country !== "United Kingdom"
                ? `, ${listing.country}`
                : ""}
            </p>
            <h1 className="text-xl sm:text-2xl font-serif font-medium text-foreground leading-snug">
              {listing.title}
            </h1>
            <div className="flex items-center gap-1.5 mt-2">
              <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="text-sm text-muted-foreground">
                {fullAddress}
              </span>
            </div>
          </div>

          <div className="border-t border-border/50" />

          {listing.description && (
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-2">
                About this listing
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {displayDesc}
              </p>
              {shouldTruncateDesc && (
                <button
                  type="button"
                  onClick={() => setDescExpanded((v) => !v)}
                  className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  {descExpanded ? (
                    <>
                      Show less <ChevronUp className="h-3.5 w-3.5" />
                    </>
                  ) : (
                    <>
                      See full description{" "}
                      <ChevronDown className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          <Card className="py-0">
            <CardHeader className="pt-5 pb-0 px-5">
              <CardTitle className="text-sm font-semibold">
                Property details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 pb-5 px-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0">
                {[
                  {
                    label: "Property Type",
                    value: ROOM_TYPE_LABELS[listing.room_type],
                  },
                  {
                    label: "Max Occupants",
                    value: String(listing.max_occupants),
                  },
                  { label: "Available From", value: availableDate },
                  {
                    label: "Min Stay",
                    value: `${listing.min_stay_months} month${listing.min_stay_months !== 1 ? "s" : ""}`,
                  },
                  {
                    label: "Gender Preference",
                    value: GENDER_PREFERENCE_LABELS[listing.gender_preference],
                  },
                  ...(listing.university_name
                    ? [
                        {
                          label: "Target University",
                          value: listing.university_name,
                        },
                      ]
                    : []),
                ].map(({ label, value }, idx) => (
                  <div
                    key={label}
                    className={cn(
                      "flex items-start justify-between py-3 sm:py-2.5",
                      idx % 2 === 0
                        ? "sm:pr-6"
                        : "sm:pl-6 sm:border-l sm:border-border/50",
                    )}
                  >
                    <span className="text-sm text-muted-foreground">
                      {label}
                    </span>
                    <span className="text-sm font-medium text-foreground text-right max-w-[55%]">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {activeAmenities.length > 0 && (
            <Card className="py-0">
              <CardHeader className="pt-5 pb-0 px-5">
                <CardTitle className="text-sm font-semibold">
                  Amenities
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 pb-5 px-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {activeAmenities.map(({ key, label, icon: Icon }) => (
                    <div
                      key={key}
                      className="flex items-center gap-2.5 py-2 px-3 rounded-lg bg-muted/50 border border-border/40"
                    >
                      <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Compatibility section — handles all states internally */}
          {viewerProfile && (
            <CompatibilitySection
              viewerProfile={viewerProfile}
              tenants={tenantProfiles}
              isViewerTenant={isViewerTenant}
              maxOccupants={listing.max_occupants}
            />
          )}

          {/* Request to join — for multi-occupancy listings */}
          {listing.max_occupants > 1 && (
            <TenantRequestButton
              listingId={listing.id}
              userId={userId}
              isDisabled={isTestUser}
            />
          )}

          <Card className="py-0">
            <CardHeader className="pt-5 pb-0 px-5">
              <CardTitle className="text-sm font-semibold">Location</CardTitle>
            </CardHeader>
            <CardContent className="pb-5 px-5 space-y-3">
              {listing.latitude && listing.longitude ? (
                <div className="rounded-lg overflow-hidden border border-border h-54 isolate">
                  <ListingDetailMap
                    key={`map-${listing.id}`}
                    latitude={listing.latitude}
                    longitude={listing.longitude}
                    title={listing.title}
                    address={[listing.address_line, listing.city]
                      .filter(Boolean)
                      .join(", ")}
                  />
                </div>
              ) : null}

              <div className="flex items-start justify-between gap-3 p-3 rounded-lg bg-muted/50 border border-border/40">
                <div className="flex items-start gap-2.5 min-w-0">
                  <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground leading-snug">
                      {listing.address_line}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {[listing.city, listing.postcode, listing.country]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                </div>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  View on map
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── RIGHT: Sticky Sidebar ── */}
        <div className="lg:sticky lg:top-20 self-start space-y-4">
          <Card className="py-0">
            <CardContent className="p-5 space-y-4">
              <div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-2xl font-serif font-semibold text-foreground">
                    £{listing.price_per_month.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {priceSuffix}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge variant="secondary" className="text-xs">
                    {ROOM_TYPE_LABELS[listing.room_type]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">
                    Available {availableShortDate}
                  </span>
                </div>
              </div>

              <div className="border-t border-border/50" />

              <TooltipProvider delayDuration={300}>
                <div className="space-y-2.5">
                  {callHref ? (
                    isTestUser ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground h-10"
                            disabled
                          >
                            <Phone className="h-4 w-4" />
                            Call Lister
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Disabled for test accounts
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <CallConfirmDialog
                        formattedPhone={formattedPhone}
                        callHref={callHref}
                      >
                        <Button className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground h-10">
                          <Phone className="h-4 w-4" />
                          Call Lister
                        </Button>
                      </CallConfirmDialog>
                    )
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground h-10"
                          disabled
                        >
                          <Phone className="h-4 w-4" />
                          Call Lister
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Contact coming soon</TooltipContent>
                    </Tooltip>
                  )}
                  {userId !== listing.lister_id && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full gap-2 h-10"
                          disabled={isChatDisabled}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (isTestUser) {
                              toast.error("Chat is disabled for test accounts");
                              return;
                            }
                            initChat({
                              listerId: listing.lister_id,
                              listingId: listing.id,
                            });
                          }}
                        >
                          <MessageCircle className="h-4 w-4" />
                          Dormr Chat
                        </Button>
                      </TooltipTrigger>
                      {isTestUser && (
                        <TooltipContent>
                          Disabled for test accounts
                        </TooltipContent>
                      )}
                    </Tooltip>
                  )}
                </div>
              </TooltipProvider>

              <div className="space-y-2 pt-1">
                {[
                  {
                    label: "Min stay",
                    value: formatListingMinStay(listing.min_stay_months),
                  },
                  {
                    label: "Max occupants",
                    value: String(listing.max_occupants),
                  },
                  {
                    label: "Gender pref.",
                    value: GENDER_PREFERENCE_LABELS[listing.gender_preference],
                  },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="py-0 border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-2.5">
                <Shield className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-foreground mb-0.5">
                    Verified listing
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    This property is listed by a verified Dormr lister. Always
                    visit in person before committing.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
