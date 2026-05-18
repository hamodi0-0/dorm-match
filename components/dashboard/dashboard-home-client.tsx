"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  Search,
  SlidersHorizontal,
  ArrowRight,
  MessageSquare,
  Home,
  CheckCircle2,
  Circle,
  Building2,
  ChevronRight,
  Sparkles,
  Clock,
  BedDouble,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useStudentProfile,
  type StudentProfile,
} from "@/hooks/use-student-profile";
import {
  useListingFilters,
  type RoomType,
} from "@/lib/stores/listing-filters-store";
import { fetchListingsPage } from "@/hooks/use-public-listings-page";
import type { ListingsPageResult } from "@/lib/types/listings-browse";
import { prefetchCoverImages } from "@/lib/helpers/image";
import {
  EMPTY_FILTERS,
  PUBLIC_LISTINGS_QUERY_BASE,
  YEAR_LABELS,
} from "@/lib/constants";
import type {
  RecentConversation,
  TenantRequestItem,
  RequestStatus,
} from "@/lib/types/student-dashboard";
import { cn } from "@/lib/utils";

// ─── Constants ────────────────────────────────────────────────────────────────

const QUERY_KEY = [PUBLIC_LISTINGS_QUERY_BASE, 1, EMPTY_FILTERS] as const;

const STATUS_CONFIG: Record<
  RequestStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className:
      "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-300",
  },
  accepted: {
    label: "Accepted 🎉",
    className:
      "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300",
  },
  rejected: {
    label: "Not accepted",
    className: "border-border bg-muted/50 text-muted-foreground",
  },
  removed: {
    label: "Removed",
    className:
      "border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-700 dark:bg-orange-950/30 dark:text-orange-300",
  },
};

