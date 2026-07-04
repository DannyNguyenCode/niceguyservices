export const SD_APPROACH_PILLARS = [
  {
    icon: "palette",
    title: "Aesthetic Precision",
    description:
      "Clean, modern interfaces that reflect your brand's unique identity. I specialize in airy, minimalist layouts that breathe.",
    iconClass: "text-[var(--sd-primary)]",
    bgClass: "bg-[color-mix(in_srgb,var(--sd-primary-container)_20%,transparent)]",
  },
  {
    icon: "code",
    title: "Robust Performance",
    description:
      "Performance-first code ensures lightning-fast load times and seamless responsiveness across all screen sizes and browsers.",
    iconClass: "text-[var(--sd-secondary)]",
    bgClass: "bg-[color-mix(in_srgb,var(--sd-secondary-container)_20%,transparent)]",
  },
  {
    icon: "insights",
    title: "Strategic Vision",
    description:
      "Every pixel has a purpose. I analyze user behavior to create funnels that convert visitors into loyal clients.",
    iconClass: "text-[var(--sd-on-surface-variant)]",
    bgClass: "bg-[color-mix(in_srgb,var(--sd-surface-variant)_20%,transparent)]",
  },
] as const;

export const SD_EXPERIENCE_STATS = [
  "50+ Projects Launched",
  "100% Client Satisfaction",
  "Agency Standards Professionalism",
] as const;

export const SD_HOME_PROJECTS = [
  {
    title: "Skyline Estates",
    subtitle: "Web Design & CMS Development",
    imageKey: "projectSkylineEstates" as const,
  },
  {
    title: "Nexus SaaS",
    subtitle: "UI/UX Strategy & Branding",
    imageKey: "projectNexusSaas" as const,
  },
] as const;

export const SD_AGENCY_HIGHLIGHTS = [
  {
    icon: "groups",
    title: "Client Communication",
    description:
      "Direct stakeholder management, translating complex technical constraints into actionable business value.",
  },
  {
    icon: "devices",
    title: "Responsive Strategy",
    description:
      "Ensuring 100% device parity across mobile, tablet, and desktop environments for all agency deployments.",
  },
] as const;

export const SD_PROJECT_JOURNEY = [
  {
    icon: "settings_input_component",
    title: "CMS Architecture",
    description:
      "Developed bespoke headless CMS solutions using Contentful and WordPress, allowing non-technical clients to manage massive content libraries with zero friction.",
    tags: ["Headless", "Scalability"],
  },
  {
    icon: "touch_app",
    title: "UX Optimization",
    description:
      "Audit and overhaul of legacy user journeys. Reduced bounce rates by 24% for a key e-commerce client through strategic micro-interaction design and performance tuning.",
    tags: ["Analytics", "Figma"],
  },
  {
    icon: "verified_user",
    title: "QA Engineering",
    description:
      "Led the internal QA squad. Implemented automated testing pipelines and cross-browser validation protocols that ensured zero-defect launches across 15+ major releases.",
    tags: ["Cypress", "CI/CD"],
  },
] as const;

