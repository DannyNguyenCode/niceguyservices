import { NEOPETS_PATHS } from "./neopetsConfig";

export type NeopetsPet = {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  size: string;
  weight: string;
  energyLevel: string;
  energy: number;
  energyColor: string;
  location: string;
  goodWithKids: boolean;
  goodWithPets: boolean;
  badge: string;
  badgePos: string;
  polaroid: string;
  shadow: string;
  img: string;
  gallery: readonly string[];
  galleryBadges: readonly string[];
  tags: readonly string[];
  tagColors: readonly string[];
  personalityTags: readonly string[];
  energyLabel: string;
  perk: { icon: string; text: string };
  btnClass: string;
  breedColor: string;
  stickerIcon: string;
  mdOffset: string;
  about: string;
  personality: string;
  perfectHome: string;
  adoptionFee: number;
  includedCare: readonly string[];
  contact: {
    shelter: string;
    phone: string;
    email: string;
    address: string;
    hours: string;
  };
};

export const NEOPETS_PETS: readonly NeopetsPet[] = [
  {
    id: "marty",
    name: "Marty",
    species: "Dog",
    breed: "American Bulldog",
    age: "2 Years Old",
    size: "Large",
    weight: "68 lbs",
    energyLevel: "High",
    energy: 85,
    energyColor: "bg-[#ba1a1a]",
    location: "Toronto East Foster",
    goodWithKids: true,
    goodWithPets: true,
    badge: "New Arrival!",
    badgePos: "-top-4 -right-4 rotate-12",
    polaroid: "-rotate-2 group-hover:rotate-1",
    shadow: "shadow-[8px_8px_0px_0px_#ebe1d5]",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5kGtt-HqdCzwtLy2E_Muz9ECNkKr6ZOywW2cWpVjIbD2-NIju4vldBBAA1TrTQyhi64ZBAY7cuIqMmSsy_7M15_8nxQq9d8eMkm2OSkrp0N44zcV6-zIOt-penvier4NMElhqhMnX3qyDLFa0OwCd-KJApvNaAY2blGscmd_rHaOdH7D8swGOKvQq_QjAWFXfSJHwwxetgqLJYKOGKV3aRmy5xvkMl4UI7cvtkciyG0K5dPbE_75B24uL9IT7zy1DZWROGhT44OlH",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC5kGtt-HqdCzwtLy2E_Muz9ECNkKr6ZOywW2cWpVjIbD2-NIju4vldBBAA1TrTQyhi64ZBAY7cuIqMmSsy_7M15_8nxQq9d8eMkm2OSkrp0N44zcV6-zIOt-penvier4NMElhqhMnX3qyDLFa0OwCd-KJApvNaAY2blGscmd_rHaOdH7D8swGOKvQq_QjAWFXfSJHwwxetgqLJYKOGKV3aRmy5xvkMl4UI7cvtkciyG0K5dPbE_75B24uL9IT7zy1DZWROGhT44OlH",
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=900&q=80",
    ],
    galleryBadges: ["Playtime Pro", "Cuddle Champion", "Park Explorer"],
    tags: ["Energetic", "Friendly"],
    tagColors: ["bg-[#8fd3ff] text-[#005c80]", "bg-[#adf19e] text-[#326f2d]"],
    personalityTags: ["Friendly", "Playful", "Loyal", "Curious", "Gentle Soul"],
    energyLabel: "High",
    perk: { icon: "child_care", text: "Great with kids!" },
    btnClass: "np-chunky-button bg-[#0d658c] text-white",
    breedColor: "text-[#0d658c]",
    stickerIcon: "auto_awesome",
    mdOffset: "",
    about:
      "Hi, I'm Marty! I bounced into foster care with a wagging tail and zero concept of personal space — in the best way. I love morning walks, squeaky toys, and supervising whatever my humans are doing from approximately three inches away.",
    personality:
      "I'm the friend who shows up early to the party and stays until cleanup. I learn fast, greet everyone like we're best friends, and I believe every squirrel is a personal challenge sent by the universe.",
    perfectHome:
      "An active family or couple with a fenced yard would be my dream. I thrive with structure, positive training, and humans who love outdoor adventures as much as I do.",
    adoptionFee: 425,
    includedCare: [
      "Up-to-date vaccinations",
      "Microchip registration",
      "Spay/neuter surgery",
      "Starter care guide & welcome kit",
    ],
    contact: {
      shelter: "Toronto Adopt-A-Pet — East Foster Hub",
      phone: "(416) 555-0142",
      email: "foster-east@torontoadoptapet.demo",
      address: "124 Pawprint Lane, Toronto, ON M4K 2B1",
      hours: "Mon–Sat 10am–6pm · Sun 11am–4pm",
    },
  },
  {
    id: "ayla",
    name: "Ayla",
    species: "Dog",
    breed: "Boxer Mix",
    age: "4 Years Old",
    size: "Medium",
    weight: "52 lbs",
    energyLevel: "Medium",
    energy: 45,
    energyColor: "bg-[#2e6b29]",
    location: "Leslieville Foster Home",
    goodWithKids: true,
    goodWithPets: true,
    badge: "Gentle Soul",
    badgePos: "-top-4 -left-4 -rotate-6",
    polaroid: "rotate-2 group-hover:-rotate-1",
    shadow: "shadow-[8px_8px_0px_0px_#adf19e]",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7s4rWOJ8G9T-JaneuqCh2pyebiPXvl1kvT89T7ArXGaCLBvweWMXtiLKCpsONdoi2gFjTX7oSGbeuJ_VwH-cFxO4K-Y9KwZivHSothuIvFgsTOjCQJcjGaPIzG7jyJThuCeeNzB-VY5JtCd5xOEXSWciz6IYrdcuUe33C_XsgJVdSnQCGa0J_4Cnb4x5CVfVxPxJLa0VqslRliMrdUQYsVnMQXJ9anv5E3dEBVSByYYJ2kKwPQnDtVJNl832cpyszqqXbK67zVdfH",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA7s4rWOJ8G9T-JaneuqCh2pyebiPXvl1kvT89T7ArXGaCLBvweWMXtiLKCpsONdoi2gFjTX7oSGbeuJ_VwH-cFxO4K-Y9KwZivHSothuIvFgsTOjCQJcjGaPIzG7jyJThuCeeNzB-VY5JtCd5xOEXSWciz6IYrdcuUe33C_XsgJVdSnQCGa0J_4Cnb4x5CVfVxPxJLa0VqslRliMrdUQYsVnMQXJ9anv5E3dEBVSByYYJ2kKwPQnDtVJNl832cpyszqqXbK67zVdfH",
      "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=900&q=80",
    ],
    galleryBadges: ["Snuggle Expert", "Neighbour Favourite", "Calm Companion"],
    tags: ["Calm", "Loyal"],
    tagColors: ["bg-[#eec750] text-[#695300]", "bg-[#8fd3ff] text-[#005c80]"],
    personalityTags: ["Calm", "Loyal", "Gentle Soul", "Friendly", "Apartment Friendly"],
    energyLabel: "Medium",
    perk: { icon: "pets", text: "Good with other pets" },
    btnClass: "np-chunky-button bg-[#2e6b29] text-white",
    breedColor: "text-[#2e6b29]",
    stickerIcon: "favorite",
    mdOffset: "md:mt-12",
    about:
      "I'm Ayla — a soft-hearted boxer mix who believes the best part of any day is leaning against someone I trust. My foster family says I'm the dog who makes nervous visitors feel welcome within five minutes.",
    personality:
      "I'm thoughtful, observant, and affectionate on my own schedule. I love gentle play, sunny naps, and being the steady presence in a busy household.",
    perfectHome:
      "I'd love a home with patient humans, a calm routine, and maybe another friendly dog to share couch time. I'm wonderful with kids who understand gentle boundaries.",
    adoptionFee: 375,
    includedCare: [
      "Up-to-date vaccinations",
      "Microchip registration",
      "Spay/neuter surgery",
      "Starter care guide & welcome kit",
    ],
    contact: {
      shelter: "Toronto Adopt-A-Pet — Leslieville Foster",
      phone: "(416) 555-0198",
      email: "foster-leslieville@torontoadoptapet.demo",
      address: "88 Riverbend Ave, Toronto, ON M4M 1J3",
      hours: "Mon–Fri 11am–7pm · Sat 10am–5pm",
    },
  },
  {
    id: "diamond",
    name: "Diamond",
    species: "Rabbit",
    breed: "Holland Lop Mix",
    age: "1 Year Old",
    size: "Small",
    weight: "4.2 lbs",
    energyLevel: "Low",
    energy: 25,
    energyColor: "bg-[#745b00]",
    location: "North York Small-Pet Suite",
    goodWithKids: true,
    goodWithPets: false,
    badge: "Featured!",
    badgePos: "bottom-4 -right-4 rotate-3",
    polaroid: "-rotate-1 group-hover:rotate-2",
    shadow: "shadow-[8px_8px_0px_0px_#ffe089]",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7uIFgYB297BhXUh8FCiZpxwaiTiEUL35zPFyWBvG7Runvv752rtCZZTV-9WN1ddeMhEYCJ8cn0lJ__81_XqiyBdv0yFXoJSVXo0tq9qiuLwX1LEyWFGRmuCLVzYKlZWKG9-QiTj3Po4FypC5fMRwbsuom_JY9TXfbuGxOoPZVY0XLF_kXCR56vbuvK67af_5XfoRG8CoJERP5fRnz_X2fSRQEyhHohV1v969EMfYVuJDPISL-6YWWv3_ibcUWde3MS7kyGKnO4AvD",
    gallery: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD7uIFgYB297BhXUh8FCiZpxwaiTiEUL35zPFyWBvG7Runvv752rtCZZTV-9WN1ddeMhEYCJ8cn0lJ__81_XqiyBdv0yFXoJSVXo0tq9qiuLwX1LEyWFGRmuCLVzYKlZWKG9-QiTj3Po4FypC5fMRwbsuom_JY9TXfbuGxOoPZVY0XLF_kXCR56vbuvK67af_5XfoRG8CoJERP5fRnz_X2fSRQEyhHohV1v969EMfYVuJDPISL-6YWWv3_ibcUWde3MS7kyGKnO4AvD",
      "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=900&q=80",
    ],
    galleryBadges: ["Hop Star", "Treat Tester", "Quiet Companion"],
    tags: ["Quiet", "Curious"],
    tagColors: ["bg-[#adf19e] text-[#326f2d]", "bg-[#eec750] text-[#695300]"],
    personalityTags: ["Curious", "Calm", "Gentle Soul", "Apartment Friendly", "Friendly"],
    energyLabel: "Low",
    perk: { icon: "home", text: "Perfect for apartments" },
    btnClass: "np-chunky-button bg-[#745b00] text-white",
    breedColor: "text-[#745b00]",
    stickerIcon: "star",
    mdOffset: "",
    about:
      "I'm Diamond — a curious little rabbit with velvet ears and a dramatic flair for treat time. I was found as a stray and have blossomed into a confident, gentle companion who loves exploring cardboard tunnels.",
    personality:
      "I'm quiet but observant, happiest when I can binky around a safe space and then settle in for a long lounge session. I warm up quickly to kind voices and patient hands.",
    perfectHome:
      "A calm apartment or condo with a dedicated indoor setup would be perfect. I'm ideal for first-time rabbit guardians who want a sweet, low-drama friend.",
    adoptionFee: 95,
    includedCare: [
      "Wellness check & vaccinations",
      "Microchip registration",
      "Spay/neuter surgery",
      "Starter care guide & hay sample kit",
    ],
    contact: {
      shelter: "Toronto Adopt-A-Pet — Small Pet Suite",
      phone: "(416) 555-0175",
      email: "smallpets@torontoadoptapet.demo",
      address: "42 Meadowbrook Rd, North York, ON M2N 5P8",
      hours: "Tue–Sun 12pm–5pm · Closed Mondays",
    },
  },
] as const;

export function getPetById(id: string): NeopetsPet | undefined {
  return NEOPETS_PETS.find((pet) => pet.id === id);
}

export function getRelatedPets(currentId: string, limit = 3): NeopetsPet[] {
  return NEOPETS_PETS.filter((pet) => pet.id !== currentId).slice(0, limit);
}

export function petDetailHref(id: string): string {
  return NEOPETS_PATHS.petDetail(id);
}
