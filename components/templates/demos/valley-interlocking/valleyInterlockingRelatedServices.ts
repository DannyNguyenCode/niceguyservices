import { VI_PATHS } from "./valleyInterlockingConfig";
import { VI_IMG } from "./valleyInterlockingImages";

export type ViRelatedService = {
  title: string;
  subtitle: string;
  description: string;
  href: string;
  image: string;
  imageAlt: string;
};

export const VI_BACKYARD_RELATED_SERVICES: readonly ViRelatedService[] = [
  {
    title: "Landscaping Services",
    subtitle: "Design & Build",
    description:
      "Integrate your backyard into a full landscape plan — from planting beds and walkways to seasonal design updates.",
    href: VI_PATHS.landscaping,
    image: VI_IMG.landscaping.hero,
    imageAlt: "Professionally landscaped property with backyard planting beds and hardscape features.",
  },
  {
    title: "Patio Installation",
    subtitle: "Outdoor Living",
    description:
      "Add a stone or paver patio for dining, lounging, and entertainment zones that flow from your backyard design.",
    href: VI_PATHS.patio,
    image: VI_IMG.patio.hero,
    imageAlt: "Stone patio with outdoor seating in a landscaped backyard.",
  },
  {
    title: "Pergolas & Gazebos",
    subtitle: "Shade & Structure",
    description:
      "Define outdoor living areas with pergolas, shade structures, and architectural detail over decking or patios.",
    href: VI_PATHS.pergolas,
    image: VI_IMG.pergolas.hero,
    imageAlt: "Pergola over a backyard patio with outdoor seating and landscaping.",
  },
];

export const VI_LAWN_CARE_RELATED_SERVICES: readonly ViRelatedService[] = [
  {
    title: "Landscaping Services",
    subtitle: "Design & Build",
    description:
      "Integrate lawn care into a full landscape plan — from planting beds and walkways to seasonal design updates.",
    href: VI_PATHS.landscaping,
    image: VI_IMG.landscaping.hero,
    imageAlt: "Professionally landscaped front yard with healthy lawn and planting beds.",
  },
  {
    title: "Backyard Landscaping",
    subtitle: "Full-Yard Design",
    description:
      "Transform rear yards into entertainment zones with healthy turf, planting beds, and outdoor living spaces.",
    href: VI_PATHS.backyard,
    image: VI_IMG.backyard.hero,
    imageAlt: "Completed backyard landscape with manicured lawn and outdoor living area.",
  },
  {
    title: "Interlocking & Paving",
    subtitle: "Hardscaping",
    description:
      "Pair crisp lawn edging with interlocking walkways, driveways, and patios for a polished property finish.",
    href: VI_PATHS.interlocking,
    image: VI_IMG.interlocking.hero,
    imageAlt: "Interlocking walkway bordering a professionally maintained lawn.",
  },
];

export const VI_DRIVEWAY_RELATED_SERVICES: readonly ViRelatedService[] = [
  {
    title: "Interlocking & Paving",
    subtitle: "Hardscaping",
    description:
      "Extend the same professional base standards from your driveway to walkways, patios, and retaining walls.",
    href: VI_PATHS.interlocking,
    image: VI_IMG.interlocking.hero,
    imageAlt: "Residential driveway and walkway with intricate interlocking paving stones.",
  },
  {
    title: "Patio Installation",
    subtitle: "Outdoor Living",
    description:
      "Match your driveway materials and patterns to a cohesive patio and outdoor entertainment area.",
    href: VI_PATHS.patio,
    image: VI_IMG.patio.hero,
    imageAlt: "Stone patio with outdoor seating complementing a paved driveway approach.",
  },
  {
    title: "Landscape Lighting",
    subtitle: "Curb Appeal & Safety",
    description:
      "Illuminate your driveway edges, walkways, and entry for visibility and dramatic curb appeal after dark.",
    href: VI_PATHS.lighting,
    image: VI_IMG.lighting.hero,
    imageAlt: "Landscape lighting highlighting a driveway and front walkway at dusk.",
  },
];

