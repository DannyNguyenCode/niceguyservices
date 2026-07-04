import { SPM_PATHS } from "./saturdayPetMarketConfig";

export const SPM_SHOP_BRANDS = [
  "Paws & Claws",
  "Furry Friends",
  "Pet Paradise",
  "Whisker Wonders",
  "Tail Waggers",
  "Purrfect Paws",
  "Happy Tails",
  "Pet Haven",
  "Furball Frenzy",
  "Pampered Pets",
] as const;

/** Featured brands shown before “Show more”. */
export const SPM_TOP_BRANDS = SPM_SHOP_BRANDS.slice(0, 6);

export const SPM_SHOP_CATEGORIES = [
  "leashes",
  "catnip",
  "hamster wheel",
  "dog bed",
  "bird cage",
  "fish tank",
  "litter",
  "pet carrier",
  "bird feeder",
  "dog shampoo",
] as const;

export const SPM_SHOP_PET_TYPES = [
  "dog",
  "cat",
  "bird",
  "hamster",
  "fish",
  "rabbit",
  "guinea pig",
  "snake",
  "turtle",
  "ferret",
] as const;

export const SPM_PET_GROUPS = [
  {
    id: "dog",
    label: "Dog",
    icon: "pets",
    accent: "bg-[var(--spm-tertiary-container)] text-[var(--spm-on-tertiary-container)]",
    petTypes: ["dog"],
  },
  {
    id: "cat",
    label: "Cat",
    icon: "pets",
    accent: "bg-[var(--spm-tertiary)] text-[var(--spm-on-tertiary)]",
    petTypes: ["cat"],
  },
  {
    id: "bird",
    label: "Bird",
    icon: "flutter_dash",
    accent: "bg-[var(--spm-primary)] text-[var(--spm-on-primary)]",
    petTypes: ["bird"],
  },
  {
    id: "fish",
    label: "Fish",
    icon: "water_drop",
    accent: "bg-[var(--spm-primary-container)] text-[var(--spm-on-primary-container)]",
    petTypes: ["fish"],
  },
  {
    id: "small-pets",
    label: "Small Pets",
    icon: "pest_control_rodent",
    accent: "bg-[var(--spm-secondary-container)] text-[var(--spm-on-secondary-container)]",
    petTypes: ["hamster", "rabbit", "guinea pig", "ferret"],
  },
  {
    id: "reptiles",
    label: "Reptiles",
    icon: "pest_control",
    accent: "bg-[var(--spm-surface-container-highest)] text-[var(--spm-on-surface)]",
    petTypes: ["snake", "turtle"],
  },
] as const;

export type SpmPetGroupId = (typeof SPM_PET_GROUPS)[number]["id"];

export const SPM_STORE_AISLES = [
  {
    id: "food-nutrition",
    label: "Food & Nutrition",
    signClass: "spm-aisle-sign-teal",
    subcategories: [
      { label: "Catnip & Greens", value: "catnip" },
      { label: "Bird Feeders", value: "bird feeder" },
      { label: "Dry Food & Kibble", value: "dry food" },
      { label: "Wet Food & Toppers", value: "wet food" },
      { label: "Treats & Chews", value: "treats" },
    ],
  },
  {
    id: "toys-enrichment",
    label: "Toys & Enrichment",
    signClass: "spm-aisle-sign-red",
    subcategories: [
      { label: "Hamster Wheels", value: "hamster wheel" },
      { label: "Interactive Toys", value: "toys" },
      { label: "Puzzle Feeders", value: "puzzle feeder" },
      { label: "Fetch & Outdoor", value: "fetch" },
    ],
  },
  {
    id: "health-wellness",
    label: "Health & Wellness",
    signClass: "spm-aisle-sign-yellow",
    subcategories: [
      { label: "Vitamins & Supplements", value: "supplements" },
      { label: "Flea & Tick", value: "flea tick" },
      { label: "Dental Care", value: "dental" },
      { label: "First Aid", value: "first aid" },
    ],
  },
  {
    id: "grooming-care",
    label: "Grooming & Care",
    signClass: "spm-aisle-sign-pink",
    subcategories: [
      { label: "Litter & Boxes", value: "litter" },
      { label: "Shampoo & Bath", value: "dog shampoo" },
      { label: "Brushes & Combs", value: "grooming" },
      { label: "Nail Care", value: "nail care" },
    ],
  },
  {
    id: "travel-home",
    label: "Travel & Home",
    signClass: "spm-aisle-sign-teal",
    subcategories: [
      { label: "Dog Beds", value: "dog bed" },
      { label: "Bird Cages", value: "bird cage" },
      { label: "Fish Tanks", value: "fish tank" },
      { label: "Pet Carriers", value: "pet carrier" },
      { label: "Crates & Gates", value: "crate" },
    ],
  },
  {
    id: "training-behavior",
    label: "Training & Behavior",
    signClass: "spm-aisle-sign-red",
    subcategories: [
      { label: "Leashes & Collars", value: "leashes" },
      { label: "Training Treats", value: "training treats" },
      { label: "Clickers & Aids", value: "training aids" },
      { label: "Calming Aids", value: "calming" },
    ],
  },
] as const;

