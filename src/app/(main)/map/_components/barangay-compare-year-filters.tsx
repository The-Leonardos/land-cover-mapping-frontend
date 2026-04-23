"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BarangayCompareYearFiltersProps {
  comparisonYear1: number;
  comparisonYear2: number;
  availableYears: number[];
  onYear1Change: (year: number) => void;
  onYear2Change: (year: number) => void;
}

/**
 * Year comparison selector with validation.
 * Ensures comparisonYear1 is always less than comparisonYear2.
 */
export function BarangayCompareYearFilters({
  comparisonYear1,
  comparisonYear2,
  availableYears,
  onYear1Change,
  onYear2Change,
}: BarangayCompareYearFiltersProps) {
  // Only show valid options that maintain comparisonYear1 < comparisonYear2
  const year1Options = availableYears.filter((y) => y < comparisonYear2);
  const year2Options = availableYears.filter((y) => y > comparisonYear1);

  const handleYear1Change = (value: number) => {
    if (value >= comparisonYear2) {
      const nextYear2 = availableYears.find((y) => y > value);
      if (nextYear2) onYear2Change(nextYear2);
    }
    onYear1Change(value);
  };

  const handleYear2Change = (value: number) => {
    if (value <= comparisonYear1) {
      const prevYear1 = [...availableYears].reverse().find((y) => y < value);
      if (prevYear1) onYear1Change(prevYear1);
    }
    onYear2Change(value);
  };

  return (
    <div className="flex items-center justify-center gap-4 bg-muted/20 p-4 rounded-xl border border-border/50">
      <div className="w-full sm:w-auto flex-1">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
          Base Year
        </label>
        <Select
          value={comparisonYear1.toString()}
          onValueChange={(val) => handleYear1Change(Number(val))}
        >
          <SelectTrigger className="w-full h-10 px-4 rounded-lg border-border bg-background text-sm font-semibold tabular-nums hover:border-primary/30 transition-all cursor-pointer">
            <SelectValue placeholder="Base Year" />
          </SelectTrigger>
          <SelectContent position="popper" side="bottom">
            {year1Options.map((y) => (
              <SelectItem
                key={y}
                value={y.toString()}
                className="text-xs md:text-sm tabular-nums cursor-pointer focus:bg-primary focus:text-primary-foreground"
              >
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-center pt-5">
        <span className="text-muted-foreground font-bold bg-muted/50 px-2.5 py-1 rounded text-xs ring-1 ring-border/50">
          VS
        </span>
      </div>

      <div className="w-full sm:w-auto flex-1">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
          Compare Year
        </label>
        <Select
          value={comparisonYear2.toString()}
          onValueChange={(val) => handleYear2Change(Number(val))}
        >
          <SelectTrigger className="w-full h-10 px-4 rounded-lg border-border bg-background text-sm font-semibold tabular-nums hover:border-primary/30 transition-all cursor-pointer">
            <SelectValue placeholder="Compare Year" />
          </SelectTrigger>
          <SelectContent position="popper" side="bottom">
            {year2Options.map((y) => (
              <SelectItem
                key={y}
                value={y.toString()}
                className="text-xs md:text-sm tabular-nums cursor-pointer focus:bg-primary focus:text-primary-foreground"
              >
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
