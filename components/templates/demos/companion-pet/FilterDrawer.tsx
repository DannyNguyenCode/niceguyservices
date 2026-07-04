"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { CP_FILTER_GROUPS } from "./companionPetData";

export type ActiveFilters = {
  pet: string[];
  category: string[];
  brand: string[];
  dietary: string[];
  age: string[];
  health: string[];
  deals: boolean;
};

export const EMPTY_FILTERS: ActiveFilters = {
  pet: [],
  category: [],
  brand: [],
  dietary: [],
  age: [],
  health: [],
  deals: false,
};

type FilterDrawerProps = {
  active: ActiveFilters;
  onChange: (filters: ActiveFilters) => void;
  resultCount: number;
};

function toggle(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
}

export function FilterDrawer({ active, onChange, resultCount }: FilterDrawerProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    pet: true,
    category: true,
    brand: false,
    dietary: false,
  });

  const activeCount =
    active.pet.length +
    active.category.length +
    active.brand.length +
    active.dietary.length +
    active.age.length +
    active.health.length +
    (active.deals ? 1 : 0);

  const clearAll = useCallback(() => onChange({ ...EMPTY_FILTERS }), [onChange]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const filterGroups = [
    ["pet", "Pet", CP_FILTER_GROUPS.pet],
    ["category", "Category", CP_FILTER_GROUPS.category],
    ["brand", "Brand", CP_FILTER_GROUPS.brand],
    ["dietary", "Dietary", CP_FILTER_GROUPS.dietary],
    ["age", "Age", CP_FILTER_GROUPS.age],
    ["health", "Health", CP_FILTER_GROUPS.health],
  ] as const;

  const panel = (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[var(--cp-charcoal)]">Filters</p>
        {activeCount > 0 ? (
          <button type="button" onClick={clearAll} className="text-xs font-medium text-[var(--cp-blue)]">
            Clear all ({resultCount} results)
          </button>
        ) : null}
      </div>

      {filterGroups.map(([key, label, options]) => (
        <div key={key} className="cp-card rounded-xl p-3">
          <button
            type="button"
            className="flex w-full items-center justify-between text-left text-sm font-medium text-[var(--cp-charcoal)]"
            onClick={() => setExpanded((e) => ({ ...e, [key]: !e[key] }))}
          >
            {label}
            <span className="material-symbols-outlined text-base text-[var(--cp-slate)]">
              {expanded[key] ? "expand_less" : "expand_more"}
            </span>
          </button>
          {expanded[key] ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {options.map((opt) => {
                const selected = (active[key] as string[]).includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => onChange({ ...active, [key]: toggle(active[key] as string[], opt) })}
                    className={`cp-chip rounded-full border px-3 py-1 text-xs capitalize ${
                      selected
                        ? "cp-chip-active"
                        : "border-[var(--cp-border)] bg-white text-[var(--cp-slate)]"
                    }`}
                  >
                    {String(opt).replace("-", " ")}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      ))}

      <label className="cp-card flex cursor-pointer items-center gap-3 rounded-xl p-3">
        <input
          type="checkbox"
          checked={active.deals}
          onChange={(e) => onChange({ ...active, deals: e.target.checked })}
          className="h-4 w-4 accent-[var(--cp-orange)]"
        />
        <span className="text-sm text-[var(--cp-charcoal)]">Deals only</span>
      </label>
    </div>
  );

  const chips = [
    ...active.pet,
    ...active.category,
    ...active.brand,
    ...active.dietary,
    ...active.age,
    ...active.health,
    ...(active.deals ? ["deals"] : []),
  ];

  return (
    <>
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-36 max-h-[calc(100dvh-10rem)] overflow-y-auto pr-2">{panel}</div>
      </aside>

      <div className="lg:hidden">
        <div className="sticky top-[7.5rem] z-30 -mx-4 border-b border-[var(--cp-border)] bg-[var(--cp-white)]/95 px-4 py-3 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--cp-border)] px-4 py-2 text-sm font-medium"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden />
              Filters
              {activeCount > 0 ? (
                <span className="rounded-full bg-[var(--cp-charcoal)] px-2 py-0.5 text-xs text-white">
                  {activeCount}
                </span>
              ) : null}
            </button>
            <p className="text-sm text-[var(--cp-slate)]">{resultCount} products</p>
          </div>
          {chips.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {chips.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-[var(--cp-blue-muted)] px-2.5 py-0.5 text-xs capitalize text-[var(--cp-blue)]"
                >
                  {c.replace("-", " ")}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <AnimatePresence>
          {mobileOpen ? (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/30"
                onClick={() => setMobileOpen(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 320 }}
                className="fixed inset-y-0 left-0 z-50 w-[min(100%,20rem)] overflow-y-auto bg-[var(--cp-white)] p-4 shadow-xl"
              >
                <div className="mb-4 flex items-center justify-between">
                  <p className="font-semibold">Filters</p>
                  <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close filters">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                {panel}
              </motion.div>
            </>
          ) : null}
        </AnimatePresence>
      </div>
    </>
  );
}