export const SPM_AVAILABILITY_OPTIONS = [
  { id: "in_stock", label: "In Stock" },
  { id: "local_pickup", label: "Local Pickup" },
  { id: "same_day", label: "Same Day Delivery" },
  { id: "online_only", label: "Online Only" },
] as const;

export type SpmAvailabilityId = (typeof SPM_AVAILABILITY_OPTIONS)[number]["id"];

export const SPM_PRICE_MAX = 150;
export const SPM_PRICE_STEP = 5;

export type SpmShopBrand = (typeof SPM_SHOP_BRANDS)[number];
export type SpmShopCategory = (typeof SPM_SHOP_CATEGORIES)[number];
export type SpmShopPetType = (typeof SPM_SHOP_PET_TYPES)[number];

export type SpmShopFilters = {
  petGroup?: SpmPetGroupId;
  categories: string[];
  brands: string[];
  priceMax?: number;
  availability: SpmAvailabilityId[];
  ratingMin?: 3 | 4;
  saleOnly?: boolean;
  vetRecommended?: boolean;
};

export type SpmShopHrefOptions = Partial<SpmShopFilters> & {
  q?: string;
};

const EMPTY_FILTERS: SpmShopFilters = {
  categories: [],
  brands: [],
  availability: [],
};

function normalizeAgainstList(
  value: string | null | undefined,
  allowed: readonly string[],
): string | undefined {
  if (!value?.trim()) return undefined;
  const trimmed = value.trim();
  return allowed.find((item) => item.toLowerCase() === trimmed.toLowerCase());
}

function normalizeListAgainst(values: string[], allowed: readonly string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  values.forEach((value) => {
    const match = normalizeAgainstList(value, allowed);
    if (match && !seen.has(match.toLowerCase())) {
      seen.add(match.toLowerCase());
      result.push(match);
    }
  });
  return result;
}

function readCsv(searchParams: URLSearchParams, key: string): string[] {
  return searchParams
    .getAll(key)
    .flatMap((item) => item.split(","))
    .map((item) => item.trim())
    .filter(Boolean);
}

function readPetGroup(searchParams: URLSearchParams): SpmPetGroupId | undefined {
  const raw = searchParams.get("pet") ?? searchParams.get("pet_group");
  if (!raw) {
    const legacy = normalizeAgainstList(
      searchParams.get("pet_type") ?? searchParams.get("petType"),
      SPM_SHOP_PET_TYPES,
    );
    if (!legacy) return undefined;
    const group = SPM_PET_GROUPS.find((item) =>
      item.petTypes.some((petType) => petType.toLowerCase() === legacy.toLowerCase()),
    );
    return group?.id;
  }
  return SPM_PET_GROUPS.find((item) => item.id === raw)?.id;
}

