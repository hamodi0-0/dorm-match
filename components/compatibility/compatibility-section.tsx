"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { Sparkles, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  calculateCollectiveCompatibility,
  getScoreTier,
  getScoreLabel,
  normalizeCompatibilityPercentage,
  SCORE_TIER_CLASSES,
} from "@/lib/compatibilityCalc";
import type { TenantCompatibilityProfile } from "@/lib/types/compatibility";

import { SegmentedRing } from "@/components/compatibility/segmented-ring";
import { TenantBreakdownItem } from "@/components/compatibility/tenant-breakdown-item";
import {
  NoTenantsState as ImportedNoTenantsState,
  ListedAloneState as ImportedListedAloneState,
} from "@/components/compatibility/states";

// ─── Main component ───────────────────────────────────────────────────────────

interface CompatibilitySectionProps {
  viewerProfile: TenantCompatibilityProfile;
  /** Other tenants — viewer's own profile already excluded by the server */
  tenants: TenantCompatibilityProfile[];
  isViewerTenant: boolean;
  maxOccupants: number;
}

export function CompatibilitySection({
  viewerProfile,
  tenants,
  isViewerTenant,
  maxOccupants,
}: CompatibilitySectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [breakdownOpen, setBreakdownOpen] = useState(false);

  const shouldShowCompatibility = tenants.length > 0;

  const result = useMemo(() => {
    if (!shouldShowCompatibility) return null;
    return calculateCollectiveCompatibility(viewerProfile, tenants);
  }, [shouldShowCompatibility, viewerProfile, tenants]);

  // Trigger animation when the card scrolls into view
  useEffect(() => {
    if (!shouldShowCompatibility || hasAnimated || !sectionRef.current) return;

    const el = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldShowCompatibility, hasAnimated]);

  // ── Single occupancy → show nothing ───────────────────────────────────────
  if (maxOccupants <= 1) return null;

  // ── No tenants at all ─────────────────────────────────────────────────────
  if (!isViewerTenant && tenants.length === 0)
    return <ImportedNoTenantsState />;

  // ── Viewer is listed alone ────────────────────────────────────────────────
  if (isViewerTenant && tenants.length === 0)
    return <ImportedListedAloneState />;

  // ── Show compatibility ────────────────────────────────────────────────────
  if (!result) return null;

  const normalizedOverallScore = normalizeCompatibilityPercentage(
    result.overallScore,
  );
  const tier = getScoreTier(normalizedOverallScore);
  const colors = SCORE_TIER_CLASSES[tier];
  const matchLabel = getScoreLabel(normalizedOverallScore);

  return (
    <Card ref={sectionRef}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          Compatibility
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Score ring + summary */}
        <div className="flex items-center gap-5 sm:gap-6">
          <SegmentedRing
            targetScore={normalizedOverallScore}
            shouldAnimate={hasAnimated}
          />
          <div className="flex-1 min-w-0">
            <p className={cn("text-xl font-bold leading-tight", colors.text)}>
              {matchLabel}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              with {tenants.length} current tenant
              {tenants.length !== 1 ? "s" : ""}
            </p>

            {/* Quick-win badges for deal-breaker matches */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {result.details.smoking.matches === tenants.length && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="h-2.5 w-2.5 shrink-0" />
                  Smoking
                </span>
              )}
              {result.details.pets.matches === tenants.length && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="h-2.5 w-2.5 shrink-0" />
                  Pets
                </span>
              )}
              {result.details.sleep_schedule.matches === tenants.length && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="h-2.5 w-2.5 shrink-0" />
                  Sleep
                </span>
              )}
            </div>
          </div>
        </div>

        {/* View breakdown toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-muted-foreground hover:text-foreground gap-1.5"
          onClick={() => setBreakdownOpen((p) => !p)}
        >
          {breakdownOpen ? (
            <>
              <ChevronUp className="h-4 w-4" />
              Hide breakdown
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              View per-tenant breakdown
            </>
          )}
        </Button>

        {/* Per-tenant breakdown */}
        {breakdownOpen && (
          <div className="space-y-2">
            {result.tenantMatches.map((tm) => {
              const tenant = tenants[tm.tenantIndex - 1];
              if (!tenant) return null;
              return (
                <TenantBreakdownItem
                  key={tm.tenantIndex}
                  tenantIndex={tm.tenantIndex}
                  score={tm.score}
                  viewer={viewerProfile}
                  tenant={tenant}
                />
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
