import { Skeleton } from "@/components/ui/skeleton";

function AvatarSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6">
      <Skeleton className="w-24 h-24 rounded-full shrink-0" />
      <div className="flex-1 min-w-0">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-52 mb-1" />
        <Skeleton className="h-4 w-60" />
        <div className="flex gap-2 mt-3">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function EditableFieldSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between ${compact ? "py-2.5" : "py-3.5"}`}
    >
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
}

function CardSkeleton({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card py-0">
      {title && (
        <div className="pt-5 pb-0 px-5">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-48 mt-1" />
        </div>
      )}
      <div className={title ? "pt-4 pb-5 px-5" : "p-5"}>{children}</div>
    </div>
  );
}

export default function ProfilePageLoading() {
  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
      {/* Click-to-edit hint */}
      <Skeleton className="h-4 w-56 mb-5" />

      {/* ── Profile Header ── */}
      <CardSkeleton>
        <AvatarSkeleton />
        <div className="border-t border-border pt-4">
          <EditableFieldSkeleton />
          <EditableFieldSkeleton compact />
          <EditableFieldSkeleton compact />
          <EditableFieldSkeleton compact />
        </div>
      </CardSkeleton>

      {/* ── University Info ── */}
      <div className="mt-4">
        <CardSkeleton title="University Info">
          <EditableFieldSkeleton />
          <EditableFieldSkeleton compact />
          <EditableFieldSkeleton compact />
        </CardSkeleton>
      </div>

      {/* ── Lifestyle & Preferences Grid ── */}
      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        {/* Lifestyle */}
        <CardSkeleton title="Lifestyle">
          <EditableFieldSkeleton compact />
          <EditableFieldSkeleton compact />
          <EditableFieldSkeleton compact />
          <EditableFieldSkeleton compact />
          <EditableFieldSkeleton compact />
        </CardSkeleton>

        {/* Preferences */}
        <CardSkeleton title="Preferences">
          <EditableFieldSkeleton compact />
          <EditableFieldSkeleton compact />
          <EditableFieldSkeleton compact />
          <EditableFieldSkeleton compact />
        </CardSkeleton>
      </div>

      {/* ── Hobbies ── */}
      <div className="mt-4">
        <CardSkeleton title="Hobbies">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-full" />
            ))}
          </div>
        </CardSkeleton>
      </div>
    </main>
  );
}
