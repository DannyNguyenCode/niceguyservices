import { PMR_IMAGES } from "./pawsMatchRescueImages";

export type PetSpecies = "dog" | "cat" | "rabbit";
export type PetSize = "small" | "medium" | "large";
export type PetAgeCategory = "puppy" | "kitten" | "young" | "adult" | "senior";
export type AdoptionStatus = "Available" | "Pending" | "Foster-to-Adopt";

export type AdoptablePet = {
  id: string;
  name: string;
  age: string;
  ageCategory: PetAgeCategory;
  breed: string;
  species: PetSpecies;
  size: PetSize;
  temperament: string[];
  location: string;
  personalityTags: string[];
  status: AdoptionStatus;
  image: string;
  imageAlt: string;
  story: string;
  goodWith: { kids: boolean; dogs: boolean; cats: boolean };
  needs: string[];
  adoptionFee: number;
  matchScore: number;
};

export const PMR_FILTER_OPTIONS = {
  species: [
    { value: "", label: "All Species" },
    { value: "dog", label: "Dogs" },
    { value: "cat", label: "Cats" },
    { value: "rabbit", label: "Rabbits" },
  ],
  age: [
    { value: "", label: "Any Age" },
    { value: "puppy", label: "Puppy / Kitten" },
    { value: "young", label: "Young (1–3 yrs)" },
    { value: "adult", label: "Adult" },
    { value: "senior", label: "Senior" },
  ],
  size: [
    { value: "", label: "Any Size" },
    { value: "small", label: "Small" },
    { value: "medium", label: "Medium" },
    { value: "large", label: "Large" },
  ],
  temperament: [
    { value: "", label: "Any Temperament" },
    { value: "calm", label: "Calm & Gentle" },
    { value: "active", label: "Active & Playful" },
    { value: "social", label: "Social Butterfly" },
    { value: "independent", label: "Independent" },
  ],
  location: [
    { value: "", label: "All Locations" },
    { value: "toronto", label: "Toronto" },
    { value: "mississauga", label: "Mississauga" },
    { value: "foster", label: "In Foster Care" },
  ],
} as const;

export const PMR_ADOPTABLE_PETS: AdoptablePet[] = [
  {
    id: "oliver",
    name: "Oliver",
    age: "2 years",
    ageCategory: "young",
    breed: "Golden Retriever Mix",
    species: "dog",
    size: "large",
    temperament: ["active", "social"],
    location: "toronto",
    personalityTags: ["Energetic", "Apartment Friendly", "Kid Safe"],
    status: "Available",
    image: PMR_IMAGES.oliver,
    imageAlt: "Oliver, a golden retriever mix, sitting in a sunny park",
    story:
      "Oliver arrived as a stray who never lost his optimism. He greets every morning like a reunion and has become the shelter's unofficial welcome committee. He thrives with active families who love long walks and couch cuddles equally.",
    goodWith: { kids: true, dogs: true, cats: false },
    needs: ["Daily exercise", "Basic training refreshers", "Secure yard preferred"],
    adoptionFee: 425,
    matchScore: 98,
  },
  {
    id: "maple",
    name: "Maple",
    age: "4 years",
    ageCategory: "adult",
    breed: "Domestic Shorthair",
    species: "cat",
    size: "small",
    temperament: ["calm", "independent"],
    location: "foster",
    personalityTags: ["Quiet", "Window Watcher", "Low Maintenance"],
    status: "Available",
    image: PMR_IMAGES.maple,
    imageAlt: "Maple, a tabby cat, resting on a soft blanket",
    story:
      "Maple spent months in a crowded city apartment before her owner surrendered her. In foster care she blossomed — preferring sunny windowsills and gentle pets over loud environments. She would love a calm home with patient humans.",
    goodWith: { kids: true, dogs: false, cats: true },
    needs: ["Quiet household", "Indoor-only home", "Litter box privacy"],
    adoptionFee: 175,
    matchScore: 94,
  },
  {
    id: "pepper",
    name: "Pepper",
    age: "1 year",
    ageCategory: "young",
    breed: "Terrier Mix",
    species: "dog",
    size: "medium",
    temperament: ["active", "social"],
    location: "mississauga",
    personalityTags: ["Playful", "Smart", "Treat Motivated"],
    status: "Pending",
    image: PMR_IMAGES.pepper,
    imageAlt: "Pepper, a terrier mix, playing with a rope toy",
    story:
      "Pepper is pure spark in a medium-sized package. She learned sit, stay, and paw in foster care within two weeks. Her ideal match is someone who enjoys training games and can channel her enthusiasm into positive outlets.",
    goodWith: { kids: true, dogs: true, cats: true },
    needs: ["Mental stimulation", "Consistent routine", "Puzzle toys"],
    adoptionFee: 350,
    matchScore: 91,
  },
  {
    id: "cooper",
    name: "Cooper",
    age: "7 years",
    ageCategory: "senior",
    breed: "Labrador Retriever",
    species: "dog",
    size: "large",
    temperament: ["calm", "social"],
    location: "toronto",
    personalityTags: ["Gentle Giant", "Leash Trained", "Senior Sweetheart"],
    status: "Available",
    image: PMR_IMAGES.cooper,
    imageAlt: "Cooper, a senior labrador, lying on grass",
    story:
      "Cooper's family moved overseas and couldn't bring him. Despite his age, he still enjoys leisurely strolls and naps in the sun. He asks for little — a soft bed, kind words, and someone who appreciates the grace of a senior dog.",
    goodWith: { kids: true, dogs: true, cats: true },
    needs: ["Joint-friendly walks", "Soft bedding", "Regular vet checkups"],
    adoptionFee: 275,
    matchScore: 89,
  },
  {
    id: "willow",
    name: "Willow",
    age: "6 months",
    ageCategory: "kitten",
    breed: "Domestic Longhair",
    species: "cat",
    size: "small",
    temperament: ["active", "social"],
    location: "foster",
    personalityTags: ["Curious", "Cuddle Bug", "Feather Toy Fan"],
    status: "Foster-to-Adopt",
    image: PMR_IMAGES.willow,
    imageAlt: "Willow, a fluffy kitten, peeking over a cushion",
    story:
      "Willow and her siblings were found in a garden shed at five weeks old. Hand-raised by volunteers, she's confident, affectionate, and ready to graduate from foster care into a forever home that understands kitten energy.",
    goodWith: { kids: true, dogs: false, cats: true },
    needs: ["Kitten-proofing", "Companion or playtime", "Scratching posts"],
    adoptionFee: 225,
    matchScore: 96,
  },
  {
    id: "mochi",
    name: "Mochi",
    age: "3 years",
    ageCategory: "adult",
    breed: "Holland Lop",
    species: "rabbit",
    size: "small",
    temperament: ["calm", "independent"],
    location: "mississauga",
    personalityTags: ["Gentle", "Litter Trained", "Hay Enthusiast"],
    status: "Available",
    image: PMR_IMAGES.mochi,
    imageAlt: "Mochi, a Holland Lop rabbit, nibbling fresh greens",
    story:
      "Mochi came to us when her previous guardian developed allergies. She's litter trained, enjoys being petted on her own terms, and would thrive in a rabbit-savvy home with space to hop and explore safely.",
    goodWith: { kids: true, dogs: false, cats: false },
    needs: ["Spacious enclosure", "Fresh hay daily", "Rabbit-experienced guardian"],
    adoptionFee: 85,
    matchScore: 87,
  },
];

