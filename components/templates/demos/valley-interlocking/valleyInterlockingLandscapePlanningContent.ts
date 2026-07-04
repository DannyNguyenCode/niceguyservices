import { VI_PATHS } from "./valleyInterlockingConfig";
import { VI_FAQS } from "./valleyInterlockingFaqContent";
import { VI_IMG } from "./valleyInterlockingImages";

const designFaq = VI_FAQS.find((f) => f.question === "Can I do some of the Design Work?")!;
const designInvolvedFaq = VI_FAQS.find((f) => f.question === "What's involved with a Landscape Design?")!;
const timelineFaq = VI_FAQS.find((f) => f.question === "How long will my Landscape Project Take?")!;
const specialtiesFaq = VI_FAQS.find((f) => f.question === "Landscaping Specialties")!;
const snowFaq = VI_FAQS.find((f) => f.question === "Who do I call after the Snow has fallen?")!;
const maintenanceWhyFaq = VI_FAQS.find((f) => f.question === "Why is Professional Maintenance Important?")!;
const maintenanceServicesFaq = VI_FAQS.find((f) => f.question === "Do you do Maintenance Work?")!;

export const VI_LANDSCAPE_PLANNING_SLUG = "landscape-planning-guide" as const;

export const VI_LANDSCAPE_PLANNING_PATH = `${VI_PATHS.resources}/${VI_LANDSCAPE_PLANNING_SLUG}` as const;

export const VI_LANDSCAPE_PLANNING = {
  slug: VI_LANDSCAPE_PLANNING_SLUG,
  path: VI_LANDSCAPE_PLANNING_PATH,
  breadcrumb: "Comprehensive Planning Guide",
  title: "Mastering Your Landscape: A Comprehensive Planning Guide",
  summary:
    "A technical deep-dive into professional landscaping workflows, from initial design and excavation logistics to long-term site maintenance.",
  readTime: "10 min read",
  category: "FAQs" as const,
  heroImage: VI_IMG.resources.planning.siteProgress,
  heroImageAlt: "Professional landscaping site in progress with precise excavation and equipment.",
  galleryImage: VI_IMG.resources.planning.finishedPatio,
  galleryImageAlt: "Finished luxury patio with interlocking paving stones and pergola at dusk.",
  sections: [
    {
      id: "excavation",
      number: "01",
      title: "Excavation & Design Vision",
      phase: "Phase: Discovery & Groundwork",
      tone: "primary" as const,
      intro: designInvolvedFaq.answer[0],
      paragraphs: [designInvolvedFaq.answer[1] ?? designInvolvedFaq.answer[0]],
      cards: [
        {
          icon: "draw",
          title: "Can I contribute?",
          body: designFaq.answer[0],
        },
        {
          icon: "engineering",
          title: "Our Methodology",
          body: "We work with your lifestyle requirements and translate creative intent into technically viable construction plans using locally sourced materials.",
        },
      ],
      blueprint: true,
    },
    {
      id: "logistics",
      number: "02",
      title: "Project Logistics & Timelines",
      phase: "Phase: Operational Scheduling",
      tone: "secondary" as const,
      intro:
        "Transparency is the foundation of our client relationships. Understanding how long your project takes is as important as scope and budget.",
      timelineItems: [
        { label: "Design Phase", detail: timelineFaq.answer[1] },
        { label: "Permit Acquisition", detail: "Variable by municipality — handled by our team where required." },
        { label: "Construction Window", detail: timelineFaq.answer[2] },
      ],
    },
    {
      id: "specialties",
      number: "03",
      title: "Specialized Services",
      phase: "Phase: Structural Implementation",
      tone: "primary" as const,
      intro: specialtiesFaq.answer[2],
      services: [
        { icon: "deck", label: "Patios & Decks", href: VI_PATHS.patio },
        { icon: "fence", label: "Gazebos & Pergolas", href: VI_PATHS.pergolas },
        { icon: "grid_view", label: "Interlocking Paving", href: VI_PATHS.interlocking },
        { icon: "architecture", label: "Porch Construction", href: VI_PATHS.porch },
      ],
      closing: specialtiesFaq.answer[0],
    },
    {
      id: "winter",
      number: "04",
      title: "Winter Preparedness",
      phase: "Phase: Seasonal Continuity",
      tone: "ink" as const,
      intro: snowFaq.answer[0],
      body: snowFaq.answer[1],
      highlights: [
        { icon: "shutter_speed", label: "24/7 Response" },
        { icon: "ac_unit", label: "Climate-Resistant Service" },
      ],
    },
    {
      id: "maintenance",
      number: "05",
      title: "Maintenance & Long-term Care",
      phase: "Phase: Ecosystem Preservation",
      tone: "tertiary" as const,
      intro: maintenanceWhyFaq.answer.join(" "),
      body: maintenanceServicesFaq.answer.join(" "),
      protocols: [
        { label: "Precision Lawn Leveling", frequency: "Monthly" },
        { label: "Organic Fertilizer Programs", frequency: "Quarterly" },
        { label: "Irrigation Calibration", frequency: "Bi-Annual" },
      ],
    },
  ],
  serviceSummary:
    "When planning new landscaping, consider how to design your space and choose ideas that suit your home — from initial design and timelines to specialized services, winter care, and ongoing maintenance.",
  serviceStepTitles: [
    "Excavation & Design Vision",
    "Project Logistics & Timelines",
    "Specialized Services",
    "Winter Preparedness",
    "Maintenance & Long-term Care",
  ],
  relatedServices: [
    {
      title: "Interlocking & Paving",
      subtitle: "Hardscaping",
      description:
        "Pair softscape design with durable interlocking driveways, walkways, and patios built on professional base standards.",
      href: VI_PATHS.interlocking,
    },
    {
      title: "Backyard Landscaping",
      subtitle: "Full-Yard Design",
      description:
        "Transform rear yards into entertainment zones, retreats, and low-maintenance outdoor living spaces.",
      href: VI_PATHS.backyard,
    },
    {
      title: "Lawn Care & Turf",
      subtitle: "Ongoing Maintenance",
      description:
        "Keep new plantings and turf healthy with mowing, fertilization, irrigation, and seasonal upkeep programs.",
      href: VI_PATHS.lawnCare,
    },
  ],
  cta: {
    title: "Ready to Master Your Landscape?",
    description:
      "Transition from planning to production with a team committed to high-integrity builds across the Greater Toronto and Edmonton areas.",
    primaryLabel: "Hire the Experts",
    primaryHref: VI_PATHS.contact,
    secondaryLabel: "Schedule Consultation",
    secondaryHref: VI_PATHS.contact,
  },
} as const;
