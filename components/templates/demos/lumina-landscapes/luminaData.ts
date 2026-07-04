import { LUMINA_IMAGES } from "./luminaImages";

export const LUMINA_PROCESS_STEPS = [
  {
    step: "01",
    title: "Discovery",
    description:
      "We begin with a conversation about how you live outdoors — gathering, dining, quiet mornings, and the atmosphere you want to return to each evening.",
  },
  {
    step: "02",
    title: "Site Study",
    description:
      "Sun paths, drainage, existing architecture, and sightlines are mapped like a field survey — every constraint becomes part of the design language.",
  },
  {
    step: "03",
    title: "Concept Design",
    description:
      "Hand-drawn plans and 3D studies translate your property into a private retreat — zoning outdoor rooms before a single stone is placed.",
  },
  {
    step: "04",
    title: "Material Selection",
    description:
      "Stone, timber, planting palettes, and lighting specs are curated from our material library — each sample chosen for texture, longevity, and mood.",
  },
  {
    step: "05",
    title: "Build",
    description:
      "Our crew executes with architectural precision — grading, hardscape, planting, and systems installed in a sequenced, studio-managed build.",
  },
  {
    step: "06",
    title: "Final Reveal",
    description:
      "Lighting is tuned, planting settles in, and your outdoor retreat is ready — a finished landscape that feels discovered, not decorated.",
  },
] as const;

export const LUMINA_MATERIALS = [
  {
    name: "Natural Stone",
    note: "Basalt, limestone, and fieldstone — selected for grain and thermal mass.",
    image: LUMINA_IMAGES.materialStone,
  },
  {
    name: "Modern Pavers",
    note: "Large-format porcelain and poured-in-place concrete with precise joints.",
    image: LUMINA_IMAGES.materialPavers,
  },
  {
    name: "Cedar & Wood",
    note: "Reclaimed teak, ipe decking, and charred cedar for warmth and structure.",
    image: LUMINA_IMAGES.materialWood,
  },
  {
    name: "Garden Planting",
    note: "Layered native and ornamental palettes for year-round texture and scent.",
    image: LUMINA_IMAGES.materialPlanting,
  },
  {
    name: "Lighting",
    note: "2700K uplighting, path markers, and moonlighting through canopy.",
    image: LUMINA_IMAGES.materialLighting,
  },
  {
    name: "Water Features",
    note: "Reflecting pools, cascading falls, and ultra-quiet circulation systems.",
    image: LUMINA_IMAGES.materialWater,
  },
] as const;

export const LUMINA_EXPERIENCES = [
  {
    id: "fire-lounge",
    title: "The Fire Lounge",
    style: "Modern",
    feature: "Fire Place",
    description:
      "A sunken seating court wrapped in basalt and cedar — designed for long evenings where conversation replaces the television.",
    image: LUMINA_IMAGES.fireLounge,
    align: "left" as const,
  },
  {
    id: "garden-walk",
    title: "The Garden Walk",
    style: "Naturalistic",
    feature: "Stone Path",
    description:
      "A winding trail through layered planting — each turn reveals a new texture, scent, and framed view of the property.",
    image: LUMINA_IMAGES.gardenWalk,
    align: "right" as const,
  },
  {
    id: "dining-terrace",
    title: "The Outdoor Dining Terrace",
    style: "Resort",
    feature: "Al Fresco",
    description:
      "An elevated terrace with pergola shade, integrated lighting, and sightlines to the water feature — dinner becomes an event.",
    image: LUMINA_IMAGES.diningTerrace,
    align: "left" as const,
  },
  {
    id: "water-feature",
    title: "The Water Feature",
    style: "Architectural",
    feature: "Infinity Edge",
    description:
      "Turquoise-lit water against dark stone — the sound level tuned to whisper, the surface designed to mirror the sky at dusk.",
    image: LUMINA_IMAGES.waterFeature,
    align: "right" as const,
  },
  {
    id: "evening-lighting",
    title: "Evening Lighting",
    style: "Nocturnal",
    feature: "2700K / CRI 95+",
    description:
      "Uplighting through canopy, path markers along stone, and warm washes on architectural planting — the landscape transforms after sunset.",
    image: LUMINA_IMAGES.eveningLighting,
    align: "left" as const,
  },
] as const;

export const LUMINA_PROJECTS = [
  {
    name: "Ridgecrest Estate Study",
    type: "Full Estate Transformation",
    timeline: "14 weeks",
    features: ["Fire lounge", "Infinity pool", "Native planting", "Lighting design"],
    result: "A 1.2-acre property reimagined as a private resort — stone terraces, water features, and layered outdoor rooms.",
    image: LUMINA_IMAGES.project1,
  },
  {
    name: "Harborview Retreat",
    type: "Backyard Resort",
    timeline: "10 weeks",
    features: ["Water feature", "Dining terrace", "Garden walk", "Evening lighting"],
    result: "An ordinary suburban lot transformed into a destination — cinematic at dusk, intimate by firelight.",
    image: LUMINA_IMAGES.project2,
  },
  {
    name: "Stone Path Residence",
    type: "Hardscape & Planting",
    timeline: "8 weeks",
    features: ["Natural stone", "Cedar pergola", "Layered planting", "Path lighting"],
    result: "Geometric stone paths through misty planting — precision hardscape meets organic discovery.",
    image: LUMINA_IMAGES.project3,
  },
] as const;

export const LUMINA_STUDIO_STATS = [
  { value: "180+", label: "Retreats Completed" },
  { value: "12", label: "Design Awards" },
  { value: "98%", label: "Client Referrals" },
] as const;

export const LUMINA_BUDGET_OPTIONS = [
  "Under $50,000",
  "$50,000 – $100,000",
  "$100,000 – $250,000",
  "$250,000+",
] as const;

export const LUMINA_PROPERTY_TYPES = [
  "Estate / Acreage",
  "Suburban Home",
  "Urban Courtyard",
  "Commercial Property",
] as const;

export const LUMINA_TIMELINE_OPTIONS = [
  "Within 3 months",
  "3–6 months",
  "6–12 months",
  "Flexible",
] as const;