function readRatingMin(searchParams: URLSearchParams): 3 | 4 | undefined {
  const raw = searchParams.get("rating_min");
  if (raw === "3") return 3;
  if (raw === "4") return 4;
  return undefined;
}

function readAvailability(searchParams: URLSearchParams): SpmAvailabilityId[] {
  const allowed = new Set(SPM_AVAILABILITY_OPTIONS.map((item) => item.id));
  return readCsv(searchParams, "availability").filter((value): value is SpmAvailabilityId =>
    allowed.has(value as SpmAvailabilityId),
  );
}

export function parseSpmShopFilters(searchParams: URLSearchParams): SpmShopFilters {
  const priceMaxRaw = searchParams.get("price_max");
  const priceMax = priceMaxRaw ? Number.parseFloat(priceMaxRaw) : undefined;

  return {
    petGroup: readPetGroup(searchParams),
    categories: normalizeListAgainst(readCsv(searchParams, "category"), SPM_SHOP_CATEGORIES),
    brands: normalizeListAgainst(readCsv(searchParams, "brand"), SPM_SHOP_BRANDS),
    priceMax: Number.isFinite(priceMax) && priceMax! > 0 ? priceMax : undefined,
    availability: readAvailability(searchParams),
    ratingMin: readRatingMin(searchParams),
    saleOnly: searchParams.get("sale") === "1",
    vetRecommended: searchParams.get("vet") === "1",
  };
}

export function spmPetGroupPetTypes(petGroup?: SpmPetGroupId): string[] | undefined {
  if (!petGroup) return undefined;
  const group = SPM_PET_GROUPS.find((item) => item.id === petGroup);
  return group?.petTypes.slice();
}

function setCsvParam(params: URLSearchParams, key: string, values: string[]) {
  params.delete(key);
  values.forEach((value) => params.append(key, value));
}

export function buildSpmShopHref(options: SpmShopHrefOptions = {}): string {
  const params = new URLSearchParams();

  const q = options.q?.trim();
  if (q) params.set("q", q);

  if (options.petGroup) params.set("pet", options.petGroup);
  setCsvParam(params, "category", options.categories ?? []);
  setCsvParam(params, "brand", options.brands ?? []);

  if (typeof options.priceMax === "number" && options.priceMax > 0) {
    params.set("price_max", String(options.priceMax));
  }
  if (options.availability?.length) {
    setCsvParam(params, "availability", options.availability);
  }
  if (options.ratingMin) params.set("rating_min", String(options.ratingMin));
  if (options.saleOnly) params.set("sale", "1");
  if (options.vetRecommended) params.set("vet", "1");

  const qs = params.toString();
  return qs ? `${SPM_PATHS.shop}?${qs}` : SPM_PATHS.shop;
}

export function spmShopFiltersToApiFilter(filters: SpmShopFilters) {
  const filter: NonNullable<
    import("@/lib/templates/db/pet-market").PetMarketProductSearchQuery["filter"]
  > = {};

  const petTypes = spmPetGroupPetTypes(filters.petGroup);
  if (petTypes?.length) filter.pet_type = petTypes.length === 1 ? petTypes[0] : petTypes;
  if (filters.categories.length) {
    filter.category =
      filters.categories.length === 1 ? filters.categories[0] : filters.categories;
  }
  if (filters.brands.length) {
    filter.brand = filters.brands.length === 1 ? filters.brands[0] : filters.brands;
  }
  if (filters.vetRecommended) filter.veterinarian_approved = true;
  if (typeof filters.priceMax === "number" && filters.priceMax > 0) {
    filter.price_max = filters.priceMax;
  }
  if (filters.availability.includes("in_stock")) filter.in_stock = true;

  return Object.keys(filter).length > 0 ? filter : undefined;
}

export function spmPetTypeIcon(petType: string): string {
  const value = petType.toLowerCase();
  if (value.includes("bird")) return "flutter_dash";
  if (value.includes("fish")) return "water_drop";
  if (value.includes("hamster") || value.includes("guinea") || value.includes("ferret")) {
    return "pest_control_rodent";
  }
  if (value.includes("snake") || value.includes("turtle")) return "pest_control";
  if (value.includes("cat")) return "pets";
  if (value.includes("dog")) return "pets";
  return "pets";
}

