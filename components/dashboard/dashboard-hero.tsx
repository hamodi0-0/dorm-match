import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, ArrowRight, BedDouble } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useListingFilters, type RoomType } from "@/lib/stores/listing-filters-store";
import type { StudentProfile } from "@/hooks/use-student-profile";
import { YEAR_LABELS } from "@/lib/constants";
import { getGreeting } from "@/lib/helpers/date";

export function DashboardHero({ profile }: { profile: StudentProfile }) {
  const router = useRouter();
  const { searchQuery, roomType, setSearchQuery, setRoomType } = useListingFilters();
  
  const firstName = profile.full_name.split(" ")[0];
  const yearLabel = YEAR_LABELS[profile.year_of_study] ?? profile.year_of_study;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-primary/5 dark:bg-primary/10 border border-primary/20 p-6 sm:p-8">
      <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary/10 dark:bg-primary/15" />
      <div className="pointer-events-none absolute -bottom-8 right-36 h-24 w-24 rounded-full bg-primary/8 dark:bg-primary/12" />
      <div className="pointer-events-none absolute top-1/3 -left-5 h-16 w-16 rounded-full bg-primary/5" />
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

        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search by city, university, or room type…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && router.push("/dashboard/listings")}
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
              <SelectItem value="entire_apartment">Entire Apartment</SelectItem>
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
  );
}
