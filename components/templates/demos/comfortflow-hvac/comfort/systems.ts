import type { LucideIcon } from "lucide-react";
import { Snowflake, Flame, Droplets, Leaf, Thermometer, Wrench } from "lucide-react";
import { CFH_HOME_PALETTE as P } from "../home/cfhHomeData";

import type { CfhServiceSlug } from "../comfortflowHvacConfig";
import { cfhServicePath } from "../comfortflowHvacConfig";

export type SystemId =
  | "cooling"
  | "heating"
  | "water"
  | "air"
  | "thermostat"
  | "maintenance";

export interface SystemDef {
  id: SystemId;
  label: string;
  icon: LucideIcon;
  /** Accent color for glows, dots, and active pill */
  color: string;
  softBg: string;
  softRing: string;
}

export const SYSTEMS: SystemDef[] = [
  {
    id: "cooling",
    label: "Cooling",
    icon: Snowflake,
    color: P.cooling,
    softBg: `${P.cooling}18`,
    softRing: `${P.cooling}59`,
  },
  {
    id: "heating",
    label: "Heating",
    icon: Flame,
    color: P.heating,
    softBg: `${P.heating}18`,
    softRing: `${P.heating}59`,
  },
  {
    id: "water",
    label: "Water Heaters",
    icon: Droplets,
    color: P.water,
    softBg: `${P.water}18`,
    softRing: `${P.water}59`,
  },
  {
    id: "air",
    label: "Air Quality",
    icon: Leaf,
    color: P.airQuality,
    softBg: `${P.airQuality}18`,
    softRing: `${P.airQuality}59`,
  },
  {
    id: "thermostat",
    label: "Thermostats",
    icon: Thermometer,
    color: P.thermostats,
    softBg: `${P.thermostats}22`,
    softRing: `${P.thermostats}66`,
  },
  {
    id: "maintenance",
    label: "Maintenance",
    icon: Wrench,
    color: P.maintenance,
    softBg: `${P.maintenance}18`,
    softRing: `${P.maintenance}59`,
  },
];

export const SYSTEM_MAP: Record<SystemId, SystemDef> = SYSTEMS.reduce(
  (acc, s) => {
    acc[s.id] = s;
    return acc;
  },
  {} as Record<SystemId, SystemDef>,
);

const SERVICE_SLUG_TO_SYSTEM: Record<CfhServiceSlug, SystemId> = {
  "maintenance-plans": "maintenance",
  heating: "heating",
  cooling: "cooling",
  "air-quality": "air",
  "water-heaters": "water",
  "smart-thermostats": "thermostat",
};

const SYSTEM_TO_SERVICE_SLUG: Record<SystemId, CfhServiceSlug> = {
  cooling: "cooling",
  heating: "heating",
  water: "water-heaters",
  air: "air-quality",
  thermostat: "smart-thermostats",
  maintenance: "maintenance-plans",
};

export function systemIdToServicePath(id: SystemId): string {
  return cfhServicePath(SYSTEM_TO_SERVICE_SLUG[id]);
}

export function serviceSlugToSystemId(slug: string): SystemId {
  if (slug in SERVICE_SLUG_TO_SYSTEM) {
    return SERVICE_SLUG_TO_SYSTEM[slug as CfhServiceSlug];
  }
  return "cooling";
}