export function spmPetTypeLabel(petType: string): string {
  return petType
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function spmCategoryLabel(category: string): string {
  return category
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function spmAisleLabelForCategory(category: string): string | undefined {
  for (const aisle of SPM_STORE_AISLES) {
    const match = aisle.subcategories.find(
      (sub) => sub.value.toLowerCase() === category.toLowerCase(),
    );
    if (match) return match.label;
  }
  return spmCategoryLabel(category);
}

export function spmShopHasActiveFilters(filters: SpmShopFilters): boolean {
  return Boolean(
    filters.petGroup ||
      filters.categories.length ||
      filters.brands.length ||
      filters.priceMax ||
      filters.availability.length ||
      filters.ratingMin ||
      filters.saleOnly ||
      filters.vetRecommended,
  );
}

export function spmShopFiltersEqual(a: SpmShopFilters, b: SpmShopFilters): boolean {
  return JSON.stringify(normalizeSpmShopFilters(a)) === JSON.stringify(normalizeSpmShopFilters(b));
}

export function normalizeSpmShopFilters(filters: Partial<SpmShopFilters> = {}): SpmShopFilters {
  return {
    ...EMPTY_FILTERS,
    ...filters,
    categories: [...(filters.categories ?? [])].sort(),
    brands: [...(filters.brands ?? [])].sort(),
    availability: [...(filters.availability ?? [])].sort(),
  };
}

export type SpmActiveFilterChip = {
  id: string;
  label: string;
  onRemove: () => void;
};

export function spmBuildActiveFilterChips(
  filters: SpmShopFilters,
  handlers: {
    clearPetGroup: () => void;
    toggleCategory: (value: string) => void;
    toggleBrand: (value: string) => void;
    setPriceMax: (value?: number) => void;
    toggleAvailability: (value: SpmAvailabilityId) => void;
    setRatingMin: (value?: 3 | 4) => void;
    setSaleOnly: (value: boolean) => void;
    setVetRecommended: (value: boolean) => void;
  },
): SpmActiveFilterChip[] {
  const chips: SpmActiveFilterChip[] = [];

  if (filters.petGroup) {
    const group = SPM_PET_GROUPS.find((item) => item.id === filters.petGroup);
    chips.push({
      id: `pet-${filters.petGroup}`,
      label: group?.label ?? filters.petGroup,
      onRemove: handlers.clearPetGroup,
    });
  }

  filters.categories.forEach((category) => {
    chips.push({
      id: `cat-${category}`,
      label: spmAisleLabelForCategory(category) ?? spmCategoryLabel(category),
      onRemove: () => handlers.toggleCategory(category),
    });
  });

  filters.brands.forEach((brand) => {
    chips.push({
      id: `brand-${brand}`,
      label: brand,
      onRemove: () => handlers.toggleBrand(brand),
    });
  });

  if (filters.priceMax) {
    chips.push({
      id: "price-max",
      label: `Under $${filters.priceMax}`,
      onRemove: () => handlers.setPriceMax(undefined),
    });
  }

  filters.availability.forEach((value) => {
    const option = SPM_AVAILABILITY_OPTIONS.find((item) => item.id === value);
    chips.push({
      id: `avail-${value}`,
      label: option?.label ?? value,
      onRemove: () => handlers.toggleAvailability(value),
    });
  });

  if (filters.ratingMin) {
    chips.push({
      id: "rating",
      label: `${filters.ratingMin}+ Stars`,
      onRemove: () => handlers.setRatingMin(undefined),
    });
  }

  if (filters.saleOnly) {
    chips.push({
      id: "sale",
      label: "Sale Items",
      onRemove: () => handlers.setSaleOnly(false),
    });
  }

  if (filters.vetRecommended) {
    chips.push({
      id: "vet",
      label: "Vet Recommended",
      onRemove: () => handlers.setVetRecommended(false),
    });
  }

  return chips;
}
