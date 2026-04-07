"use client";

import { useBarangayStore } from "@/app/(main)/map/_stores/barangayStore";

export function TimelineControl() {
  const { currentYear, setCurrentYear, YEARS } = useBarangayStore();

  if (YEARS.length === 0) return null;

  const forecastYear = YEARS[YEARS.length - 1];
  const isForecast = currentYear === forecastYear;

  const pct =
    ((currentYear - YEARS[0]) / (YEARS[YEARS.length - 1] - YEARS[0])) * 100;

  return (
    <div className="flex items-center gap-3 md:gap-5 w-full">
      {/* Slider column */}
      <div className="flex-1 flex flex-col gap-2">
        {/* Track */}
        <div className="relative h-[4px] bg-muted/40 rounded-full">
          {/* Filled portion */}
          <div
            className="absolute left-0 top-0 h-full bg-primary/70 rounded-full transition-all duration-150"
            style={{ width: `${pct}%` }}
          />

          {/* Forecast dashed segment at the end */}
          <div
            className="absolute top-0 h-full border-t-4 border-dashed border-primary/70"
            style={{
              left: `${((forecastYear - 1 - YEARS[0]) / (YEARS[YEARS.length - 1] - YEARS[0])) * 100}%`,
              right: 0,
            }}
          />

          {/* Native range input (invisible, sits on top for interaction) */}
          <input
            type="range"
            min={YEARS[0]}
            max={YEARS[YEARS.length - 1]}
            value={currentYear}
            onChange={(e) => setCurrentYear(Number.parseInt(e.target.value))}
            className="absolute inset-0 w-full opacity-0 cursor-pointer h-5 -translate-y-1/2 top-1/2"
            style={{ zIndex: 10 }}
          />

          {/* Custom thumb dot */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary border-2 border-background shadow-sm transition-all duration-150 pointer-events-none"
            style={{ left: `${pct}%` }}
          />
        </div>

        {/* Year tick marks */}
        <div className="relative flex justify-between px-0 select-none">
          {YEARS.map((year, i) => {
            const isFirst = i === 0;
            const isLast = i === YEARS.length - 1;
            const isCurrent = year === currentYear;
            const isForecastYear = year === forecastYear;

            // On mobile show only first, last, and current
            const showOnMobile = isFirst || isLast || isCurrent;

            return (
              <button
                key={year}
                type="button"
                onClick={() => setCurrentYear(year)}
                className={[
                  "flex flex-col items-center gap-0.5 group transition-all duration-150",
                  !showOnMobile && "hidden sm:flex",
                ].join(" ")}
              >
                {/* Tick */}
                <span
                  className={[
                    "block w-[1px] h- rounded-full transition-colors duration-150",
                    isCurrent
                      ? "bg-primary"
                      : "bg-muted-foreground/30 group-hover:bg-muted-foreground/60",
                  ].join(" ")}
                />
                {/* Year label */}
                <span
                  className={[
                    "text-xs md:text-base font-semibold transition-colors duration-150 leading-none",
                    isForecastYear
                      ? "border-b-2 border-dashed border-primary/70 pb-px"
                      : "",
                    isCurrent
                      ? "font-semibold text-primary"
                      : "text-muted-foreground/60 group-hover:text-muted-foreground",
                  ].join(" ")}
                >
                  {year}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected year display */}
      <div className="flex-shrink-0 text-right min-w-[52px] md:min-w-[64px]">
        <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider leading-none mb-0.5">
          {isForecast ? "Forecast" : "Year"}
        </p>
        <p
          className={[
            "text-2xl md:text-3xl font-bold tabular-nums leading-none transition-colors duration-200",
            isForecast ? "text-primary/70" : "text-foreground",
          ].join(" ")}
        >
          {currentYear}
        </p>
      </div>
    </div>
  );
}
