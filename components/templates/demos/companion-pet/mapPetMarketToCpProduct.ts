import type { PetMarketProductDTO } from "@/lib/templates/db/pet-market";
import type { PetType, Product, ProductCategory } from "./companionPetData";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=400&fit=crop",
] as const;

function hashId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash + id.charCodeAt(i) * (i + 1)) % 1000;
  }
  return hash;
}

function mapPetTypes(petType: string): PetType[] {
  const value = petType.toLowerCase();
  if (value.includes("cat")) return ["cat"];
  if (value.includes("bird")) return ["bird"];
  if (value.includes("fish")) return ["fish"];
  if (value.includes("rabbit") || value.includes("small")) return ["small-pet"];
  return ["dog"];
}

function mapCategory(category: string): ProductCategory {
  const value = category.toLowerCase();
  if (value.includes("toy")) return "toys";
  if (value.includes("groom")) return "grooming";
  if (value.includes("leash") || value.includes("collar") || value.includes("access")) {
    return "accessories";
  }
  if (value.includes("health") || value.includes("wellness") || value.includes("supplement")) {
    return "wellness";
  }
  return "food";
}

function stockLevel(available: number): Product["stockLevel"] {
  if (available <= 0) return "out";
  if (available <= 5) return "low";
  return "high";
}

export function mapPetMarketProductToCpProduct(dto: PetMarketProductDTO): Product {
  const hash = hashId(dto._id);
  const available = dto.available_quantity ?? dto.quantity;
  const onSale = hash % 4 === 0;
  const image = FALLBACK_IMAGES[hash % FALLBACK_IMAGES.length];
  const hoverImage = FALLBACK_IMAGES[(hash + 1) % FALLBACK_IMAGES.length];

  return {
    id: dto._id,
    name: dto.product_name,
    brand: dto.brand,
    price: dto.price,
    originalPrice: onSale ? Math.round(dto.price * 1.15 * 100) / 100 : undefined,
    rating: Math.round((4 + (hash % 10) / 10) * 10) / 10,
    reviewCount: 12 + (hash % 200),
    image,
    hoverImage,
    pet: mapPetTypes(dto.pet_type),
    category: mapCategory(dto.category),
    dietary: dto.veterinarian_approved ? ["vet-approved"] : undefined,
    age: dto.recommended_age > 7 ? ["senior"] : dto.recommended_age < 2 ? ["puppy"] : ["adult"],
    loyaltyPoints: Math.max(10, Math.round(dto.price)),
    inStock: available > 0,
    stockLevel: stockLevel(available),
    availableQuantity: available,
    stockQuantity: dto.quantity,
    badges: dto.veterinarian_approved ? ["Vet Approved"] : dto.featured ? ["Featured"] : undefined,
    subscription: hash % 3 === 0,
    recommended: hash % 5 === 0,
    deal: onSale,
  };
}

export function mapPetMarketProductsToCpProducts(items: PetMarketProductDTO[]): Product[] {
  return items.map(mapPetMarketProductToCpProduct);
}
