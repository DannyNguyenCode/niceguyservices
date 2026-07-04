"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { SC_IMG } from "@/components/templates/demos/starlight-command/starlightImages";

type Filter = "ALL" | "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL";

const PROJECTS = [
  {
    id: "lv",
    title: "Liberty Village Panel",
    sector: "RESIDENTIAL" as const,
    tags: ["LV_SECTOR_04", "UPGRADE_PROTOCOL"],
    icon: "settings_input_component" as const,
    load: "LOAD_CAPACITY: 200A",
    status: "STATUS: STABLE",
    bar: "2/3",
    before: SC_IMG.workLibertyBefore,
    after: SC_IMG.workLibertyAfter,
  },
  {
    id: "wf",
    title: "Waterfront Retail",
    sector: "COMMERCIAL" as const,
    tags: ["WF_DOCK_12", "RETAIL_GRID_DEPLOY"],
    icon: "construction" as const,
    load: "GRID_SYNC: 100%",
    status: "STATUS: ONLINE",
    bar: "full",
    before: SC_IMG.workWaterfrontBefore,
    after: SC_IMG.workWaterfrontAfter,
  },
  {
    id: "et",
    title: "Industrial MCC",
    sector: "INDUSTRIAL" as const,
    tags: ["ET_WEST_9", "HEAVY_MOTOR_CNTRL"],
    icon: "bolt" as const,
    load: "PHASE_ALIGN: CALIBRATING",
    status: "STATUS: PARTIAL",
    bar: "1/4",
    before: SC_IMG.workIndustrialBefore,
    after: SC_IMG.workIndustrialAfter,
  },
  {
    id: "jn",
    title: "Junction Restoration",
    sector: "RESIDENTIAL" as const,
    tags: ["JN_BLOCK_A", "HERITAGE_REWIRING"],
    icon: "home" as const,
    load: "CODE_CERT: 100%",
    status: "STATUS: SECURE",
    bar: "full",
    before: SC_IMG.workJunctionBefore,
    after: SC_IMG.workJunctionAfter,
  },
] as const;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "ALL", label: "ALL_UNITS" },
  { key: "RESIDENTIAL", label: "RESIDENTIAL" },
  { key: "COMMERCIAL", label: "COMMERCIAL" },
  { key: "INDUSTRIAL", label: "INDUSTRIAL" },
];

