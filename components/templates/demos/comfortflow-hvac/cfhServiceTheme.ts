import type { CfhServiceSlug } from "./comfortflowHvacConfig";

export type CfhMapFocus = CfhServiceSlug | "overview";

export type CfhServiceAccentKey =
  | "indigo"
  | "heating"
  | "cooling"
  | "air"
  | "water"
  | "comfort"
  | "thermostat"
  | "default";

export type CfhMapFocusBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type CfhServiceTheme = {
  slug: CfhMapFocus;
  accentKey: CfhServiceAccentKey;
  accent: string;
  accentMuted: string;
  label: string;
  mapFocus: CfhMapFocusBox;
  /** SVG node ids to emphasize when this system is active */
  nodeIds: readonly string[];
};

const MAP_W = 900;
const MAP_H = 640;

export const CFH_MAP_SIZE = { width: MAP_W, height: MAP_H } as const;

export const CFH_SERVICE_THEMES: Record<CfhMapFocus, CfhServiceTheme> = {
  overview: {
    slug: "overview",
    accentKey: "default",
    accent: "var(--cfh-secondary)",
    accentMuted: "color-mix(in srgb, var(--cfh-secondary) 18%, transparent)",
    label: "Full Home Network",
    mapFocus: { x: 0, y: 0, width: MAP_W, height: MAP_H },
    nodeIds: [
      "cfh-node-furnace",
      "cfh-node-ac",
      "cfh-node-water-heater",
      "cfh-node-filter",
      "cfh-node-humidifier",
      "cfh-node-thermostat",
      "cfh-node-vents",
      "cfh-node-ducts",
    ],
  },
  "maintenance-plans": {
    slug: "maintenance-plans",
    accentKey: "indigo",
    accent: "var(--cfh-brand-indigo)",
    accentMuted: "color-mix(in srgb, var(--cfh-brand-indigo) 20%, transparent)",
    label: "Maintenance, Ducts & Vents",
    mapFocus: { x: 24, y: 48, width: 852, height: 560 },
    nodeIds: [
      "cfh-node-furnace",
      "cfh-node-ac",
      "cfh-node-water-heater",
      "cfh-node-filter",
      "cfh-node-humidifier",
      "cfh-node-thermostat",
      "cfh-node-vents",
      "cfh-node-ducts",
    ],
  },
  heating: {
    slug: "heating",
    accentKey: "heating",
    accent: "var(--cfh-heating-accent)",
    accentMuted: "color-mix(in srgb, var(--cfh-heating-accent) 22%, transparent)",
    label: "Furnace & Heating Loop",
    mapFocus: { x: 16, y: 300, width: 380, height: 328 },
    nodeIds: ["cfh-node-furnace", "cfh-node-ducts", "cfh-node-vents"],
  },
  cooling: {
    slug: "cooling",
    accentKey: "cooling",
    accent: "var(--cfh-cooling-accent)",
    accentMuted: "color-mix(in srgb, var(--cfh-cooling-accent) 22%, transparent)",
    label: "Cooling & Refrigerant Loop",
    mapFocus: { x: 468, y: 24, width: 412, height: 360 },
    nodeIds: ["cfh-node-ac", "cfh-node-ducts", "cfh-node-vents"],
  },
  "air-quality": {
    slug: "air-quality",
    accentKey: "air",
    accent: "var(--cfh-air-quality-accent)",
    accentMuted: "color-mix(in srgb, var(--cfh-air-quality-accent) 22%, transparent)",
    label: "Filtration & Air Quality",
    mapFocus: { x: 120, y: 72, width: 520, height: 420 },
    nodeIds: ["cfh-node-filter", "cfh-node-humidifier", "cfh-node-vents", "cfh-node-ducts"],
  },
  "water-heaters": {
    slug: "water-heaters",
    accentKey: "water",
    accent: "var(--cfh-water-accent)",
    accentMuted: "color-mix(in srgb, var(--cfh-water-accent) 22%, transparent)",
    label: "Hot Water Network",
    mapFocus: { x: 520, y: 332, width: 360, height: 296 },
    nodeIds: ["cfh-node-water-heater", "cfh-node-pipes"],
  },
  "smart-thermostats": {
    slug: "smart-thermostats",
    accentKey: "thermostat",
    accent: "#FACC15",
    accentMuted: "color-mix(in srgb, #FACC15 22%, transparent)",
    label: "Smart Thermostats",
    mapFocus: { x: 420, y: 320, width: 200, height: 120 },
    nodeIds: ["cfh-node-thermostat"],
  },
};

export function cfhThemeForAccent(accent: string): CfhServiceTheme {
  switch (accent) {
    case "indigo":
      return CFH_SERVICE_THEMES["maintenance-plans"];
    case "heating":
      return CFH_SERVICE_THEMES.heating;
    case "cooling":
      return CFH_SERVICE_THEMES.cooling;
    case "air":
      return CFH_SERVICE_THEMES["air-quality"];
    case "water":
      return CFH_SERVICE_THEMES["water-heaters"];
    case "thermostat":
    case "default":
      return CFH_SERVICE_THEMES["smart-thermostats"];
    default:
      return CFH_SERVICE_THEMES.overview;
  }
}

export function cfhThemeForSlug(slug: string): CfhServiceTheme {
  if (slug in CFH_SERVICE_THEMES) {
    return CFH_SERVICE_THEMES[slug as CfhMapFocus];
  }
  return CFH_SERVICE_THEMES.overview;
}

export function cfhMapViewBox(focus: CfhMapFocusBox): string {
  return `${focus.x} ${focus.y} ${focus.width} ${focus.height}`;
}
