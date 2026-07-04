import type { HrSectionId } from "./homeRestorationConfig";
import { HR_IMAGES } from "./homeRestorationImages";

export type RestorationSpace = {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  gridClass: string;
  commonIssues: string[];
  restorationFocus: string[];
  servicesIncluded: string[];
  resultsDelivered: string[];
  beforeImage: string;
  afterImage: string;
};

export type JourneyStep = {
  step: number;
  title: string;
  description: string;
};

export type ServicePackage = {
  id: string;
  name: string;
  price: string;
  tagline: string;
  duration: string;
  recommended: string;
  features: string[];
  featured?: boolean;
};

export type ClientStory = {
  id: string;
  title: string;
  location: string;
  image: string;
  imageAlt: string;
  challenge: string;
  restoration: string;
  result: string;
  align: "left" | "right";
};

export const HR_TRUST_ITEMS = [
  { icon: "verified_user", label: "Fully Insured" },
  { icon: "badge", label: "Background Checked" },
  { icon: "workspace_premium", label: "Satisfaction Guarantee" },
  { icon: "eco", label: "Eco-Friendly Products" },
] as const;

export const HR_SPACES: RestorationSpace[] = [
  {
    id: "kitchens",
    title: "Kitchens",
    description: "Where daily rituals deserve a calm, luminous backdrop.",
    image: HR_IMAGES.kitchen,
    imageAlt: "Sunlit luxury kitchen with marble surfaces",
    gridClass: "md:col-span-2 md:row-span-1",
    commonIssues: [
      "Grease buildup on surfaces and appliances",
      "Cluttered countertops losing their purpose",
      "Dulled finishes and neglected detail work",
    ],
    restorationFocus: [
      "Appliance detailing and surface polishing",
      "Cabinet face restoration and hardware care",
      "Countertop and backsplash refinement",
    ],
    servicesIncluded: [
      "Degreasing and sanitization of all surfaces",
      "Interior cabinet wipe-down",
      "Floor and grout restoration",
      "Fixture polishing and organization reset",
    ],
    resultsDelivered: [
      "A kitchen that feels editorial and inviting",
      "Surfaces that reflect light, not stress",
      "A space ready for both hosting and solitude",
    ],
    beforeImage: HR_IMAGES.kitchenBefore,
    afterImage: HR_IMAGES.kitchenAfter,
  },
  {
    id: "bathrooms",
    title: "Bathrooms",
    description: "Private retreats restored to spa-level serenity.",
    image: HR_IMAGES.bathroom,
    imageAlt: "Minimalist luxury bathroom with warm stone tones",
    gridClass: "md:col-span-1 md:row-span-2",
    commonIssues: [
      "Soap residue and water marks on fixtures",
      "Grout discoloration and tile dullness",
      "Cluttered vanities disrupting calm",
    ],
    restorationFocus: [
      "Fixture and mirror restoration",
      "Tile and grout deep renewal",
      "Vanity organization and surface care",
    ],
    servicesIncluded: [
      "Shower and tub descaling",
      "Mirror and glass polishing",
      "Grout treatment and tile buffing",
      "Hardware and fixture detailing",
    ],
    resultsDelivered: [
      "A sanctuary that feels freshly composed",
      "Sparkling surfaces without harsh chemical residue",
      "A morning ritual elevated to quiet luxury",
    ],
    beforeImage: HR_IMAGES.bathroomBefore,
    afterImage: HR_IMAGES.bathroomAfter,
  },
  {
    id: "living-rooms",
    title: "Living Rooms",
    description: "Gathering spaces returned to warmth and intention.",
    image: HR_IMAGES.livingRoom,
    imageAlt: "Elegant living room with soft natural light",
    gridClass: "md:col-span-1 md:row-span-1",
    commonIssues: [
      "Dust accumulation on textiles and surfaces",
      "High-traffic wear on floors and upholstery",
      "Visual clutter diminishing the room's calm",
    ],
    restorationFocus: [
      "Textile and upholstery refresh",
      "Surface dusting and wood care",
      "Layout reset for visual harmony",
    ],
    servicesIncluded: [
      "Furniture and shelf detailing",
      "Floor care and rug refresh",
      "Window and light fixture cleaning",
      "Decor arrangement and dust removal",
    ],
    resultsDelivered: [
      "A living room that breathes again",
      "Textures restored to their natural warmth",
      "A space worthy of unhurried evenings",
    ],
    beforeImage: HR_IMAGES.livingBefore,
    afterImage: HR_IMAGES.livingAfter,
  },
  {
    id: "bedrooms",
    title: "Bedrooms",
    description: "Sleep sanctuaries cleared for true rest.",
    image: HR_IMAGES.bedroom,
    imageAlt: "Serene bedroom with layered neutral linens",
    gridClass: "md:col-span-1 md:row-span-1",
    commonIssues: [
      "Dust mites and allergens in textiles",
      "Cluttered nightstands and wardrobes",
      "Surfaces that no longer feel restful",
    ],
    restorationFocus: [
      "Bedding and textile refresh",
      "Closet organization and surface care",
      "Air quality and allergen reduction",
    ],
    servicesIncluded: [
      "Mattress and pillow care",
      "Wardrobe and drawer organization",
      "Floor and baseboard detailing",
      "Mirror and surface polishing",
    ],
    resultsDelivered: [
      "A bedroom that invites deep rest",
      "Surfaces free of dust and distraction",
      "A nightly retreat from the day's noise",
    ],
    beforeImage: HR_IMAGES.livingBefore,
    afterImage: HR_IMAGES.livingAfter,
  },
];

