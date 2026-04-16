"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Search, MapPin, X } from "lucide-react";
import { BAGUIO_BARANGAYS } from "@/lib/barangay-list";
import { useBarangayStore } from "@/app/(main)/map/_stores/barangayStore";
import { useRouter, usePathname } from "next/navigation";

export function BarangaySearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const { setSelectedBarangay } = useBarangayStore();
  const router = useRouter();
  const pathname = usePathname();

  // Filter barangays based on query
  const filteredBarangays = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return BAGUIO_BARANGAYS.filter((b) => b.toLowerCase().includes(q));
  }, [query]);

  // Reset highlighted index when results change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredBarangays.length]);

  // Scroll highlighted item into view
  useEffect(() => {
    itemRefs.current[highlightedIndex]?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (barangay: string) => {
    setSelectedBarangay(barangay);
    setQuery("");
    setIsOpen(false);
    inputRef.current?.blur();

    // Navigate to map if not already there
    if (!pathname.startsWith("/map")) {
      router.push("/map");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredBarangays.length === 0) {
      if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredBarangays.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredBarangays.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        handleSelect(filteredBarangays[highlightedIndex]);
        break;
      case "Escape":
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(e.target.value.trim().length > 0);
  };

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Highlight matching text
  const highlightMatch = (text: string, q: string) => {
    if (!q.trim()) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span className="text-primary font-semibold">
          {text.slice(idx, idx + q.length)}
        </span>
        {text.slice(idx + q.length)}
      </>
    );
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.trim() && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search barangay..."
          className="pl-10 pr-9 py-2 bg-muted/50 dark:bg-black/30 border border-border rounded-lg text-sm w-52 xl:w-64 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          autoComplete="off"
          id="barangay-search-input"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && filteredBarangays.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-full mt-1.5 w-72 max-h-64 overflow-y-auto bg-card border border-border rounded-xl shadow-2xl z-50 py-1 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            {filteredBarangays.length} result{filteredBarangays.length !== 1 ? "s" : ""}
          </div>
          {filteredBarangays.map((barangay, idx) => (
            <button
              key={barangay}
              ref={(el) => { itemRefs.current[idx] = el; }}
              onClick={() => handleSelect(barangay)}
              onMouseEnter={() => setHighlightedIndex(idx)}
              className={`w-full text-left px-3 py-2 flex items-center gap-2.5 text-sm transition-colors ${
                idx === highlightedIndex
                  ? "bg-primary/10 text-foreground"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
              id={`search-result-${idx}`}
            >
              <MapPin className={`h-3.5 w-3.5 shrink-0 ${idx === highlightedIndex ? "text-primary" : "text-muted-foreground"}`} />
              <span className="truncate">{highlightMatch(barangay, query)}</span>
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {isOpen && query.trim() && filteredBarangays.length === 0 && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-full mt-1.5 w-72 bg-card border border-border rounded-xl shadow-2xl z-50 py-4 px-3 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <p className="text-sm text-muted-foreground text-center">
            No barangay found for &quot;{query}&quot;
          </p>
        </div>
      )}
    </div>
  );
}