const COMPLETION_ITEMS: {
  label: string;
  done: (p: StudentProfile) => boolean;
}[] = [
  { label: "Profile photo", done: (p) => !!p.avatar_url },
  {
    label: "Write a bio",
    done: (p) => !!p.bio && p.bio.trim().length > 10,
  },
  { label: "Phone number", done: (p) => !!p.phone },
  { label: "3+ hobbies", done: (p) => (p.hobbies?.length ?? 0) >= 3 },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  initialProfile: StudentProfile | null;
  recentConversations: RecentConversation[];
  tenantRequests: TenantRequestItem[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DashboardHomeClient({
  initialProfile,
  recentConversations,
  tenantRequests,
}: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: profile } = useStudentProfile(initialProfile ?? undefined);
  const { searchQuery, roomType, setSearchQuery, setRoomType } =
    useListingFilters();

  // Prefetch listings + cover images for instant browse navigation
  useEffect(() => {
    const cached = queryClient.getQueryData<ListingsPageResult>(QUERY_KEY);
    if (cached) {
      prefetchCoverImages(cached.listings);
      return;
    }
    queryClient
      .prefetchQuery({
        queryKey: QUERY_KEY,
        queryFn: () => fetchListingsPage(1, EMPTY_FILTERS),
        staleTime: 60 * 1000,
      })
      .then(() => {
        const data = queryClient.getQueryData<ListingsPageResult>(QUERY_KEY);
        if (data) prefetchCoverImages(data.listings);
      });
  }, [queryClient]);

  if (!profile) return null;

  const firstName = profile.full_name.split(" ")[0];
  const yearLabel = YEAR_LABELS[profile.year_of_study] ?? profile.year_of_study;

  // Profile completion
  const doneCount = COMPLETION_ITEMS.filter((item) =>
    item.done(profile),
  ).length;
  const completionScore = Math.round(
    (doneCount / COMPLETION_ITEMS.length) * 100,
  );
  const showCompletion = completionScore < 100;

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-5">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden rounded-2xl bg-primary/5 dark:bg-primary/10 border border-primary/20 p-6 sm:p-8">
        {/* Decorative circles inspired by the warm dorm room palette */}
        <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary/10 dark:bg-primary/15" />
        <div className="pointer-events-none absolute -bottom-8 right-36 h-24 w-24 rounded-full bg-primary/8 dark:bg-primary/12" />
        <div className="pointer-events-none absolute top-1/3 -left-5 h-16 w-16 rounded-full bg-primary/5" />
        {/* Ultra-subtle bunk bed icon — evoking the dorm room image */}
        <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 right-6 hidden sm:block opacity-[0.06] dark:opacity-[0.08]">
          <BedDouble className="h-36 w-36 text-primary" />
        </div>

        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary/80 mb-2">
            {getGreeting()} ✦
          </p>
          <h1 className="text-2xl sm:text-3xl font-serif font-medium text-foreground mb-1.5">
            Welcome back, {firstName}! 🏠
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            {yearLabel} · {profile.major} · {profile.university_name}
          </p>

          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search by city, university, or room type…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && router.push("/dashboard/listings")
                }
                className="pl-9 h-10 bg-background/80 dark:bg-background/50 border-border/60"
              />
            </div>
            <Select
              value={roomType ?? "all"}
              onValueChange={(v) =>
                setRoomType(v === "all" ? null : (v as RoomType))
              }
            >
              <SelectTrigger className="h-10 w-auto min-w-[130px] bg-background/80 dark:bg-background/50">
                <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue placeholder="Room Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="single">Single Room</SelectItem>
                <SelectItem value="shared">Shared Room</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
                <SelectItem value="entire_apartment">
                  Entire Apartment
                </SelectItem>
              </SelectContent>
            </Select>
            <Button
              className="h-10 gap-2 shrink-0"
              onClick={() => router.push("/dashboard/listings")}
            >
              Search
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* ── Activity Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Application Status */}
        <Card className="lg:col-span-2 py-0">
          <CardHeader className="px-5 pt-5 pb-3 border-b border-border">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                  <Building2 className="h-3.5 w-3.5 text-primary" />
                </div>
                My Applications
              </CardTitle>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-xs h-7 gap-1 shrink-0"
              >
                <Link href="/dashboard/notifications">
                  View all
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {tenantRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-center px-4">
                <div className="w-11 h-11 rounded-full bg-muted flex items-center justify-center">
                  <Home className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    No applications yet
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Find a listing and request to join as a tenant.
                  </p>
                </div>
                <Button asChild size="sm" className="gap-1.5 mt-1">
                  <Link href="/dashboard/listings">
                    Browse Listings
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            ) : (
              tenantRequests.map((req, i) => {
                const config = STATUS_CONFIG[req.status];
                const timeAgo = formatDistanceToNow(new Date(req.updated_at), {
                  addSuffix: true,
                });
                return (
                  <Link
                    key={req.id}
                    href={`/dashboard/listings/${req.listing_id}`}
                    className={cn(
                      "flex items-center gap-3 px-5 py-4 hover:bg-muted/30 transition-colors",
                      i < tenantRequests.length - 1 &&
                        "border-b border-border/50",
                    )}
                  >
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Home className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {req.listing_title}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                        <Clock className="h-3 w-3 shrink-0" />
                        <span>{timeAgo}</span>
                        {req.listing_city && (
                          <>
                            <span>·</span>
                            <span>{req.listing_city}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn("text-xs shrink-0", config.className)}
                    >
                      {config.label}
                    </Badge>
                  </Link>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Recent Chats */}
        <Card className="py-0">
          <CardHeader className="px-5 pt-5 pb-3 border-b border-border">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                  <MessageSquare className="h-3.5 w-3.5 text-primary" />
                </div>
                Recent Chats
              </CardTitle>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-xs h-7 gap-1 shrink-0"
              >
                <Link href="/dashboard/chats">
                  All
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {recentConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2 text-center px-4">
                <div className="w-11 h-11 rounded-full bg-muted flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    No messages yet
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Chat with listers from any listing.
                  </p>
                </div>
              </div>
            ) : (
              recentConversations.map((conv, i) => {
                const timeAgo = formatDistanceToNow(new Date(conv.updated_at), {
                  addSuffix: true,
                });
                return (
                  <Link
                    key={conv.id}
                    href={`/dashboard/chats/${conv.id}`}
                    className={cn(
                      "flex items-center gap-3 px-5 py-4 hover:bg-muted/30 transition-colors",
                      i < recentConversations.length - 1 &&
                        "border-b border-border/50",
                    )}
                  >
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <MessageSquare className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {conv.listing_title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {timeAgo}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </Link>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Profile Completion ── */}
      {showCompletion && (
        <Card className="py-0 border-primary/20">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Complete your profile
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    A complete profile gets significantly better roommate
                    matches
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold text-primary shrink-0">
                {completionScore}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-muted rounded-full h-1.5 mb-4">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${completionScore}%` }}
              />
            </div>

            {/* Completion items as pills */}
            <div className="flex flex-wrap gap-2">
              {COMPLETION_ITEMS.map((item) => {
                const isDone = item.done(profile);
                return (
                  <Link
                    key={item.label}
                    href="/dashboard/profile"
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors",
                      isDone
                        ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                        : "border-border bg-muted/50 text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5",
                    )}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-3 w-3 shrink-0" />
                    ) : (
                      <Circle className="h-3 w-3 shrink-0" />
                    )}
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
