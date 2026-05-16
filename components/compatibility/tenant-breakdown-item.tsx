"use client";

import { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TenantCompatibilityProfile } from "@/lib/types/compatibility";
import { SCORE_TIER_CLASSES } from "@/lib/compatibilityCalc";
import { SLEEP_LABELS, NOISE_LABELS, GUEST_LABELS } from "@/lib/constants";

interface FieldComparison {
  label: string;
  matches: boolean;
  viewerValue: string;
  tenantValue: string;
}

function getFieldComparisons(
  viewer: TenantCompatibilityProfile,
  tenant: TenantCompatibilityProfile,
): FieldComparison[] {
  const cleanDiff = Math.abs(viewer.cleanliness - tenant.cleanliness);

  return [
    {
      label: "Sleep Schedule",
      matches:
        viewer.sleep_schedule === tenant.sleep_schedule ||
        viewer.sleep_schedule === "flexible" ||
        tenant.sleep_schedule === "flexible",
      viewerValue: SLEEP_LABELS[viewer.sleep_schedule],
      tenantValue: SLEEP_LABELS[tenant.sleep_schedule],
    },
    {
      label: "Cleanliness",
      matches: cleanDiff <= 1,
      viewerValue: `${viewer.cleanliness}/5`,
      tenantValue: `${tenant.cleanliness}/5`,
    },
    {
      label: "Noise Level",
      matches:
        viewer.noise_level === tenant.noise_level ||
        viewer.noise_level === "moderate" ||
        tenant.noise_level === "moderate",
      viewerValue: NOISE_LABELS[viewer.noise_level],
      tenantValue: NOISE_LABELS[tenant.noise_level],
    },
    {
      label: "Guests",
      matches: viewer.guests_frequency === tenant.guests_frequency,
      viewerValue: GUEST_LABELS[viewer.guests_frequency],
      tenantValue: GUEST_LABELS[tenant.guests_frequency],
    },
    {
      label: "Smoking",
      matches: viewer.smoking === tenant.smoking,
      viewerValue: viewer.smoking ? "Smoker" : "Non-smoker",
      tenantValue: tenant.smoking ? "Smoker" : "Non-smoker",
    },
    {
      label: "Pets",
      matches: viewer.pets === tenant.pets,
      viewerValue: viewer.pets ? "Has pets" : "No pets",
      tenantValue: tenant.pets ? "Has pets" : "No pets",
    },
    {
      label: "Major",
      matches:
        !!viewer.major && !!tenant.major && viewer.major === tenant.major,
      viewerValue: viewer.major || "Unspecified",
      tenantValue: tenant.major || "Unspecified",
    },
  ];
}

interface TenantBreakdownItemProps {
  tenantIndex: number;
  score: number;
  viewer: TenantCompatibilityProfile;
  tenant: TenantCompatibilityProfile;
}

export function TenantBreakdownItem({
  tenantIndex,
  score,
  viewer,
  tenant,
}: TenantBreakdownItemProps) {
  const [expanded, setExpanded] = useState(false);
  const tier = score >= 75 ? "green" : score >= 50 ? "amber" : "red";
  const colors = SCORE_TIER_CLASSES[tier as keyof typeof SCORE_TIER_CLASSES];
  const comparisons = getFieldComparisons(viewer, tenant);
  const matchCount = comparisons.filter((c) => c.matches).length;

  const sharedHobbies = (viewer.hobbies ?? []).filter((h) =>
    (tenant.hobbies ?? []).includes(h),
  );

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center justify-between p-3 hover:bg-muted/40 transition-colors text-left gap-3"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={cn(
              "w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 tabular-nums",
              colors.border,
              colors.bg,
              colors.text,
            )}
          >
            {score}%
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground leading-snug">
              Tenant {tenantIndex}
            </p>
            <p className="text-xs text-muted-foreground leading-snug">
              {matchCount}/{comparisons.length} factors match
              {sharedHobbies.length > 0 &&
                ` · ${sharedHobbies.length} shared hobbies`}
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-border bg-muted/20 divide-y divide-border/50">
          {comparisons.map((comp) => (
            <div
              key={comp.label}
              className="flex items-start gap-3 px-4 py-2.5"
            >
              {comp.matches ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="h-4 w-4 text-red-400 dark:text-red-500 shrink-0 mt-0.5" />
              )}
              <span className="text-xs text-muted-foreground w-24 shrink-0 pt-0.5">
                {comp.label}
              </span>
              <div className="flex-1 min-w-0">
                {comp.matches ? (
                  <span className="text-xs font-medium text-foreground">
                    {comp.viewerValue}
                  </span>
                ) : (
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="font-medium text-foreground">
                      {comp.viewerValue}
                    </span>
                    <span className="text-muted-foreground/50 text-[10px]">
                      vs
                    </span>
                    <span
                      className={cn("font-medium", SCORE_TIER_CLASSES.red.text)}
                    >
                      {comp.tenantValue}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {sharedHobbies.length > 0 && (
            <div className="flex items-start gap-3 px-4 py-2.5">
              <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1.5">
                  Shared hobbies
                </p>
                <div className="flex flex-wrap gap-1">
                  {sharedHobbies.map((h) => (
                    <Badge key={h} variant="secondary" className="text-xs h-5">
                      {h}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
