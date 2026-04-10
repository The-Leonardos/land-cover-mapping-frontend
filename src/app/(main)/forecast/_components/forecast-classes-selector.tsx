import { LAND_COVER_CLASSES } from "@/lib/types/land-cover-class"

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
  return (
    <div className="mb-4 md:mb-6">
      <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3">
        <span className="text-xs md:text-sm font-medium text-foreground">
          Classes
        </span>
        <label className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={selectedClasses.size === LAND_COVER_CLASSES.length}
            onChange={onSelectAll}
            className="w-3.5 h-3.5 md:w-4 md:h-4 rounded border-border accent-primary"
          />
          Select All
        </label>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 md:gap-2">
        {LAND_COVER_CLASSES.map((cls) => (
          <label
            key={cls.id}
            className={`flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-lg border cursor-pointer transition-colors ${
              selectedClasses.has(cls.id)
                ? "bg-muted/50 dark:bg-black/30 border-border"
                : "bg-muted/20 dark:bg-black/10 border-transparent"
            }`}
          >
            <input
              type="checkbox"
              checked={selectedClasses.has(cls.id)}
              onChange={() => onToggleClass(cls.id)}
              className="w-3.5 h-3.5 md:w-4 md:h-4 rounded border-border accent-primary"
            />
            <span
              className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: cls.color }}
            />
            <span className="text-xs md:text-sm text-foreground truncate">
              {cls.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}