export const HR_JOURNEY_STEPS: JourneyStep[] = [
  {
    step: 1,
    title: "Home Assessment",
    description:
      "A thoughtful walkthrough to understand your home's rhythm, priorities, and the spaces that need the most care.",
  },
  {
    step: 2,
    title: "Deep Cleaning",
    description:
      "Foundational restoration — every surface, corner, and detail addressed with precision and intention.",
  },
  {
    step: 3,
    title: "Detail Restoration",
    description:
      "Fine-tuned finishing touches: polishing, organizing, and elevating each room to its fullest potential.",
  },
  {
    step: 4,
    title: "Final Walkthrough",
    description:
      "A shared review ensuring every space meets our standard of sanctuary — your comfort, confirmed.",
  },
];

export const HR_BEFORE_AFTER = [
  {
    id: "kitchen",
    title: "Kitchen",
    before: HR_IMAGES.kitchenBefore,
    after: HR_IMAGES.kitchenAfter,
    beforeAlt: "Kitchen before restoration",
    afterAlt: "Kitchen after restoration",
  },
  {
    id: "bathroom",
    title: "Bathroom",
    before: HR_IMAGES.bathroomBefore,
    after: HR_IMAGES.bathroomAfter,
    beforeAlt: "Bathroom before restoration",
    afterAlt: "Bathroom after restoration",
  },
  {
    id: "living-room",
    title: "Living Room",
    before: HR_IMAGES.livingBefore,
    after: HR_IMAGES.livingAfter,
    beforeAlt: "Living room before restoration",
    afterAlt: "Living room after restoration",
  },
] as const;

export const HR_PACKAGES: ServicePackage[] = [
  {
    id: "essential",
    name: "Essential Refresh",
    price: "$249+",
    tagline: "Monthly upkeep",
    duration: "2–3 hours",
    recommended: "Maintaining a composed home between deeper visits",
    features: [
      "Core room restoration",
      "Surface dusting and sanitization",
      "Bathroom refresh",
      "Kitchen surface care",
      "Floor maintenance",
    ],
  },
  {
    id: "signature",
    name: "Signature Restoration",
    price: "$499+",
    tagline: "White-glove experience",
    duration: "4–6 hours",
    recommended: "Homes ready for a complete sanctuary reset",
    featured: true,
    features: [
      "Full-home deep restoration",
      "Detail polishing on all fixtures",
      "Interior organization reset",
      "Textile and upholstery care",
      "Premium eco-friendly products",
      "Post-visit walkthrough",
    ],
  },
  {
    id: "premium",
    name: "Premium Clean",
    price: "$349+",
    tagline: "Bi-weekly rhythm",
    duration: "3–4 hours",
    recommended: "Busy households seeking consistent calm",
    features: [
      "Extended room coverage",
      "Appliance detailing",
      "Closet and drawer organization",
      "Window and mirror care",
      "Personalized priority areas",
    ],
  },
];