export const VI_INTERLOCKING_RELATED_SERVICES: readonly ViRelatedService[] = [
  {
    title: "Driveway Paving",
    subtitle: "Residential & Commercial",
    description:
      "Apply the same interlocking base standards to driveways — engineered for vehicle loads, drainage, and lasting curb appeal.",
    href: VI_PATHS.driveway,
    image: VI_IMG.driveway.hero,
    imageAlt: "Luxury suburban driveway with natural stone paving and manicured landscaping.",
  },
  {
    title: "Patio Installation",
    subtitle: "Outdoor Living",
    description:
      "Extend interlocking craftsmanship to patios, walkways, and entertainment zones with patterns built for daily use.",
    href: VI_PATHS.patio,
    image: VI_IMG.patio.hero,
    imageAlt: "Stone patio with outdoor seating and landscaped surroundings.",
  },
  {
    title: "Landscape Lighting",
    subtitle: "Hardscape Accents",
    description:
      "Illuminate pavers, steps, and retaining walls to showcase texture and improve safety after dark.",
    href: VI_PATHS.lighting,
    image: VI_IMG.lighting.hero,
    imageAlt: "Landscape lighting highlighting stone walkways and garden features at night.",
  },
];

export const VI_LANDSCAPING_RELATED_SERVICES: readonly ViRelatedService[] = [
  {
    title: "Interlocking & Paving",
    subtitle: "Hardscaping",
    description:
      "Pair softscape design with durable interlocking driveways, walkways, and patios built on professional base standards.",
    href: VI_PATHS.interlocking,
    image: VI_IMG.interlocking.hero,
    imageAlt: "Residential driveway with intricate interlocking paving stones.",
  },
  {
    title: "Backyard Landscaping",
    subtitle: "Full-Yard Design",
    description:
      "Transform rear yards into entertainment zones, retreats, and low-maintenance outdoor living spaces.",
    href: VI_PATHS.backyard,
    image: VI_IMG.backyard.hero,
    imageAlt: "Completed backyard landscape with planting beds and outdoor living area.",
  },
  {
    title: "Lawn Care & Turf",
    subtitle: "Ongoing Maintenance",
    description:
      "Keep new plantings and turf healthy with mowing, fertilization, irrigation, and seasonal upkeep programs.",
    href: VI_PATHS.lawnCare,
    image: VI_IMG.lawnCare.hero,
    imageAlt: "Professionally maintained lawn with crisp edging and healthy turf.",
  },
];

export const VI_LIGHTING_RELATED_SERVICES: readonly ViRelatedService[] = [
  {
    title: "Landscaping Services",
    subtitle: "Design & Build",
    description:
      "Integrate lighting into a cohesive landscape plan — from planting beds and pathways to focal points worth highlighting after dark.",
    href: VI_PATHS.landscaping,
    image: VI_IMG.landscaping.hero,
    imageAlt: "Professionally landscaped front yard with planting beds and stone features.",
  },
  {
    title: "Patio Installation",
    subtitle: "Outdoor Living",
    description:
      "Extend your outdoor hours with patios designed for ambient, task, and accent lighting around seating and entertainment areas.",
    href: VI_PATHS.patio,
    image: VI_IMG.patio.hero,
    imageAlt: "Stone patio with outdoor seating and landscaped surroundings.",
  },
  {
    title: "Interlocking & Paving",
    subtitle: "Pathways & Driveways",
    description:
      "Illuminate interlocking walkways, steps, and driveways for safety, curb appeal, and dramatic texture after sunset.",
    href: VI_PATHS.interlocking,
    image: VI_IMG.interlocking.hero,
    imageAlt: "Interlocking stone walkway with landscape lighting along the edges.",
  },
];

export const VI_PATIO_RELATED_SERVICES: readonly ViRelatedService[] = [
  {
    title: "Pergolas & Gazebos",
    subtitle: "Shade & Structure",
    description:
      "Add pergolas, privacy screens, or overhead structure to your patio for shade, definition, and year-round outdoor comfort.",
    href: VI_PATHS.pergolas,
    image: VI_IMG.pergolas.hero,
    imageAlt: "Pergola over a stone patio with outdoor seating and landscaping.",
  },
  {
    title: "Interlocking & Paving",
    subtitle: "Hardscaping",
    description:
      "Connect your patio to walkways, steps, and driveways with the same durable paver standards used across your property.",
    href: VI_PATHS.interlocking,
    image: VI_IMG.interlocking.hero,
    imageAlt: "Interlocking pavers linking a patio to a front walkway.",
  },
  {
    title: "Landscape Lighting",
    subtitle: "Ambience & Safety",
    description:
      "Highlight seating zones, steps, and garden edges with professional lighting that extends patio use well after sunset.",
    href: VI_PATHS.lighting,
    image: VI_IMG.lighting.hero,
    imageAlt: "Landscape lighting illuminating a patio and surrounding garden at dusk.",
  },
];

