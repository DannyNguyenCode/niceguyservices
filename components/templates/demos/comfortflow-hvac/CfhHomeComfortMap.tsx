"use client";

import { useId, type CSSProperties } from "react";
import {
  CFH_MAP_SIZE,
  cfhMapViewBox,
  cfhThemeForSlug,
  type CfhMapFocus,
  type CfhServiceTheme,
} from "./cfhServiceTheme";

type CfhHomeComfortMapProps = {
  focus?: CfhMapFocus;
  /** Highlights nodes for a hovered pill on the homepage */
  highlightSystem?: CfhMapFocus | null;
  accentColor?: string;
  className?: string;
  glow?: boolean;
  showLegend?: boolean;
  ariaLabel?: string;
};

function nodeOpacity(nodeId: string, activeIds: Set<string> | null): number {
  if (!activeIds || activeIds.size === 0) return 1;
  return activeIds.has(nodeId) ? 1 : 0.28;
}

function nodeStroke(
  nodeId: string,
  activeIds: Set<string> | null,
  accent: string,
  defaultStroke: string,
): string {
  if (!activeIds || activeIds.size === 0) return defaultStroke;
  return activeIds.has(nodeId) ? accent : defaultStroke;
}

export function CfhHomeComfortMap({
  focus = "overview",
  highlightSystem = null,
  accentColor,
  className = "",
  glow = false,
  showLegend = false,
  ariaLabel = "Home Comfort Network cutaway diagram showing rooms, ducts, vents, furnace, air conditioner, water heater, filter, humidifier, thermostat, and plumbing",
}: CfhHomeComfortMapProps) {
  const uid = useId().replace(/:/g, "");
  const theme = cfhThemeForSlug(focus);
  const accent = accentColor ?? theme.accent;
  const highlightTheme = highlightSystem ? cfhThemeForSlug(highlightSystem) : null;
  const activeIds = highlightTheme ? new Set(highlightTheme.nodeIds) : null;
  const viewBox = cfhMapViewBox(theme.mapFocus);
  const isZoomed = focus !== "overview";

  const wrapStyle: CSSProperties | undefined = glow
    ? {
        filter: `drop-shadow(0 0 28px color-mix(in srgb, ${accent} 45%, transparent))`,
      }
    : undefined;

  const op = (id: string) => nodeOpacity(id, activeIds);
  const stroke = (id: string, fallback: string) => nodeStroke(id, activeIds, accent, fallback);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-[var(--cfh-outline-variant)]/50 bg-[var(--cfh-surface-container-lowest)] ${className}`}
      style={wrapStyle}
    >
      {showLegend ? (
        <div
          className="cfh-label-caps absolute left-4 top-4 z-10 rounded-full px-3 py-1.5 text-[10px] text-[var(--cfh-on-surface-variant)] backdrop-blur-sm"
          style={{ backgroundColor: theme.accentMuted, color: accent }}
        >
          {theme.label}
        </div>
      ) : null}
      <svg
        viewBox={viewBox}
        className={`block h-full w-full transition-[viewBox] duration-700 ease-out ${isZoomed ? "min-h-[280px] md:min-h-[360px]" : "min-h-[340px] md:min-h-[520px]"}`}
        role="img"
        aria-label={ariaLabel}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <pattern id={`${uid}-grid`} width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="rgba(99,102,241,0.12)" />
          </pattern>
          <linearGradient id={`${uid}-wall`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f0edee" />
            <stop offset="100%" stopColor="#e4e2e3" />
          </linearGradient>
          <filter id={`${uid}-glow`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width={CFH_MAP_SIZE.width} height={CFH_MAP_SIZE.height} fill={`url(#${uid}-grid)`} />
        <rect
          x="28"
          y="56"
          width="844"
          height="556"
          rx="12"
          fill={`url(#${uid}-wall)`}
          stroke="#c5c6cc"
          strokeWidth="2"
        />

        {/* Main floor rooms */}
        <g id="cfh-rooms" opacity="0.95">
          <rect x="48" y="88" width="300" height="220" fill="#fbf9fa" stroke="#d1d5db" strokeWidth="1.5" />
          <text x="68" y="112" className="fill-[#75777c] text-[11px] font-bold uppercase tracking-widest">
            Living Room
          </text>
          <rect x="368" y="88" width="180" height="140" fill="#f6f3f4" stroke="#d1d5db" strokeWidth="1.5" />
          <text x="388" y="112" className="fill-[#75777c] text-[11px] font-bold uppercase tracking-widest">
            Kitchen
          </text>
          <rect x="568" y="88" width="284" height="220" fill="#fbf9fa" stroke="#d1d5db" strokeWidth="1.5" />
          <text x="588" y="112" className="fill-[#75777c] text-[11px] font-bold uppercase tracking-widest">
            Bedroom
          </text>
          <rect x="368" y="248" width="180" height="60" fill="#eae7e9" stroke="#d1d5db" strokeWidth="1.5" />
          <text x="388" y="282" className="fill-[#75777c] text-[10px] font-bold uppercase tracking-widest">
            Hallway
          </text>
        </g>

        {/* Basement / utility cutaway */}
        <g id="cfh-basement">
          <rect x="48" y="332" width="804" height="256" fill="#f0edee" stroke="#c5c6cc" strokeWidth="1.5" strokeDasharray="6 4" />
          <text x="68" y="358" className="fill-[#75777c] text-[11px] font-bold uppercase tracking-widest">
            Basement / Utility
          </text>
        </g>

        {/* Duct network */}
        <g id="cfh-node-ducts" opacity={op("cfh-node-ducts")} filter={activeIds?.has("cfh-node-ducts") ? `url(#${uid}-glow)` : undefined}>
          <path
            d="M 120 308 L 120 180 L 520 180 L 520 120 L 760 120"
            fill="none"
            stroke={stroke("cfh-node-ducts", "#94a3b8")}
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.55"
          />
          <path
            d="M 200 308 L 200 248 L 456 248 L 456 180"
            fill="none"
            stroke={stroke("cfh-node-ducts", "#94a3b8")}
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.45"
          />
          <path
            d="M 640 308 L 640 180"
            fill="none"
            stroke={stroke("cfh-node-ducts", "#94a3b8")}
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.45"
          />
          <rect x="108" y="296" width="24" height="24" rx="4" fill={stroke("cfh-node-ducts", "#cbd5e1")} />
        </g>

        {/* Vents */}
        <g id="cfh-node-vents" opacity={op("cfh-node-vents")} filter={activeIds?.has("cfh-node-vents") ? `url(#${uid}-glow)` : undefined}>
          {[
            [180, 168],
            [500, 168],
            [700, 168],
            [420, 268],
          ].map(([x, y]) => (
            <g key={`${x}-${y}`}>
              <rect
                x={x}
                y={y}
                width="36"
                height="12"
                rx="2"
                fill={stroke("cfh-node-vents", "#e2e8f0")}
                stroke={stroke("cfh-node-vents", "#94a3b8")}
                strokeWidth="1.5"
              />
              <line x1={x + 6} y1={y + 4} x2={x + 30} y2={y + 4} stroke={stroke("cfh-node-vents", "#64748b")} strokeWidth="1" />
              <line x1={x + 6} y1={y + 8} x2={x + 30} y2={y + 8} stroke={stroke("cfh-node-vents", "#64748b")} strokeWidth="1" />
            </g>
          ))}
        </g>

        {/* Thermostat */}
        <g id="cfh-node-thermostat" opacity={op("cfh-node-thermostat")} filter={activeIds?.has("cfh-node-thermostat") ? `url(#${uid}-glow)` : undefined}>
          <rect
            x="300"
            y="132"
            width="44"
            height="56"
            rx="8"
            fill={stroke("cfh-node-thermostat", "#ffffff")}
            stroke={stroke("cfh-node-thermostat", accent)}
            strokeWidth="2.5"
          />
          <rect x="312" y="148" width="20" height="8" rx="2" fill={stroke("cfh-node-thermostat", accent)} opacity="0.8" />
          <circle cx="322" cy="172" r="6" fill="none" stroke={stroke("cfh-node-thermostat", "#64748b")} strokeWidth="2" />
          <text x="352" y="166" className="fill-[#44474c] text-[10px] font-semibold">
            Thermostat
          </text>
        </g>

        {/* Furnace */}
        <g id="cfh-node-furnace" opacity={op("cfh-node-furnace")} filter={activeIds?.has("cfh-node-furnace") ? `url(#${uid}-glow)` : undefined}>
          <rect
            x="72"
            y="392"
            width="120"
            height="148"
            rx="8"
            fill={stroke("cfh-node-furnace", "#1f2937")}
            stroke={stroke("cfh-node-furnace", "var(--cfh-heating-accent)")}
            strokeWidth="3"
          />
          <rect x="88" y="412" width="88" height="48" rx="4" fill="#374151" />
          <rect x="96" y="472" width="72" height="16" rx="2" fill={stroke("cfh-node-furnace", "var(--cfh-heating-accent)")} opacity="0.85" />
          <circle cx="132" cy="520" r="8" fill="none" stroke={stroke("cfh-node-furnace", "#fb923c")} strokeWidth="2" />
          <text x="204" y="468" className="fill-[#44474c] text-[11px] font-bold">
            Furnace
          </text>
          <path d="M 192 440 L 220 440 L 220 308 L 132 308" fill="none" stroke={stroke("cfh-node-furnace", "#fb923c")} strokeWidth="3" strokeDasharray="6 4" />
        </g>

        {/* Filter */}
        <g id="cfh-node-filter" opacity={op("cfh-node-filter")} filter={activeIds?.has("cfh-node-filter") ? `url(#${uid}-glow)` : undefined}>
          <rect
            x="220"
            y="416"
            width="56"
            height="88"
            rx="4"
            fill="#ffffff"
            stroke={stroke("cfh-node-filter", "var(--cfh-air-quality-accent)")}
            strokeWidth="2.5"
          />
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1="228"
              y1={428 + i * 14}
              x2="268"
              y2={428 + i * 14}
              stroke={stroke("cfh-node-filter", "#10b981")}
              strokeWidth="2"
            />
          ))}
          <text x="284" y="456" className="fill-[#44474c] text-[10px] font-semibold">
            Filter
          </text>
        </g>

        {/* Humidifier */}
        <g id="cfh-node-humidifier" opacity={op("cfh-node-humidifier")} filter={activeIds?.has("cfh-node-humidifier") ? `url(#${uid}-glow)` : undefined}>
          <rect
            x="296"
            y="424"
            width="64"
            height="72"
            rx="6"
            fill="#e0f2fe"
            stroke={stroke("cfh-node-humidifier", "var(--cfh-air-quality-accent)")}
            strokeWidth="2.5"
          />
          <path
            d="M 312 468 Q 328 452 344 468 Q 328 484 312 468"
            fill="none"
            stroke={stroke("cfh-node-humidifier", "#10b981")}
            strokeWidth="2"
          />
          <text x="368" y="456" className="fill-[#44474c] text-[10px] font-semibold">
            Humidifier
          </text>
        </g>

        {/* AC unit (outdoor pad) */}
        <g id="cfh-node-ac" opacity={op("cfh-node-ac")} filter={activeIds?.has("cfh-node-ac") ? `url(#${uid}-glow)` : undefined}>
          <rect x="688" y="48" width="148" height="96" rx="8" fill="#e2e8f0" stroke={stroke("cfh-node-ac", "var(--cfh-cooling-accent)")} strokeWidth="3" />
          <circle cx="728" cy="96" r="28" fill="none" stroke={stroke("cfh-node-ac", "#38bdf8")} strokeWidth="4" />
          <circle cx="796" cy="96" r="28" fill="none" stroke={stroke("cfh-node-ac", "#38bdf8")} strokeWidth="4" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line
              key={i}
              x1={716 + i * 4}
              y1="72"
              x2={716 + i * 4}
              y2="120"
              stroke={stroke("cfh-node-ac", "#64748b")}
              strokeWidth="1"
            />
          ))}
          <text x="688" y="168" className="fill-[#44474c] text-[11px] font-bold">
            AC Unit
          </text>
          <path
            d="M 688 120 L 640 120 L 640 180"
            fill="none"
            stroke={stroke("cfh-node-ac", "#38bdf8")}
            strokeWidth="3"
            strokeDasharray="5 3"
          />
        </g>

        {/* Water heater + pipes */}
        <g id="cfh-node-water-heater" opacity={op("cfh-node-water-heater")} filter={activeIds?.has("cfh-node-water-heater") ? `url(#${uid}-glow)` : undefined}>
          <rect
            x="600"
            y="400"
            width="96"
            height="140"
            rx="48"
            fill="#cffafe"
            stroke={stroke("cfh-node-water-heater", "var(--cfh-water-accent)")}
            strokeWidth="3"
          />
          <rect x="624" y="420" width="48" height="20" rx="4" fill={stroke("cfh-node-water-heater", "#06b6d4")} opacity="0.7" />
          <text x="708" y="468" className="fill-[#44474c] text-[11px] font-bold">
            Water Heater
          </text>
        </g>

        <g id="cfh-node-pipes" opacity={op("cfh-node-pipes")} filter={activeIds?.has("cfh-node-pipes") ? `url(#${uid}-glow)` : undefined}>
          <path
            d="M 648 400 L 648 320 L 520 320 L 520 248 L 420 248"
            fill="none"
            stroke={stroke("cfh-node-pipes", "var(--cfh-water-accent)")}
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 696 540 L 760 540 L 760 248 L 520 248"
            fill="none"
            stroke={stroke("cfh-node-pipes", "var(--cfh-water-accent)")}
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.7"
          />
          <circle cx="420" cy="248" r="6" fill={stroke("cfh-node-pipes", "#06b6d4")} />
          <circle cx="520" cy="248" r="6" fill={stroke("cfh-node-pipes", "#06b6d4")} />
          <text x="724" y="528" className="fill-[#44474c] text-[10px] font-semibold">
            Hot Water Lines
          </text>
        </g>

        {/* Connection nodes (network pulses) */}
        {focus === "overview" || focus === "maintenance-plans" ? (
          <g opacity="0.65">
            {[
              [132, 460],
              [248, 452],
              [328, 448],
              [648, 468],
              [762, 96],
              [322, 156],
            ].map(([cx, cy]) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5" fill={accent} opacity="0.6" />
            ))}
          </g>
        ) : null}
      </svg>
    </div>
  );
}

export type { CfhServiceTheme };
