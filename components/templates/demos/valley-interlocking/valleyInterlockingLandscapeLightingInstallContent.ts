import { VI_PATHS } from "./valleyInterlockingConfig";
import { VI_IMG } from "./valleyInterlockingImages";

export const VI_LANDSCAPE_LIGHTING_INSTALL_SLUG = "how-to-install-landscape-lighting" as const;

export const VI_LANDSCAPE_LIGHTING_INSTALL_PATH =
  `${VI_PATHS.resources}/${VI_LANDSCAPE_LIGHTING_INSTALL_SLUG}` as const;

export const VI_LANDSCAPE_LIGHTING_INSTALL = {
  slug: VI_LANDSCAPE_LIGHTING_INSTALL_SLUG,
  path: VI_LANDSCAPE_LIGHTING_INSTALL_PATH,
  eyebrow: "Technical Series 2024",
  blueprintId: "Technical Blueprint 045",
  title: "Technical Blueprint 045: Landscape Lighting Installation",
  lastUpdated: "June 6, 2025",
  summary:
    "Landscape lighting is a simple improvement that can make a huge difference in how your home looks after sunset. This guide will teach you how to install landscape lighting and make your home more welcoming and secure.",
  difficulty: "Advanced",
  duration: "> 1 Day",
  readTime: "18 min read",
  category: "Installation Guides" as const,
  heroImage: VI_IMG.lighting.articleFeatured,
  heroImageAlt:
    "A professional architectural photograph of a high-end residential garden at dusk with low-voltage landscape lighting illuminating a stone pathway and cedar trees.",
  systemTypes: [
    {
      id: "solar",
      icon: "wb_sunny" as const,
      title: "Solar",
      description:
        "Utilizes photovoltaic cells for power. Zero wiring required. Best for easy accenting.",
      featured: false,
    },
    {
      id: "low-voltage",
      icon: "bolt" as const,
      title: "Low Voltage",
      description:
        "12V transformer based system. Highly energy efficient and safest for residential DIY.",
      featured: true,
    },
    {
      id: "line-voltage",
      icon: "power" as const,
      title: "Line Voltage",
      description:
        "Standard 120V hardwired connection. Requires conduit. Best for large-scale professional builds.",
      featured: false,
    },
  ],
  solarSteps: [
    {
      number: "01",
      title: "Detail Planning",
      body: "Identify locations receiving 6-8 hours of direct sunlight. Obstructions like foliage will significantly reduce nighttime runtime.",
    },
    {
      number: "02",
      title: "Spacing Hierarchy",
      body: 'Position fixtures a maximum of 6 inches from the path edge. Maintain consistent intervals to prevent "hot spots" and deep dark gaps.',
    },
    {
      number: "03",
      title: "Initial Commissioning",
      body: 'Assemble components and allow units to charge for 12-14 hours in the "OFF" position before staking them into the final location.',
    },
  ],
  lowVoltageCards: [
    {
      title: "Transformer Mounting",
      body: "Mount the weather-sealed transformer near a GFCI-protected outlet. Ensure the unit is at least 12 inches above the final grade to prevent water intrusion.",
    },
    {
      title: "Main Wire Prep",
      body: "Strip the insulation of the 10-gauge main wire. A high-quality wire stripper is essential for maintaining individual strand integrity.",
    },
    {
      title: "Staking & Layout",
      body: "Dig a shallow 3-inch trench for the cable. Stake your fixtures according to the lighting plan, leaving slight slack in the cable for frost heave.",
    },
    {
      title: "Termination",
      body: "Utilize quick-connect systems for standard runs. For sub-grade or high-moisture areas, transition to watertight butt-splice connectors.",
    },
  ],
  lineVoltage: {
    title: "Line Voltage (Pro Guide)",
    safetyTitle: "Safety Alert",
    safetyBody:
      "Line voltage systems involve direct connection to the home's electrical panel. Hiring a licensed electrician is mandatory for panel work and final inspection.",
    requirements: [
      { icon: "straighten" as const, label: "18-inch deep trenches required" },
      { icon: "settings_input_component" as const, label: "UF Cable (Direct Burial) mandatory" },
    ],
  },
  requiredTools: ["Tape measure", "Wire stripper", "Lawn edger", "Butane torch (heat shrink)"],
  readinessChecks: ["Site survey complete", "Utility marking requested", "Materials staged"],
  closing: {
    title: "Ready to Illuminate Your Outdoor Space?",
    content: [
      "Learning how to install landscape lighting can be a great home improvement project for any time of year. Your new landscape lighting will ensure the walkways and gardens in your yard are safe and welcoming after dusk.",
      "Prefer a professional installation? Our team handles design, wiring, and fixture placement so your outdoor lighting performs beautifully for years to come.",
    ],
    ctaLabel: "Get a Professional Quote",
    ctaHref: VI_PATHS.contact,
  },
  relatedServices: [
    {
      title: "Landscape Lighting",
      subtitle: "Professional Installation",
      description:
        "Highlight seating zones, steps, and garden edges with professional lighting that extends patio use well after sunset.",
      href: VI_PATHS.lighting,
    },
    {
      title: "Landscaping Services",
      subtitle: "Design & Build",
      description:
        "Integrate lighting into a cohesive landscape plan — from planting beds and pathways to focal points worth highlighting after dark.",
      href: VI_PATHS.landscaping,
    },
    {
      title: "Patio Installation",
      subtitle: "Outdoor Living",
      description:
        "Extend your outdoor hours with patios designed for ambient, task, and accent lighting around seating and entertainment areas.",
      href: VI_PATHS.patio,
    },
  ],
  serviceSummary:
    "Choose between solar, low voltage, and line voltage landscape lighting — then follow the right installation sequence for planning, wiring, burial, and automatic controls.",
  serviceStepTitles: [
    "System Selection",
    "Solar Installation",
    "Low Voltage Setup",
    "Line Voltage (Pro Guide)",
  ],
} as const;
