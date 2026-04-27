"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CompareYearSelectorProps {
  year: number;
  availableYears: number[];
  label: string;
  onYearChange: (year: number) => void;
}

export function CompareYearSelector({
  year,
  availableYears,
  label,
  onYearChange,
}: CompareYearSelectorProps) {
  return (
    <div className="flex-1">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
        {label}
      </label>
      <Select
        value={year.toString()}
        onValueChange={(val) => onYearChange(Number(val))}
      >
        <SelectTrigger className="w-full h-10 px-4 rounded-lg border-border bg-background text-sm font-semibold tabular-nums hover:border-primary/30 transition-all cursor-pointer">
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent position="popper" side="bottom">
          {availableYears.map((y) => (
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
  );
}
