import type { PetMarketProductDTO, PetMarketProductSearchQuery } from "@/lib/templates/db/pet-market";
import type { SpmProduct, SpmProductCategory } from "./saturdayPetMarketData";
import { SPM_IMG } from "./saturdayPetMarketImages";

const FALLBACK_IMAGES = [
  SPM_IMG.shop.peanutBakes,
  SPM_IMG.shop.puppyFood,
  SPM_IMG.shop.mealTopper,
  SPM_IMG.shop.chickenKibble,
  SPM_IMG.shop.catWhitefish,
  SPM_IMG.shop.pumpkinPouch,
] as const;

function pickProductImage(dto: PetMarketProductDTO): string {
  const category = dto.category.toLowerCase();
  const petType = dto.pet_type.toLowerCase();

  if (category.includes("toy")) return SPM_IMG.shop.featherWand;
  if (category.includes("treat") || category.includes("snack") || category.includes("biscuit")) {
    return SPM_IMG.shop.peanutBakes;
  }
  if (category.includes("leash") || category.includes("collar")) return SPM_IMG.shop.leash;
  if (petType.includes("bird")) return SPM_IMG.shop.finchMix;
  if (petType.includes("cat")) {
    if (category.includes("food") || category.includes("kibble") || category.includes("fish")) {
      return SPM_IMG.shop.catWhitefish;
    }
    return SPM_IMG.shop.catGrass;
  }
  if (category.includes("puppy") || category.includes("kitten")) return SPM_IMG.shop.puppyFood;
  if (category.includes("food") || category.includes("kibble")) return SPM_IMG.shop.chickenKibble;
  if (category.includes("health") || category.includes("stew")) return SPM_IMG.shop.seniorStew;
  if (category.includes("rabbit") || category.includes("small")) return SPM_IMG.shop.rabbitGreens;

  const hash = hashId(dto._id);
  return FALLBACK_IMAGES[hash % FALLBACK_IMAGES.length];
}

function hashId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash + id.charCodeAt(i) * (i + 1)) % 1000;
  }
  return hash;
}

function mapPetType(petType: string): SpmProduct["petType"] {
  const value = petType.toLowerCase();
  if (value.includes("cat")) return "cats";
  if (value.includes("bird")) return "birds";
  return "dogs";
}

function mapCategories(category: string): SpmProductCategory[] {
  const value = category.toLowerCase();
  if (value.includes("treat") || value.includes("snack") || value.includes("biscuit")) {
    return ["treats", "food"];
  }
  if (value.includes("toy")) return ["toys"];
  if (value.includes("food") || value.includes("kibble") || value.includes("catnip")) {
    return ["food"];
  }
  if (value.includes("health") || value.includes("groom")) return ["health"];
  return ["supplies"];
}

export function mapPetMarketProductToSpmProduct(dto: PetMarketProductDTO): SpmProduct {
  const hash = hashId(dto._id);
  const onSale = hash % 4 === 0;

  return {
    id: dto._id,
    name: dto.product_name,
    brand: dto.brand,
    subtitle: `${dto.size} • ${dto.color}`,
    description: dto.description,
    categories: mapCategories(dto.category),
    price: dto.price,
    salePrice: onSale ? Math.round(dto.price * 0.85 * 100) / 100 : undefined,
    image: pickProductImage(dto),
    petType: mapPetType(dto.pet_type),
    petTypeLabel: dto.pet_type,
    quantity: dto.available_quantity ?? dto.quantity,
    stockQuantity: dto.quantity,
    availableQuantity: dto.available_quantity ?? dto.quantity,
    rating: Math.round((4 + (hash % 10) / 10) * 10) / 10,
    reviews: 12 + (hash % 200),
    tag: dto.veterinarian_approved ? "Vet Approved" : undefined,
    badge: onSale ? "SALE!" : undefined,
  };
}

export function mapPetMarketProductsToSpmProducts(items: PetMarketProductDTO[]): SpmProduct[] {
  return items.map(mapPetMarketProductToSpmProduct);
}

export type SpmShopSort = "newest" | "price-asc" | "price-desc" | "name-asc";

export function mapSpmShopSortToApiSort(
  sort: SpmShopSort | "relevant" | "name-desc",
): PetMarketProductSearchQuery["sort"] {
  switch (sort) {
    case "price-asc":
      return "price-asc";
    case "price-desc":
      return "price-desc";
    case "newest":
      return "newest";
    case "name-desc":
      return "name-desc";
    case "relevant":
      return undefined;
    default:
      return "name-asc";
  }
}
