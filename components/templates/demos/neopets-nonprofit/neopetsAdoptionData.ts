import { NEOPETS_PATHS } from "./neopetsConfig";

export const ADOPTION_WARM_PHRASES = {
  gettingToKnowYou: "Getting To Know You",
  findingTheRightMatch: "Finding The Right Match",
  preparingForeverHome: "Preparing For A Forever Home",
} as const;

export const ADOPTION_STEP_CTAS = [
  "Meet Adoptable Pets",
  "Find Your Perfect Match",
  "Give A Pet A Second Chance",
  "Start Your Adoption Journey",
  "Help A Pet Find Home",
] as const;

export type AdoptionStepId =
  | "explore"
  | "match"
  | "apply"
  | "meet"
  | "review"
  | "welcome"
  | "support";

export type AdoptionStep = {
  id: AdoptionStepId;
  step: number;
  title: string;
  subtitle: string;
  icon: string;
  companionIcon: string;
  companionName: string;
  companionTip: string;
  badge: string;
  items: readonly string[];
  highlight?: string;
  cta: { label: string; href: string };
  extra?: {
    title: string;
    description: string;
    items?: readonly string[];
  };
  reviewStages?: readonly { label: string; done: boolean }[];
};

export const ADOPTION_JOURNEY_STEPS: readonly AdoptionStep[] = [
  {
    id: "explore",
    step: 1,
    title: "Explore Adoptable Pets",
    subtitle: "Start your quest by browsing dogs and cats waiting for a forever home.",
    icon: "search",
    companionIcon: "pets",
    companionName: "Marty the Guide Dog",
    companionTip: "Take your time — the right match is worth the search!",
    badge: "Explorer",
    items: [
      "Age",
      "Breed",
      "Size",
      "Energy level",
      "Good with children",
      "Good with other pets",
      "Special needs",
    ],
    cta: { label: "Start Exploring", href: NEOPETS_PATHS.explorer },
  },
  {
    id: "match",
    step: 2,
    title: "Find Your Match",
    subtitle: "Review detailed profiles and discover pets that fit your lifestyle.",
    icon: "favorite",
    companionIcon: "cruelty_free",
    companionName: "Ayla the Matchmaker",
    companionTip: "Every pet has a personality — read their story carefully.",
    badge: "Heart Finder",
    items: [
      "Personality traits",
      "Behaviour information",
      "Medical history",
      "Adoption requirements",
      "Daily care needs",
      "Favourite activities",
    ],
    extra: {
      title: "Pet Compatibility Quiz",
      description: "Answer a few friendly questions about your lifestyle and we'll suggest pets that may be a great fit.",
      items: ["Lifestyle", "Home size", "Activity level", "Experience level"],
    },
    cta: { label: "Find My Match", href: NEOPETS_PATHS.explorer },
  },
  {
    id: "apply",
    step: 3,
    title: "Share Your Story",
    subtitle: "Complete a simple adoption application — we're learning about your home, not judging perfection.",
    icon: "edit_note",
    companionIcon: "volunteer_activism",
    companionName: "Diamond the Helper",
    companionTip: "We're not looking for perfect homes. We're looking for loving homes.",
    badge: "Storyteller",
    items: [
      "Contact information",
      "Household information",
      "Pet experience",
      "Lifestyle details",
      "Veterinary references (optional)",
    ],
    highlight: "We're not looking for perfect homes. We're looking for loving homes.",
    cta: { label: "Apply For Adoption", href: NEOPETS_PATHS.profile },
  },
  {
    id: "meet",
    step: 4,
    title: "Meet Your Future Companion",
    subtitle: "Schedule an introduction and get to know your potential new family member.",
    icon: "waving_hand",
    companionIcon: "emoji_people",
    companionName: "Foster Team",
    companionTip: "Ask anything — our foster families love sharing what they know!",
    badge: "First Hello",
    items: [
      "Virtual meet and greet",
      "In-person visit",
      "Ask questions",
      "Learn routines",
      "Meet foster families",
      "Discuss care requirements",
    ],
    cta: { label: "Schedule A Visit", href: NEOPETS_PATHS.profile },
  },
  {
    id: "review",
    step: 5,
    title: ADOPTION_WARM_PHRASES.findingTheRightMatch,
    subtitle: "Our team works thoughtfully to ensure every adoption is a safe, happy match for pets and families.",
    icon: "verified_user",
    companionIcon: "shield",
    companionName: "Rescue Team",
    companionTip: "This isn't a test — it's about making sure everyone thrives together.",
    badge: "Match Maker",
    items: [
      "Our goal is to ensure every adoption is a safe and happy match for both pets and families.",
    ],
    reviewStages: [
      { label: "Application Received", done: true },
      { label: "Getting To Know You", done: true },
      { label: "Match Confirmation", done: false },
    ],
    cta: { label: "Learn About Our Approach", href: NEOPETS_PATHS.about },
  },
  {
    id: "welcome",
    step: 6,
    title: "Welcome Home!",
    subtitle: "Congratulations — you're preparing for a forever home together.",
    icon: "cottage",
    companionIcon: "celebration",
    companionName: "Welcome Crew",
    companionTip: "The first week is all about patience, routines, and lots of love.",
    badge: "Forever Friend",
    items: [
      "Adoption certificate",
      "Welcome package",
      "Pet care resources",
      "First week checklist",
    ],
    cta: { label: "Prepare For Arrival", href: NEOPETS_PATHS.checklist },
  },
  {
    id: "support",
    step: 7,
    title: "Ongoing Support",
    subtitle: "Adoption doesn't end when you take your pet home — we're here for the journey ahead.",
    icon: "groups",
    companionIcon: "support_agent",
    companionName: "Community Circle",
    companionTip: "You're never alone — our resources and community are always here.",
    badge: "Guardian",
    items: [
      "Pet care articles",
      "Behaviour support",
      "Veterinary resources",
      "Community groups",
      "Training guides",
    ],
    cta: { label: "Access Pet Resources", href: NEOPETS_PATHS.library },
  },
] as const;

