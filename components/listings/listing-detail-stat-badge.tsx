import type { ListingDetailStatBadgeProps } from "@/lib/types/listing-detail";

export function ListingDetailStatBadge({
  icon: Icon,
  label,
  value,
}: ListingDetailStatBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10">
        <Icon className="h-3.5 w-3.5 text-primary" />
      </div>
      <div>
        <p className="text-xs leading-none text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}
