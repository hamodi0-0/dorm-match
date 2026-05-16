"use client";

import {} from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  MapPin,
  Users,
  Phone,
  MessageCircle,
  Home,
  Clock,
  Heart,
  Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getDialablePhone, formatPhoneDisplay } from "@/lib/helpers/phone";
import { ImageCarousel } from "@/components/listings/image-carousel";
import { cn } from "@/lib/utils";
import type { ListingCardProps } from "@/lib/types/listing";
import { ROOM_TYPE_LABELS, BILLING_PERIOD_SUFFIX } from "@/lib/types/listing";

import { CompatibilityBadge } from "@/components/compatibility/compatibility-badge";
import { useCompatibility } from "@/hooks/use-compatibility";
import { useInitChat } from "@/hooks/use-init-chat";
import { CallConfirmDialog } from "@/components/listings/call-confirm-dialog";

export function ListingCard({
  listing,
  tenantProfiles,
  viewerProfile,
}: ListingCardProps) {
  const images = listing.listing_images ?? [];
  const priceSuffix = BILLING_PERIOD_SUFFIX[listing.billing_period] ?? "/mo";
  const postedAgo = formatDistanceToNow(new Date(listing.created_at), {
    addSuffix: true,
  });
  const roomTypeLabel = ROOM_TYPE_LABELS[listing.room_type];
  const locationParts = [listing.address_line, listing.city]
    .filter(Boolean)
    .join(", ");
  const compatResult = useCompatibility(
    viewerProfile ?? null,
    tenantProfiles ?? [],
  );
  const { mutate: initChat, isPending: isInitChatPending } = useInitChat();

  const dialablePhone = listing.contact_phone
    ? getDialablePhone(listing.contact_phone)
    : null;
  const callHref = dialablePhone ? `tel:${dialablePhone}` : null;
  const formattedPhone = listing.contact_phone
    ? formatPhoneDisplay(listing.contact_phone)
    : "";

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className={cn(
          "bg-card border border-border rounded-xl overflow-hidden my-2",
          "shadow-sm hover:shadow-md transition-all duration-200",
          "flex flex-col",
        )}
      >
        {/* ── Card body: image + content ─────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative w-full sm:w-72 lg:w-80 xl:w-88 shrink-0 h-52 sm:h-56 bg-muted">
            <ImageCarousel
              images={images}
              listingId={listing.id}
              title={listing.title}
            />
          </div>

          {/* Content */}
          <div className="flex-1 p-4 sm:p-5 flex flex-col gap-3 min-w-0">
            {/* Top row: room type badge + compatibility */}
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                {roomTypeLabel}
              </span>
              {listing.max_occupants > 1 && viewerProfile !== undefined && (
                <CompatibilityBadge
                  score={compatResult?.overallScore ?? null}
                  tenantCount={tenantProfiles?.length ?? 0}
                />
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-bold text-foreground leading-none">
                £{listing.price_per_month.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground">
                {priceSuffix}
              </span>
            </div>

            {/* Title */}
            <Link
              href={`/dashboard/listings/${listing.id}`}
              className="group/title"
            >
              <h3 className="text-sm sm:text-base font-semibold text-foreground group-hover/title:text-primary transition-colors leading-snug line-clamp-2">
                {listing.title}
              </h3>
            </Link>

            {/* Location */}
            <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary/70" />
              <span className="line-clamp-1">{locationParts}</span>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-1 border-t border-border/50">
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 shrink-0" />
                <span>{listing.max_occupants}</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-1.5">
                <Home className="h-4 w-4 shrink-0" />
                <span>{roomTypeLabel}</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>{listing.min_stay_months}mo min</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer: posted time + action buttons ───────────────────────── */}
        <div className="border-t border-border/60 px-4 sm:px-5 py-3 flex items-center justify-between gap-3 bg-muted/30">
          {/* Listed time */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            <Clock className="h-3 w-3" />
            <span>Listed {postedAgo}</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 z-10">
            {callHref ? (
              <CallConfirmDialog
                formattedPhone={formattedPhone}
                callHref={callHref}
              >
                <Button
                  size="sm"
                  className="h-8 gap-1.5 text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Call</span>
                </Button>
              </CallConfirmDialog>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 text-xs"
                    disabled
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Call</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Contact coming soon</TooltipContent>
              </Tooltip>
            )}

            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs"
              disabled={isInitChatPending}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                initChat({
                  listerId: listing.lister_id,
                  listingId: listing.id,
                });
              }}
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Chat</span>
            </Button>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                  disabled
                >
                  <Heart className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Save listing (coming soon)</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
