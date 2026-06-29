"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { SECTION_TYPES } from "@/lib/sections";

type SectionTypeOption = (typeof SECTION_TYPES)[number];

type SectionTypePickerProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SectionTypePicker({ value, onChange }: SectionTypePickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = SECTION_TYPES.find((type) => type.value === value) ?? SECTION_TYPES[0];

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [...SECTION_TYPES];

    return SECTION_TYPES.filter(
      (type) =>
        type.label.toLowerCase().includes(normalized) ||
        type.value.toLowerCase().includes(normalized)
    );
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectType(type: SectionTypeOption) {
    onChange(type.value);
    setOpen(false);
    setQuery("");
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="login-input flex w-full items-center justify-between rounded-xl border border-[var(--form-border)] bg-card px-3 py-2.5 text-left text-sm"
      >
        <span>{selected.label}</span>
        <ChevronDown className={`h-4 w-4 text-muted transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          <div className="border-b border-border p-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search sections..."
                autoFocus
                className="login-input w-full rounded-lg border border-[var(--form-border)] bg-[var(--input-bg)] py-2 pl-9 pr-3 text-sm"
              />
            </div>
          </div>

          <ul className="max-h-64 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-muted">No sections match your search.</li>
            ) : (
              filtered.map((type) => (
                <li key={type.value}>
                  <button
                    type="button"
                    onClick={() => selectType(type)}
                    className={`flex w-full flex-col items-start px-3 py-2 text-left text-sm transition hover:bg-[var(--surface-muted)] ${
                      type.value === value ? "bg-[var(--surface-muted)] text-[var(--orange)]" : ""
                    }`}
                  >
                    <span className="font-medium">{type.label}</span>
                    <span className="text-xs text-muted">{type.value}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