export const CHECKLIST_SECTIONS = {
  beforeAdopting: {
    title: "Before Adopting",
    icon: "home",
    items: [
      "Budget planning",
      "Home preparation",
      "Pet-proofing checklist",
      "Family readiness guide",
    ],
  },
  suppliesDogs: {
    title: "Supplies Checklist — Dogs",
    icon: "pets",
    items: ["Food", "Crate", "Leash", "Collar", "Toys"],
  },
  suppliesCats: {
    title: "Supplies Checklist — Cats",
    icon: "cruelty_free",
    items: ["Litter box", "Food", "Scratching post", "Carrier", "Toys"],
  },
  firstWeek: {
    title: "First Week Guide",
    icon: "calendar_today",
    items: [
      "Settling in",
      "Feeding schedules",
      "Introducing family members",
      "Establishing routines",
    ],
  },
  firstMonth: {
    title: "First Month Guide",
    icon: "event_available",
    items: ["Vet visits", "Training", "Socialization", "Exercise plans"],
  },
} as const;

export type HappyTailStory = {
  id: string;
  petName: string;
  familyName: string;
  location: string;
  beforeImage: string;
  afterImage: string;
  beforeAlt: string;
  afterAlt: string;
  story: string;
  update: string;
  anniversary: string;
  adoptedDate: string;
};

export const HAPPY_TAILS_STORIES: readonly HappyTailStory[] = [
  {
    id: "buster",
    petName: "Buster",
    familyName: "The Miller Family",
    location: "Leslieville, Toronto",
    beforeImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDEpD0JmZ412AL2UKN9gsZhnKmJ88CGxxuvvmm2xVR0lMz7BJJzZSg49tFN_AHAeDXGjtcBtmVnXB22PPljTUVnJpudIFcyGDP7bIdHpHJeD38_9ZWLJoPkxEaz1XYG_MkAeDchomdxKA6Z8LHEQ6QDUWWsh6_HfCPSoZqFoLDJHuLzDPP2OcxWmCyBjWHD4Bhof9i2CUpXs8xFVp2jkOo5TIzHTHZ9ayZrmcrGdSOsy0tGLtXt8Lyt3IvMuKojQIjE5eQ9KWHoEw-x",
    afterImage:
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80",
    beforeAlt: "Buster shy at the shelter",
    afterAlt: "Buster happy on the family couch",
    story:
      "He went from hiding under the shelter cot to claiming the middle of our king-sized bed within two weeks.",
    update:
      "One year later, Buster still greets every visitor with a wag and has become our neighbourhood's unofficial ambassador.",
    anniversary: "1 year in forever home",
    adoptedDate: "March 2025",
  },
  {
    id: "luna",
    petName: "Luna",
    familyName: "Sarah & Tom",
    location: "Kensington Market",
    beforeImage:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=600&q=80",
    beforeAlt: "Luna waiting at the rescue",
    afterAlt: "Luna helping at the bookstore",
    story:
      "Luna spent 400 days waiting. Now she helps Sarah manage a small indie bookstore and naps in the sunny window display.",
    update:
      "Luna's adoption anniversary party had 40 neighbours show up — she officially owns Kensington now.",
    anniversary: "2 years in forever home",
    adoptedDate: "June 2024",
  },
  {
    id: "cooper",
    petName: "Cooper",
    familyName: "The Chen Family",
    location: "North York",
    beforeImage:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=600&q=80",
    beforeAlt: "Cooper at foster care",
    afterAlt: "Cooper playing with the Chen kids",
    story:
      "We didn't just get a pet — we found the missing piece of our family puzzle. Cooper and our kids are inseparable.",
    update:
      "Cooper just passed his therapy dog assessment and visits a local seniors' centre every Tuesday.",
    anniversary: "6 months in forever home",
    adoptedDate: "September 2025",
  },
] as const;