export const SD_EDUCATION_TIMELINE = [
  {
    icon: "school",
    markerIcon: "circle",
    title: "Bachelor of Design",
    meta: "University of Toronto • 2016 - 2020",
    description:
      "Specialized in Visual Communication and Interaction Design. Focused on the intersection of human psychology and digital interfaces. Graduated with high distinction.",
    imageKey: "campus" as const,
    imageSide: "right" as const,
    iconBg: "bg-[var(--sd-primary-container)]",
  },
  {
    icon: "workspace_premium",
    markerIcon: "star",
    title: "UX Design Pro",
    meta: "Google Certification • 2021",
    description:
      "Comprehensive professional training in user research, wireframing, and high-fidelity prototyping. Mastered accessibility standards and inclusive design principles.",
    imageKey: "workspace" as const,
    imageSide: "left" as const,
    iconBg: "bg-[var(--sd-secondary-container)]",
  },
  {
    icon: "bolt",
    markerIcon: "speed",
    title: "Front-End Intensive",
    meta: "Frontend Masters • 2022",
    description:
      "Deep dive into advanced CSS, React architectures, and performance optimization. Focused on creating seamless, high-performance web animations.",
    imageKey: "code" as const,
    imageSide: "right" as const,
    iconBg: "bg-[var(--sd-primary-container)]",
  },
  {
    icon: "menu_book",
    markerIcon: "lightbulb",
    title: "Digital Craftsman",
    meta: "Self-Taught Mastery • Ongoing",
    description:
      "A lifelong commitment to learning WebGL, Three.js, and advanced UI paradigms. Mastering the tools of tomorrow by experimenting daily.",
    imageKey: "books" as const,
    imageSide: "left" as const,
    iconBg: "bg-[var(--sd-secondary-container)]",
  },
] as const;

export const SD_CORE_COMPETENCIES = [
  "UI/UX Design",
  "React & Next.js",
  "Tailwind CSS",
  "Motion Design",
  "Typography",
  "Brand Identity",
  "User Psychology",
  "WebGL",
  "System Design",
] as const;

export const SD_TECH_SKILLS = [
  { icon: "code", label: "HTML/CSS" },
  { icon: "javascript", label: "JavaScript" },
  { icon: "php", label: "PHP" },
  { icon: "terminal", label: "Python" },
  { icon: "token", label: "Node.js" },
  { icon: "compress", label: "WordPress" },
  { icon: "shopping_bag", label: "Shopify" },
  { icon: "web", label: "Webflow" },
  { icon: "database", label: "API & Databases" },
] as const;

export const SD_DESIGN_UX = [
  { title: "Visual Design & UI", description: "Figma, Adobe Suite, Prototyping." },
  { title: "Typography & Color", description: "Systemic design languages and mood boarding." },
  { title: "Responsive Design", description: "Fluid layouts across all device spectrums." },
] as const;

export const SD_STRATEGY_ITEMS = [
  "SEO & CRO",
  "Site Speed Optimization",
  "Structured Data",
  "Lead Capture & Strategy",
] as const;

export const SD_MANAGEMENT_ITEMS = [
  { title: "Account Mgt", description: "Human-centric client relations." },
  { title: "Agile Flow", description: "Fast, iterative delivery cycles." },
  { title: "Cross-browser", description: "Consistent visuals everywhere." },
  { title: "Security", description: "Protecting digital assets." },
] as const;

export const SD_CONTACT_LINKS = [
  {
    icon: "mail",
    label: "Email Me",
    value: "hello@skylinedesigns.com",
    href: "mailto:hello@skylinedesigns.com",
    bgClass: "bg-[var(--sd-primary-container)] text-[var(--sd-on-primary-container)]",
  },
  {
    icon: "diversity_3",
    label: "LinkedIn",
    value: "Skyline Designs Toronto",
    href: "#",
    bgClass: "bg-[var(--sd-secondary-container)] text-[var(--sd-on-secondary-container)]",
  },
  {
    icon: "code",
    label: "GitHub",
    value: "github.com/skylinedesigns",
    href: "#",
    bgClass: "bg-[var(--sd-tertiary-container)] text-[var(--sd-on-tertiary-container)]",
  },
  {
    icon: "visibility",
    label: "Portfolio",
    value: "See the full gallery",
    href: "#",
    bgClass: "bg-[var(--sd-primary-fixed)] text-[var(--sd-on-primary-fixed-variant)]",
  },
] as const;

export const SD_PROJECT_TYPES = [
  "Web Design",
  "Fullstack Development",
  "Product Consulting",
  "Maintenance",
] as const;

export const SD_FOOTER_LINKS = ["LinkedIn", "GitHub", "Email Me"] as const;
