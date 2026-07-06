"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Calendar,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  Star,
  BarChart3,
  Leaf,
  ShieldHalf,
  Home as HomeIcon,
} from "lucide-react";
import { CFH_PATHS, cfhPath } from "../comfortflowHvacConfig";
import { CFH_HOME_PALETTE as P } from "../home/cfhHomeData";
import { SYSTEMS, systemIdToServicePath, type SystemId } from "./systems";
import { HouseIllustration } from "./house-illustration";

export function ComfortHero() {
  const [selected, setSelected] = useState<SystemId>("cooling");
  const [hovered, setHovered] = useState<SystemId | null>(null);
  const active = hovered ?? selected;

  return (
    <section className="relative w-full overflow-hidden" style={{ backgroundColor: P.offWhite }}>
      <div className="w-full px-[clamp(1rem,8vw,10rem)] pb-12 pt-6 sm:pb-14 md:pt-8 lg:pb-16">
        <div className="grid grid-cols-1 gap-8 md:gap-10 lg:grid-cols-[minmax(0,3.75fr)_minmax(0,8.25fr)] lg:items-start lg:gap-10 xl:gap-12">
          {/* LEFT — copy */}
          <div className="min-w-0">
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] sm:mb-5"
              style={{
                borderColor: P.borderGray,
                backgroundColor: P.lightGray,
                color: P.charcoal,
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: P.cooling }} />
              Toronto Home Comfort Specialists
            </div>
            <h1
              className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[1.05] tracking-tight"
              style={{ color: P.charcoal }}
            >
              Every System In Your Home,
              <span
                className="mt-1 block bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(to right, ${P.cooling}, #00668a)` }}
              >
                Working Together
              </span>
            </h1>
            <p
              className="mt-4 max-w-full text-[0.9rem] leading-relaxed sm:mt-5 sm:text-[0.95rem] lg:max-w-[36ch]"
              style={{ color: `color-mix(in srgb, ${P.charcoal} 72%, ${P.white})` }}
            >
              Heating, cooling, water heating, air quality, ductwork, thermostats,
              and maintenance — connected through one smarter comfort network.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:flex-wrap">
              <Link
                href={cfhPath("/contact")}
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold shadow-[0_14px_34px_-14px_#38bdf8b3] transition-transform hover:-translate-y-0.5 sm:w-auto"
                style={{ backgroundColor: P.cooling, color: P.white }}
              >
                <Calendar className="h-4 w-4 shrink-0" />
                Book Service
              </Link>
              <Link
                href={CFH_PATHS.cooling}
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border px-5 text-sm font-semibold transition-colors hover:bg-[#F5F7FA] sm:w-auto"
                style={{ borderColor: P.borderGray, backgroundColor: P.white, color: P.charcoal }}
              >
                <ArrowUpRight className="h-4 w-4 shrink-0 -rotate-45 transition-transform group-hover:translate-x-0.5" />
                Explore Services
              </Link>
            </div>

            <div
              className="mt-6 grid grid-cols-1 gap-4 border-t pt-6 sm:grid-cols-2 sm:gap-5 lg:grid-cols-1"
              style={{ borderColor: P.borderGray }}
            >
              <TrustBadge icon={ShieldCheck} title="Licensed Technicians" sub="Trusted. Certified. Local." />
              <TrustBadge icon={Clock} title="Same-Day Availability" sub="Fast service when you need it most." />
              <TrustBadge icon={Star} title="Maintenance Plans" sub="Protect your systems. Save every year." />
            </div>
          </div>

          {/* RIGHT — illustration, status, and system pills */}
          <div className="relative min-w-0">
            <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-start md:gap-5 lg:grid lg:grid-cols-8 lg:gap-8">
              <div className="min-w-0 md:flex-1 lg:col-span-6">
                <div className="relative">
                  <HouseIllustration
                    active={active}
                    onHoverSystem={setHovered}
                    onSelectSystem={setSelected}
                  />
                </div>
              </div>

              <div className="w-full shrink-0 md:w-[11.5rem] lg:col-span-2 lg:w-auto">
                <SystemStatusPanel active={active} onHover={setHovered} />
              </div>
            </div>

            <div className="relative z-10 mt-6 md:mt-8 lg:mt-4">
              <p className="mb-4 text-center text-sm text-muted-foreground sm:mb-5 lg:text-left">
                Explore your home comfort systems. Hover the diagram or open a service below.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 lg:justify-start">
                {SYSTEMS.map((s) => {
                  const isActive = active === s.id;
                  const Icon = s.icon;
                  return (
                    <Link
                      key={s.id}
                      href={systemIdToServicePath(s.id)}
                      onMouseEnter={() => setHovered(s.id)}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => setHovered(s.id)}
                      onBlur={() => setHovered(null)}
                      className="group inline-flex h-10 items-center gap-2 rounded-full border bg-card px-4 text-xs font-semibold transition-all sm:h-11 sm:px-5 sm:text-sm"
                      style={{
                        borderColor: isActive ? s.color : "var(--color-border)",
                        boxShadow: isActive
                          ? `0 10px 24px -12px ${s.color}, inset 0 0 0 1px ${s.color}`
                          : "0 1px 2px oklch(0.2 0 0 / 0.04)",
                        color: isActive ? s.color : "var(--color-foreground)",
                        background: isActive ? s.softBg : "var(--color-card)",
                      }}
                    >
                      <Icon className="h-4 w-4 shrink-0" style={{ color: s.color }} />
                      {s.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Benefits row */}
        <div
          className="mt-8 rounded-2xl border p-4 backdrop-blur-sm sm:mt-10 sm:p-6"
          style={{ borderColor: P.borderGray, backgroundColor: `color-mix(in srgb, ${P.white} 70%, transparent)` }}
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Benefit
              icon={BarChart3}
              tone={P.cooling}
              title="Energy Efficient"
              desc="Lower bills with high-efficiency systems and smart solutions."
            />
            <Benefit
              icon={Leaf}
              tone={P.airQuality}
              title="Cleaner Air"
              desc="Breathe easier with advanced filtration and humidity control."
            />
            <Benefit
              icon={ShieldHalf}
              tone={P.heating}
              title="Total Comfort"
              desc="Balanced temperature, humidity, and air quality all year long."
            />
            <Benefit
              icon={HomeIcon}
              tone="#00668a"
              title="One Connected System"
              desc="All your home systems working together, seamlessly."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBadge({
  icon: Icon, title, sub,
}: { icon: typeof ShieldCheck; title: string; sub: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0" style={{ color: P.cooling }} />
      <div>
        <div className="text-[0.78rem] font-semibold leading-tight" style={{ color: P.charcoal }}>
          {title}
        </div>
        <div
          className="mt-0.5 text-[0.7rem] leading-snug"
          style={{ color: `color-mix(in srgb, ${P.charcoal} 65%, ${P.white})` }}
        >
          {sub}
        </div>
      </div>
    </div>
  );
}

function Benefit({
  icon: Icon, tone, title, desc,
}: { icon: typeof BarChart3; tone: string; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-4">
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
        style={{ background: `color-mix(in oklab, ${tone} 12%, transparent)`, color: tone }}
      >
        <Icon className="h-5 w-5 shrink-0" />
      </div>
      <div>
        <div className="text-[0.95rem] font-semibold" style={{ color: P.charcoal }}>
          {title}
        </div>
        <div
          className="mt-1 text-[0.82rem] leading-relaxed"
          style={{ color: `color-mix(in srgb, ${P.charcoal} 65%, ${P.white})` }}
        >
          {desc}
        </div>
      </div>
    </div>
  );
}

function SystemStatusPanel({
  active, onHover,
}: {
  active: SystemId;
  onHover: (s: SystemId | null) => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 shadow-[0_20px_50px_-24px_oklch(0.3_0.05_260/0.35)] lg:p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">
          System Status
        </div>
        <div className="flex shrink-0 items-center gap-1 rounded-full bg-[oklch(0.95_0.05_155)] px-1.5 py-0.5 text-[0.6rem] font-semibold text-[oklch(0.55_0.16_155)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.6_0.16_155)]" />
          LIVE
        </div>
      </div>
      <ul className="space-y-1">
        {SYSTEMS.map((s) => {
          const isActive = active === s.id;
          const Icon = s.icon;
          return (
                <li key={s.id}>
              <button
                type="button"
                onMouseEnter={() => onHover(s.id)}
                onMouseLeave={() => onHover(null)}
                onFocus={() => onHover(s.id)}
                onBlur={() => onHover(null)}
                aria-pressed={isActive}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition-all"
                style={{
                  background: isActive ? s.softBg : "transparent",
                  boxShadow: isActive ? `inset 0 0 0 1px ${s.softRing}` : undefined,
                }}
              >
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                  style={{
                    background: isActive
                      ? `color-mix(in oklab, ${s.color} 18%, transparent)`
                      : "var(--color-muted)",
                    color: s.color,
                  }}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className="block truncate text-[0.78rem] font-semibold leading-tight"
                    style={{ color: isActive ? s.color : "var(--color-foreground)" }}
                  >
                    {s.label}
                  </span>
                  <span
                    className="text-[0.62rem] font-bold uppercase tracking-wide"
                    style={{ color: isActive ? s.color : "oklch(0.6 0.02 260)" }}
                  >
                    {isActive ? "Active" : "Idle"}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}