export const PMR_ADOPTION_STEPS = [
  {
    step: 1,
    title: "Discover",
    description:
      "Browse adoptable pets, read their stories, and find a companion whose energy and needs fit your home. Take your time — the right match matters.",
    icon: "search",
    accent: "terracotta",
  },
  {
    step: 2,
    title: "Apply",
    description:
      "Tell us about your household with a simple application. We ask thoughtful questions because responsible adoption protects pets and families alike.",
    icon: "description",
    accent: "sage",
  },
  {
    step: 3,
    title: "Meet",
    description:
      "Schedule an unhurried visit or virtual meet-and-greet. Spend real time together so you both feel confident before moving forward.",
    icon: "handshake",
    accent: "brown",
  },
  {
    step: 4,
    title: "Waiting Period",
    description:
      "Take a few days to reflect. We want you to feel sure — not rushed. Our team stays available to answer questions while you decide.",
    icon: "hourglass_empty",
    accent: "terracotta",
  },
  {
    step: 5,
    title: "Welcome Home",
    description:
      "Approved adopters receive medical records, a starter kit, and a follow-up check-in. Your new companion comes home supported, not alone.",
    icon: "home",
    accent: "sage",
  },
] as const;

export function getPmrPetById(id: string): AdoptablePet | undefined {
  return PMR_ADOPTABLE_PETS.find((pet) => pet.id === id);
}

export function isPmrPetOpenForApplication(pet: AdoptablePet): boolean {
  return pet.status === "Available" || pet.status === "Foster-to-Adopt";
}

export const PMR_RESCUE_JOURNEY = [
  {
    title: "Intake & safety check",
    description:
      "Every animal receives a calm intake assessment, microchip scan, and safe housing within 24 hours of arrival.",
  },
  {
    title: "Medical care",
    description:
      "Vaccinations, spay/neuter, dental checks, and treatment plans are completed before pets are listed for adoption.",
  },
  {
    title: "Foster evaluation",
    description:
      "Volunteer foster homes reveal personality, habits, and compatibility — giving adopters an honest picture beyond the kennel.",
  },
  {
    title: "Matching with the right home",
    description:
      "Our team reviews applications holistically, prioritizing fit over speed so every placement is built to last.",
  },
] as const;