export const VI_PERGOLA_RELATED_SERVICES: readonly ViRelatedService[] = [
  {
    title: "Patio Installation",
    subtitle: "Outdoor Living",
    description:
      "Pair your pergola with a stone or paver patio for a complete outdoor dining and entertainment zone.",
    href: VI_PATHS.patio,
    image: VI_IMG.patio.hero,
    imageAlt: "Stone patio beneath a pergola with outdoor seating and landscaped surroundings.",
  },
  {
    title: "Porch Construction",
    subtitle: "Outdoor Structures",
    description:
      "Connect a porch and pergola for layered shade, defined entryways, and cohesive architectural detail.",
    href: VI_PATHS.porch,
    image: VI_IMG.porch.hero,
    imageAlt: "Covered porch flowing into a backyard pergola and landscaped yard.",
  },
  {
    title: "Landscape Lighting",
    subtitle: "Ambience & Safety",
    description:
      "Illuminate pergola posts, beams, and surrounding pathways to extend outdoor use well after sunset.",
    href: VI_PATHS.lighting,
    image: VI_IMG.lighting.hero,
    imageAlt: "Landscape lighting highlighting a pergola and garden features at dusk.",
  },
];

export const VI_PORCH_RELATED_SERVICES: readonly ViRelatedService[] = [
  {
    title: "Pergolas & Gazebos",
    subtitle: "Outdoor Structures",
    description:
      "Pair your porch with a pergola or gazebo for added shade, architectural interest, and defined outdoor living zones.",
    href: VI_PATHS.pergolas,
    image: VI_IMG.pergolas.hero,
    imageAlt: "Pergola alongside a covered porch with outdoor seating and landscaping.",
  },
  {
    title: "Patio Installation",
    subtitle: "Outdoor Living",
    description:
      "Connect porch and patio areas with cohesive hardscaping for dining, lounging, and year-round entertaining.",
    href: VI_PATHS.patio,
    image: VI_IMG.patio.hero,
    imageAlt: "Stone patio flowing from a back porch into a landscaped yard.",
  },
  {
    title: "Landscaping Services",
    subtitle: "Design & Build",
    description:
      "Integrate your porch into a full landscape plan — from planting beds and walkways to lighting and seasonal care.",
    href: VI_PATHS.landscaping,
    image: VI_IMG.landscaping.hero,
    imageAlt: "Professionally landscaped home with porch, planting beds, and stone features.",
  },
];

export const VI_RELATED_SERVICES_BY_PATH: Partial<Record<string, readonly ViRelatedService[]>> = {
  [VI_PATHS.interlocking]: VI_INTERLOCKING_RELATED_SERVICES,
  [VI_PATHS.landscaping]: VI_LANDSCAPING_RELATED_SERVICES,
  [VI_PATHS.lighting]: VI_LIGHTING_RELATED_SERVICES,
  [VI_PATHS.patio]: VI_PATIO_RELATED_SERVICES,
  [VI_PATHS.porch]: VI_PORCH_RELATED_SERVICES,
  [VI_PATHS.pergolas]: VI_PERGOLA_RELATED_SERVICES,
  [VI_PATHS.driveway]: VI_DRIVEWAY_RELATED_SERVICES,
  [VI_PATHS.lawnCare]: VI_LAWN_CARE_RELATED_SERVICES,
  [VI_PATHS.backyard]: VI_BACKYARD_RELATED_SERVICES,
};

export function getViRelatedServices(pathname: string): readonly ViRelatedService[] {
  const path = pathname.replace(/\/$/, "") || "/";
  return VI_RELATED_SERVICES_BY_PATH[path] ?? [];
}