export function StarlightWorkBody() {
  const [filter, setFilter] = useState<Filter>("ALL");

  const visible = useMemo(() => {
    if (filter === "ALL") {
      return PROJECTS;
    }
    return PROJECTS.filter((p) => p.sector === filter);
  }, [filter]);

  return (
    <main className="relative overflow-x-hidden pb-28 pt-4 sm:pt-6 md:pb-16 md:pt-10">
      <div className="pointer-events-none fixed inset-0 opacity-10">
        <div className="mx-auto h-full max-w-7xl border-x-4 border-[#594238]" />
      </div>

      <section className="relative mx-auto max-w-7xl px-4 pb-6 sm:px-6 md:px-12 lg:px-16">
        <div className="flex flex-col justify-between gap-4 border-l-4 border-[#ee671c] pl-4 sm:pl-6 md:flex-row md:items-end md:gap-6">
          <div className="min-w-0">
            <span className="mb-2 block font-['var(--font-sc-display),ui-sans-serif] text-xs font-semibold uppercase tracking-[0.15em] text-[#ffb595] sm:text-sm sm:tracking-[0.2em]">
              Current Operations
            </span>
            <h1 className="font-['var(--font-sc-display),ui-sans-serif] text-3xl font-bold uppercase leading-[1.05] text-[#e5e2e1] sm:text-5xl md:text-6xl">
              Stage Select
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const on = filter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  className={
                    on
                      ? "sc-glow-amber min-h-11 rounded-none bg-[#ee671c] px-3 py-2.5 font-['var(--font-sc-display),ui-sans-serif] text-[10px] font-bold uppercase tracking-wider text-[#351000] transition-transform active:scale-95 sm:px-6 sm:text-sm sm:tracking-widest"
                      : "min-h-11 rounded-none border-2 border-[#594238] bg-[#20201f] px-3 py-2.5 font-['var(--font-sc-display),ui-sans-serif] text-[10px] font-bold uppercase tracking-wider text-[#e0c0b2] transition-all hover:border-[#ee671c] sm:px-6 sm:text-sm sm:tracking-widest"
                  }
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-8 sm:gap-8 sm:px-6 sm:py-10 md:px-12 lg:grid-cols-2 lg:px-16">
        {visible.map((p) => (
          <article key={p.id} className="sc-stage-card group relative overflow-hidden border-4 border-[#594238] bg-[#20201f] transition-all duration-300">
            <div className="absolute left-0 top-0 z-10 h-1 w-full bg-[#ee671c] shadow-[0_0_10px_#ee671c]" />
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="group/image relative overflow-hidden border-b-2 border-[#594238] md:border-b-0 md:border-r-2">
                <div className="relative h-64 w-full md:h-full md:min-h-64">
                  <Image
                    src={p.before}
                    alt={`${p.title} — before (demo)`}
                    fill
                    className="object-cover grayscale opacity-60 transition-all duration-500 group-hover/image:opacity-100 group-hover/image:grayscale-0"
                    sizes="(max-width:768px) 100vw, 50vw"
                  />
                </div>
                <div className="absolute left-4 top-4 border border-[#ffb595] bg-[#131313]/80 px-2 py-1 font-['var(--font-sc-display),ui-sans-serif] text-[10px] font-bold uppercase tracking-widest text-[#ffb595]">
                  PRE_OP
                </div>
              </div>
              <div className="group/image relative overflow-hidden">
                <div className="relative h-64 w-full md:h-full md:min-h-64">
                  <Image
                    src={p.after}
                    alt={`${p.title} — after (demo)`}
                    fill
                    className="object-cover transition-all duration-500 group-hover/image:brightness-110"
                    sizes="(max-width:768px) 100vw, 50vw"
                  />
                </div>
                <div className="absolute right-4 top-4 border border-[#351000] bg-[#ee671c] px-2 py-1 font-['var(--font-sc-display),ui-sans-serif] text-[10px] font-bold uppercase tracking-widest text-[#351000]">
                  ACTIVE
                </div>
              </div>
            </div>
            <div className="relative bg-[#2a2a2a] p-4 sm:p-6">
              <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <h2 className="mb-1 wrap-break-word font-['var(--font-sc-display),ui-sans-serif] text-lg font-semibold uppercase text-[#e5e2e1] sm:text-xl md:text-2xl">
                    {p.title}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-[#353535] px-2 py-1 font-['var(--font-sc-display),ui-sans-serif] text-[10px] font-bold uppercase tracking-tighter text-[#e0c0b2]">
                      {p.tags[0]}
                    </span>
                    <span className="border border-[#ffb595]/30 bg-[#ee671c]/20 px-2 py-1 font-['var(--font-sc-display),ui-sans-serif] text-[10px] font-bold uppercase tracking-tighter text-[#ffb595]">
                      {p.tags[1]}
                    </span>
                  </div>
                </div>
                <div className="sc-glow-amber flex h-11 w-11 shrink-0 items-center justify-center self-start border-2 border-[#ffb595] text-[#ffb595] sm:h-12 sm:w-12">
                  <span className="material-symbols-outlined">{p.icon}</span>
                </div>
              </div>
              <div className="mb-4 h-1 w-full bg-[#594238]">
                <div
                  className={`h-full bg-[#ee671c] shadow-[0_0_8px_#ee671c] ${p.bar === "2/3" ? "w-2/3" : p.bar === "1/4" ? "w-1/4" : "w-full"}`}
                />
              </div>
              <div className="flex flex-col gap-2 font-['var(--font-sc-display),ui-sans-serif] text-[10px] font-bold uppercase tracking-wider text-[#e0c0b2] sm:flex-row sm:items-center sm:justify-between sm:text-[11px] sm:tracking-widest">
                <span className="break-all sm:break-normal">{p.load}</span>
                <span className="shrink-0">{p.status}</span>
              </div>
            </div>
          </article>
        ))}
      </section>

      <div className="flex flex-col items-center gap-1 py-12 opacity-40">
        <div className="h-2 w-16 bg-[#594238]" />
        <div className="h-2 w-16 bg-[#594238]" />
        <div className="h-2 w-16 bg-[#594238]" />
        <div className="flex h-4 w-32 items-center justify-center border-2 border-[#594238]">
          <span className="text-[8px] font-bold uppercase tracking-[0.5em] text-[#e0c0b2]">SCROLL_FOR_ARCHIVE</span>
        </div>
        <div className="h-2 w-16 bg-[#594238]" />
        <div className="h-2 w-16 bg-[#594238]" />
        <div className="h-2 w-16 bg-[#594238]" />
      </div>
    </main>
  );
}
