"use client";

import { Sparkles, Info, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function NoTenantsState() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          Compatibility
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-3 rounded-lg bg-muted/40 border border-border/50 p-4">
          <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            No tenants have joined this listing yet — compatibility scores will
            appear once they do.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function ListedAloneState() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          Compatibility
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-4">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 leading-snug">
              You&apos;re listed in this property
            </p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              You&apos;re currently the only tenant here. Compatibility scores
              will appear once other tenants join.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