export const PMR_VOLUNTEER_OPPORTUNITIES = [
  {
    id: "foster",
    title: "Foster a Pet",
    description: "Provide a temporary home while we learn who they truly are.",
    icon: "home_health",
    rotation: -2,
  },
  {
    id: "transport",
    title: "Transport Help",
    description: "Drive pets to vet appointments or adoption events across the GTA.",
    icon: "local_shipping",
    rotation: 1.5,
  },
  {
    id: "events",
    title: "Weekend Events",
    description: "Help at adoption fairs, supply drives, and community meet-ups.",
    icon: "celebration",
    rotation: -1,
  },
  {
    id: "sorting",
    title: "Supply Sorting",
    description: "Organize donations at The Pantry — towels, food, and medical supplies.",
    icon: "inventory_2",
    rotation: 2,
  },
] as const;

export const PMR_DONATION_TIERS = [
  {
    amount: 15,
    label: "$15 feeds a cat for a week",
    description: "Nutritious meals and fresh water for one feline friend.",
  },
  {
    amount: 35,
    label: "$35 provides vaccines",
    description: "Core vaccinations that protect a newly rescued pet.",
  },
  {
    amount: 75,
    label: "$75 supports emergency care",
    description: "Urgent medical treatment when every hour counts.",
  },
  {
    amount: 0,
    label: "Sponsor a pet",
    description: "Cover the full journey for one animal from intake to adoption.",
    highlight: true,
  },
] as const;

export const PMR_SUCCESS_STORIES = [
  {
    id: "max",
    chapter: "Chapter 12",
    title: "Max's New Chapter",
    quote:
      "We weren't looking for a third dog — but Max looked right at us like he'd been waiting. Three months later, he's the heart of our household.",
    author: "The Chen Family, Toronto",
    image: PMR_IMAGES.storyMax,
    imageAlt: "Max the dog with his new family in a park",
    rotation: -3,
  },
  {
    id: "luna",
    chapter: "Chapter 8",
    title: "Luna Found Her Window Seat",
    quote:
      "Luna hid under the bed for a week. Now she claims the bay window every afternoon, chattering at birds like she owns the neighborhood.",
    author: "Sarah M., Mississauga",
    image: PMR_IMAGES.storyLuna,
    imageAlt: "Luna the cat sitting in a sunny window",
    rotation: 2.5,
  },
  {
    id: "bella",
    chapter: "Chapter 21",
    title: "Bella's Second Chance",
    quote:
      "At eight years old, Bella deserved better than a shelter kennel. She sleeps on my pillow now and snores louder than I do.",
    author: "James & Priya, Oakville",
    image: PMR_IMAGES.storyBella,
    imageAlt: "Bella the senior dog resting on a couch",
    rotation: -1.5,
  },
] as const;

export const PMR_FAQ_ITEMS = [
  {
    id: "timeline",
    question: "How long does adoption take?",
    answer:
      "Most adoptions complete within 1–2 weeks after your application is approved. Foster-to-adopt placements may take slightly longer while we ensure the fit is right for everyone involved.",
  },
  {
    id: "meet",
    question: "Can I meet a pet before applying?",
    answer:
      "Absolutely. We encourage meet-and-greets before you apply. Book a visit through our contact form or call the rescue line to schedule a time that works for you and the pet.",
  },
  {
    id: "fees",
    question: "What are the adoption fees?",
    answer:
      "Fees range from $85 for small animals to $425 for dogs, covering vaccinations, spay/neuter, microchip, and a starter care kit. Senior pets and long-stay animals often qualify for reduced fees.",
  },
  {
    id: "vaccinated",
    question: "Are pets vaccinated?",
    answer:
      "Yes. Every adoptable pet is vaccinated, dewormed, and spayed or neutered before going home. You'll receive full medical records at the time of adoption.",
  },
  {
    id: "foster",
    question: "Can I foster first?",
    answer:
      "Foster-to-adopt is available for select pets. You'll provide a temporary home while deciding if the match is permanent — with full support from our foster coordinator throughout.",
  },
] as const;

export const PMR_FOOTER_LINKS = [
  { label: "Discover Pets", href: "/template/demo/pawsmatch-rescue/pets" },
  { label: "How It Works", href: "/template/demo/pawsmatch-rescue#process" },
  { label: "My Applications", href: "/template/demo/pawsmatch-rescue/account" },
  { label: "Success Stories", href: "/template/demo/pawsmatch-rescue#stories" },
  { label: "Donate", href: "/template/demo/pawsmatch-rescue#donate" },
] as const;

export const PMR_CONTACT = {
  email: "hello@pawsmatchrescue.demo",
  phone: "(416) 555-0142",
  address: "42 Willow Lane, Toronto, ON",
} as const;
