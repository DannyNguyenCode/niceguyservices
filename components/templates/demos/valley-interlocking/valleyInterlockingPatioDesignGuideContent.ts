import { VI_PATHS } from "./valleyInterlockingConfig";
import { VI_IMG } from "./valleyInterlockingImages";

export const VI_PATIO_DESIGN_GUIDE_SLUG = "how-to-design-the-perfect-patio" as const;

export const VI_PATIO_DESIGN_GUIDE_PATH = `${VI_PATHS.resources}/${VI_PATIO_DESIGN_GUIDE_SLUG}` as const;

export const VI_PATIO_DESIGN_GUIDE = {
  slug: VI_PATIO_DESIGN_GUIDE_SLUG,
  path: VI_PATIO_DESIGN_GUIDE_PATH,
  eyebrow: "Outdoor Living",
  title: "How to Design the Perfect Patio",
  description:
    "Designing a patio is about creating an outdoor living space that complements your home, supports your lifestyle, and adds long-term value to your property. Follow these key steps when planning your patio.",
  readTime: "8 min read",
  category: "Installation Guides" as const,
  author: {
    name: "Valley Interlocking Team",
    role: "Patio Design Specialists",
    image: VI_IMG.about.craftsman,
    imageAlt: "Valley Interlocking landscape design specialist in an outdoor setting.",
  },
  heroImage: VI_IMG.patio.articleHero,
  heroImageAlt:
    "A modern minimalist patio featuring premium natural stone pavers, designer seating, and a wooden pergola at golden hour.",
  figureBreak: {
    image: VI_IMG.patio.articleZones,
    alt: "A professionally designed backyard with distinct dining and fire pit lounge zones connected by hardscaping.",
    caption: "Modern multi-level patio design featuring distinct zones for dining and relaxation.",
  },
  navSections: [
    { label: "Design Fundamentals", href: "#step-1" },
    { label: "Materials & Zones", href: "#step-5" },
    { label: "Budget & Execution", href: "#step-10" },
  ],
  steps: [
    {
      id: "step-1",
      number: "01",
      title: "Define Your Patio's Purpose",
      body: "Before laying a single stone, decide how you'll primarily use the space. Is it for intimate family dining, large-scale entertaining, or a quiet spot for morning coffee? Defining its primary function will dictate the size, layout, and necessary amenities.",
    },
    {
      id: "step-2",
      number: "02",
      title: "Evaluate Your Outdoor Space",
      body: "Assess the natural characteristics of your lot. Look at existing slopes that might require retaining walls, drainage patterns to avoid pooling, and the movement of sunlight throughout the day. Privacy from neighbors is another critical evaluation point.",
      proTip:
        "Pro Tip: Spend a full Saturday observing where the shadows fall on your potential patio site before finalizing the layout.",
    },
    {
      id: "step-3",
      number: "03",
      title: "Choose the Right Location",
      body: "Proximity is key to usability. For dining patios, locate the space close to the kitchen for easy transport of food and dishes. For a private retreat, consider a destination patio tucked further into the landscape to capture the best garden views.",
    },
    {
      id: "step-4",
      number: "04",
      title: "Determine the Ideal Size",
      body: "Size should follow function. Ensure there is enough room for furniture to be pulled back comfortably and for clear walkways (at least 3 feet wide) around seating areas. A common mistake is building a patio that feels cramped once the furniture arrives.",
    },
    {
      id: "step-5",
      number: "05",
      title: "Select Your Patio Materials",
      body: "Materials set the aesthetic tone. Options range from the organic feel of natural bluestone or flagstone to the precision and durability of high-end porcelain pavers or stamped concrete. Choose a material that balances maintenance needs with your home's architectural style.",
      materialCards: [
        {
          title: "Natural Stone",
          description: "Incomparable beauty and character; higher cost and variability.",
        },
        {
          title: "Porcelain Pavers",
          description: "Ultra-low maintenance; clean lines; slip-resistant and durable.",
        },
      ],
    },
    {
      id: "step-6",
      number: "06",
      title: "Plan Functional Zones",
      body: 'Large patios work best when broken into "rooms." Use outdoor rugs, changes in paver patterns, or subtle level shifts to separate the dining area from the lounging lounge or the outdoor kitchen. This creates a more human-scaled, comfortable environment.',
    },
    {
      id: "step-7",
      number: "07",
      title: "Add Features & Enhancements",
      body: "Enhancements transform a simple slab into an experience. Consider a pergola for shade, integrated lighting for evening ambiance, or a built-in fire pit to extend your outdoor season into the cooler months.",
    },
    {
      id: "step-8",
      number: "08",
      title: "Consider Drainage & Grading",
      body: "A patio should always slope away from your home's foundation (typically 1 inch of fall for every 4-8 feet). Proper grading ensures that rainwater doesn't cause basement issues or create stagnant puddles on your beautiful new surface.",
    },
    {
      id: "step-9",
      number: "09",
      title: "Choose Colours & Patterns",
      body: "Coordinate with your home's exterior palette. If your house has busy stonework, choose a simpler paver pattern. Conversely, a minimalist modern home can be grounded by more textured, naturally-toned stone.",
    },
    {
      id: "step-10",
      number: "10",
      title: "Set Your Budget",
      body: "Be realistic about costs, including excavation, materials, and labor. Prioritize the elements that offer the greatest long-term value, such as high-quality base preparation and premium flooring, over decorative accents that can be added later.",
    },
    {
      id: "step-11",
      number: "11",
      title: "Visualize the Final Design",
      body: "Before construction starts, review 3D renderings or physical material samples in your actual yard. Seeing the color of the stone against your siding in the daylight can prevent expensive mistakes.",
    },
    {
      id: "step-12",
      number: "12",
      title: "Work With a Professional Contractor",
      body: "While DIY is tempting, a professional ensures the complex engineering — like sub-base compaction and drainage — is done correctly. This ensures your patio remains level and beautiful for decades, not just a few seasons.",
    },
  ],
  conclusion:
    "A thoughtfully designed patio becomes a natural extension of your home, providing a beautiful outdoor space for relaxing, entertaining, and creating lasting memories while increasing your property's value.",
  closing: {
    primaryLabel: "Start Your Project",
    primaryHref: VI_PATHS.contact,
    secondaryLabel: "View Patio Services",
    secondaryHref: VI_PATHS.patio,
  },
  relatedServices: [
    {
      title: "Landscaping Services",
      subtitle: "Design & Build",
      description:
        "Integrate lighting into a cohesive landscape plan — from planting beds and pathways to focal points worth highlighting after dark.",
      href: VI_PATHS.landscaping,
    },
    {
      title: "Interlocking & Paving",
      subtitle: "Hardscape Installation",
      description:
        "Connect your patio to walkways, steps, and driveways with the same durable paver standards used across your property.",
      href: VI_PATHS.interlocking,
    },
    {
      title: "Landscape Lighting",
      subtitle: "Outdoor Ambience",
      description:
        "Highlight seating zones, steps, and garden edges with professional lighting that extends patio use well after sunset.",
      href: VI_PATHS.lighting,
    },
  ],
  serviceSummary:
    "From defining how you'll use the space to choosing materials, zones, drainage, and a professional installer — follow these twelve planning steps to design a patio that fits your home and lifestyle.",
  serviceStepTitles: [
    "Define Your Patio's Purpose",
    "Evaluate Your Outdoor Space",
    "Choose the Right Location",
    "Determine the Ideal Size",
    "Select Your Patio Materials",
    "Plan Functional Zones",
    "Add Features & Enhancements",
    "Consider Drainage & Grading",
    "Choose Colours & Patterns",
    "Set Your Budget",
    "Visualize the Final Design",
    "Work With a Professional Contractor",
  ],
} as const;