export const HR_CLIENT_STORIES: ClientStory[] = [
  {
    id: "west-end",
    title: "The West End Estate",
    location: "Forest Hill, Toronto",
    image: HR_IMAGES.storyOne,
    imageAlt: "Restored luxury estate living room",
    challenge:
      "A family of five juggling careers and school schedules had let their 3,200 sq ft home slip into constant visual noise — surfaces buried, closets overflowing, and the feeling of calm replaced by low-grade stress.",
    restoration:
      "We began with a full sanctuary assessment, then executed a Signature Restoration across all living spaces. Detail work focused on the kitchen command center, primary suite, and the children's shared areas — each treated as its own micro-retreat.",
    result:
      "Within a single visit, the home shifted from chaotic to composed. The clients described walking in as 'exhaling for the first time in months' — a space that finally matched the life they were building.",
    align: "left",
  },
  {
    id: "harbourfront",
    title: "Harbourfront Penthouse",
    location: "Waterfront, Toronto",
    image: HR_IMAGES.storyTwo,
    imageAlt: "Minimalist penthouse with floor-to-ceiling windows",
    challenge:
      "A executive couple hosting weekly dinners needed their open-concept penthouse to feel gallery-ready on demand — but daily life left marble surfaces dulled and entertaining spaces perpetually 'almost ready.'",
    restoration:
      "Our team implemented a bi-weekly Premium Clean rhythm with quarterly Signature Restoration deep dives. Special attention went to the kitchen island, guest bath, and the floor-to-ceiling glass that frames the harbour view.",
    result:
      "The penthouse now transitions effortlessly from private retreat to hosting stage. Guests consistently ask who designed the space — the ultimate compliment for a home that simply feels intentional.",
    align: "right",
  },
  {
    id: "annex",
    title: "The Annex Townhouse",
    location: "The Annex, Toronto",
    image: HR_IMAGES.storyThree,
    imageAlt: "Warm townhouse interior with restored details",
    challenge:
      "After a renovation, a couple found themselves living among construction dust and unfinished details — the new kitchen and baths beautiful in design but far from the sanctuary they had envisioned.",
    restoration:
      "A post-renovation Signature Restoration addressed every surface: grout sealing, fixture polishing, cabinet interiors, and a full textile refresh. We treated the home as a new chapter, not a cleanup job.",
    result:
      "The townhouse finally felt move-in ready — not just structurally, but emotionally. The owners held their first dinner party that weekend, in a home that felt as considered as their original design vision.",
    align: "left",
  },
];

export const HR_PROPERTY_SIZES = [
  { id: "studio", label: "Studio / 1 Bed", sqft: "Up to 800 sq ft" },
  { id: "two-bed", label: "2 Bedroom", sqft: "800–1,200 sq ft" },
  { id: "three-bed", label: "3 Bedroom", sqft: "1,200–2,000 sq ft" },
  { id: "estate", label: "Estate / 4+ Bed", sqft: "2,000+ sq ft" },
] as const;

export const HR_FREQUENCIES = [
  { id: "weekly", label: "Weekly" },
  { id: "biweekly", label: "Bi-Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "onetime", label: "One-Time Restoration" },
] as const;

export const HR_CONTACT = {
  email: "concierge@sanctuaryhome.demo",
  phone: "(416) 555-0187",
  address: "88 Yorkville Ave, Suite 400, Toronto, ON",
  serviceAreas: ["Toronto", "North York", "Mississauga", "Oakville", "Richmond Hill"],
} as const;

export const HR_SOCIAL_LINKS = [
  { name: "Instagram", icon: "photo_camera", href: "#" },
  { name: "Pinterest", icon: "push_pin", href: "#" },
  { name: "LinkedIn", icon: "work", href: "#" },
] as const;

export const HR_FOOTER_NAV: { label: string; section: HrSectionId }[] = [
  { label: "Our Process", section: "process" },
  { label: "Restored Spaces", section: "spaces" },
  { label: "Packages", section: "packages" },
  { label: "Client Stories", section: "stories" },
  { label: "Book Consultation", section: "contact" },
];
