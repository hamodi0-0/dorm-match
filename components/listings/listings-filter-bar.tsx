"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { GenderPreference, RoomType } from "@/lib/types/listing";
import type { ListingsFilterChange } from "@/lib/types/listings-browse";

interface FilterBarProps {
  searchQuery: string;
  onSearch: (value: string) => void;
  onClearSearch: () => void;
  roomType: RoomType | null;
  maxPrice: number | null;
  genderPreference: GenderPreference | null;
  onFilterChange: (next: ListingsFilterChange) => void;
  onReset: () => void;
  activeFilterCount: number;
  totalCount: number;
}

export function ListingsFilterBar({
  searchQuery,
  onSearch,
  onClearSearch,
  roomType,
  maxPrice,
  genderPreference,
  onFilterChange,
  onReset,
  activeFilterCount,
  totalCount,
}: FilterBarProps) {
  const hasActiveFilters =
    !!searchQuery || !!roomType || maxPrice !== null || !!genderPreference;

  return (
    <div className="sticky top-0 z-20 bg-background/97 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
        <div className="hidden md:flex items-center gap-2">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search by city, area, university, or keyword…"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-9 h-10 w-full"
            />
            {searchQuery && (
              <button
                onClick={onClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="w-px h-6 bg-border shrink-0" />

          <Select
            value={roomType ?? "all"}
            onValueChange={(v) =>
              onFilterChange({ roomType: v === "all" ? null : (v as RoomType) })
            }
          >
            <SelectTrigger className="h-10 text-sm w-auto min-w-35 shrink-0">
              <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5 text-muted-foreground shrink-0" />
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="single">Single Room</SelectItem>
              <SelectItem value="shared">Shared Room</SelectItem>
              <SelectItem value="studio">Studio</SelectItem>
              <SelectItem value="entire_apartment">Entire Apartment</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={maxPrice !== null ? String(maxPrice) : "any"}
            onValueChange={(v) =>
              onFilterChange({ maxPrice: v === "any" ? null : Number(v) })
            }
          >
            <SelectTrigger className="h-10 text-sm w-auto min-w-32.5 shrink-0">
              <SelectValue placeholder="Any Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Price</SelectItem>
              <SelectItem value="500">Up to £500/mo</SelectItem>
              <SelectItem value="750">Up to £750/mo</SelectItem>
              <SelectItem value="1000">Up to £1,000/mo</SelectItem>
              <SelectItem value="1500">Up to £1,500/mo</SelectItem>
              <SelectItem value="2000">Up to £2,000/mo</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={genderPreference ?? "any"}
            onValueChange={(v) =>
              onFilterChange({
                genderPreference: v === "any" ? null : (v as GenderPreference),
              })
            }
          >
            <SelectTrigger className="h-10 text-sm w-auto min-w-35 shrink-0">
              <SelectValue placeholder="Any Preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Preference</SelectItem>
              <SelectItem value="no_preference">No Preference</SelectItem>
              <SelectItem value="male_only">Male Only</SelectItem>
              <SelectItem value="female_only">Female Only</SelectItem>
              <SelectItem value="mixed">Mixed</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-10 text-sm text-muted-foreground hover:text-foreground gap-1 shrink-0"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </Button>
          )}

          <div className="ml-auto flex items-center gap-2 shrink-0">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              <span className="font-semibold text-foreground">
                {totalCount}
              </span>{" "}
              {totalCount === 1 ? "property" : "properties"}
            </span>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="text-xs h-5">
                {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </div>

        {/* Mobile */}
        <div className="flex flex-col gap-2 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search city, area, university…"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-9 h-10"
            />
            {searchQuery && (
              <button
                onClick={onClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto flex-nowrap pb-1">
            <Select
              value={roomType ?? "all"}
              onValueChange={(v) =>
                onFilterChange({
                  roomType: v === "all" ? null : (v as RoomType),
                })
              }
            >
              <SelectTrigger className="h-8 text-xs w-auto min-w-27.5 shrink-0">
                <SlidersHorizontal className="h-3 w-3 mr-1 text-muted-foreground shrink-0" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="shared">Shared</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
                <SelectItem value="entire_apartment">Apartment</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={maxPrice !== null ? String(maxPrice) : "any"}
              onValueChange={(v) =>
                onFilterChange({ maxPrice: v === "any" ? null : Number(v) })
              }
            >
              <SelectTrigger className="h-8 text-xs w-auto min-w-25 shrink-0">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Price</SelectItem>
                <SelectItem value="500">≤ £500</SelectItem>
                <SelectItem value="750">≤ £750</SelectItem>
                <SelectItem value="1000">≤ £1,000</SelectItem>
                <SelectItem value="1500">≤ £1,500</SelectItem>
                <SelectItem value="2000">≤ £2,000</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={genderPreference ?? "any"}
              onValueChange={(v) =>
                onFilterChange({
                  genderPreference:
                    v === "any" ? null : (v as GenderPreference),
                })
              }
            >
              <SelectTrigger className="h-8 text-xs w-auto min-w-25 shrink-0">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="no_preference">No Pref.</SelectItem>
                <SelectItem value="male_only">Male Only</SelectItem>
                <SelectItem value="female_only">Female Only</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1 px-2 shrink-0"
              >
                <X className="h-3 w-3" />
                Clear
              </Button>
            )}

            <div className="flex items-center gap-1.5 shrink-0 ml-auto">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                <span className="font-semibold text-foreground">
                  {totalCount}
                </span>{" "}
                {totalCount === 1 ? "place" : "places"}
              </span>
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="text-[10px] h-4">
                  {activeFilterCount}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
