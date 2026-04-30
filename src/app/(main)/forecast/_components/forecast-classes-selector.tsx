"use client"

import { Badge } from "@/components/ui/badge"
import { LAND_COVER_CLASSES } from "@/lib/types/land-cover-class"
import { cn } from "@/lib/utils"

interface ForecastClassesSelectorProps {
  selectedClasses: Set<string>
  onToggleClass: (classId: string) => void
  onSelectAll: () => void
}

export function ForecastClassesSelector({
  selectedClasses,
  onToggleClass,
  onSelectAll,
}: ForecastClassesSelectorProps) {
  const allSelected = selectedClasses.size === LAND_COVER_CLASSES.length

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-xs font-medium text-muted-foreground mr-1 uppercase tracking-wider">
        Classes
      </span>

      {/* Select / Deselect All */}
      <Badge
        variant={allSelected ? "default" : "outline"}
        className={cn(
          "cursor-pointer select-none h-7 px-3 text-xs transition-all",
          !allSelected && "border-none opacity-50 hover:opacity-80 bg-transparent text-muted-foreground font-normal"
        )}
        onClick={onSelectAll}
      >
        All
      </Badge>

      {/* Individual class chips */}
      {LAND_COVER_CLASSES.map((cls) => {
        const isSelected = selectedClasses.has(cls.id)
        return (
          <Badge
            key={cls.id}
            variant={isSelected ? "default" : "outline"}
            className={cn(
              "cursor-pointer select-none h-7 px-3 text-xs gap-1.5 transition-all border-none",
              isSelected
                ? "shadow-sm font-semibold"
                : "opacity-50 hover:opacity-80 bg-transparent text-muted-foreground font-normal"
            )}
            style={
              isSelected
                ? {
                    backgroundColor: `${cls.color}25`,
                    color: cls.color,
                  }
                : undefined
            }
            onClick={() => onToggleClass(cls.id)}
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: cls.color }}
            />
            {cls.label}
          </Badge>
        )
      })}
    </div>
  )
}
