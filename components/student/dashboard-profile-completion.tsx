import Link from "next/link";
import { CheckCircle2, Circle, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { StudentProfile } from "@/hooks/use-student-profile";
import { COMPLETION_ITEMS } from "@/lib/helpers/profile";

export function DashboardProfileCompletion({ profile }: { profile: StudentProfile }) {
  const doneCount = COMPLETION_ITEMS.filter((item) => item.done(profile)).length;
  const completionScore = Math.round((doneCount / COMPLETION_ITEMS.length) * 100);
  const showCompletion = completionScore < 100;

  if (!showCompletion) return null;

  return (
    <Card className="py-0 border-primary/20">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Complete your profile</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                A complete profile gets significantly better roommate matches
              </p>
            </div>
          </div>
          <span className="text-sm font-bold text-primary shrink-0">{completionScore}%</span>
        </div>

        <div className="w-full bg-muted rounded-full h-1.5 mb-4">
          <div
            className="bg-primary h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${completionScore}%` }}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {COMPLETION_ITEMS.map((item) => {
            const isDone = item.done(profile);
            return (
              <Link
                key={item.label}
                href="/student/profile"
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors",
                  isDone
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                    : "border-border bg-muted/50 text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5"
                )}
              >
                {isDone ? <CheckCircle2 className="h-3 w-3 shrink-0" /> : <Circle className="h-3 w-3 shrink-0" />}
                {item.label}
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
