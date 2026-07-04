export const LUMINA_BASE = "/template/demo/lumina-landscapes" as const;

export const LUMINA_SECTIONS = {
  hero: "hero",
  studio: "studio",
  process: "process",
  materials: "materials",
  experiences: "experiences",
  transformations: "transformations",
  consultation: "consultation",
} as const;

export type LuminaSectionId = (typeof LUMINA_SECTIONS)[keyof typeof LUMINA_SECTIONS];

export const LUMINA_NAV_ITEMS = [
  { id: LUMINA_SECTIONS.studio, label: "Studio" },
  { id: LUMINA_SECTIONS.process, label: "Process" },
  { id: LUMINA_SECTIONS.materials, label: "Materials" },
  { id: LUMINA_SECTIONS.experiences, label: "Experiences" },
  { id: LUMINA_SECTIONS.transformations, label: "Work" },
  { id: LUMINA_SECTIONS.consultation, label: "Consult" },
] as const;

export function luminaSectionHref(id: LuminaSectionId): string {
  return `${LUMINA_BASE}#${id}`;
}
