import type { PetMarketProductDTO } from "@/lib/templates/db/pet-market";
import type { PsProduct } from "./pawsomeData";
import { PS_IMAGES } from "./pawsomeImages";

const FALLBACK_IMAGES = [
  PS_IMAGES.salmonProduct,
  PS_IMAGES.dentalChews,
  PS_IMAGES.heroHome,
  PS_IMAGES.dogCategory,
] as const;

function hashId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash + id.charCodeAt(i) * (i + 1)) % 1000;
  }
  return hash;
}

export function mapPetMarketProductToPsProduct(dto: PetMarketProductDTO): PsProduct {
  const hash = hashId(dto._id);
  const available = dto.available_quantity ?? dto.quantity;
  const onSale = hash % 4 === 0;
  const image = FALLBACK_IMAGES[hash % FALLBACK_IMAGES.length];

  return {
    id: dto._id,
    name: dto.product_name,
    description: dto.description,
    shortDescription: `${dto.brand} · ${dto.size}`,
    price: dto.price,
    compareAtPrice: onSale ? Math.round(dto.price * 1.2 * 100) / 100 : undefined,
    image,
    match: 85 + (hash % 14),
    points: Math.max(20, Math.round(dto.price * 0.8)),
    badge: dto.veterinarian_approved ? "Vet Approved" : dto.featured ? "Top Rated" : undefined,
    badges: [
      ...(dto.veterinarian_approved ? ["Vet Approved"] : []),
      ...(hash % 3 === 0 ? ["Subscribe & Save"] : []),
      ...(dto.featured ? ["Top Rated"] : []),
    ].filter(Boolean) as string[],
    category: dto.category,
    subscribeSave: hash % 3 === 0,
    lowStock: available > 0 && available <= 5,
    availableQuantity: available,
    stockQuantity: dto.quantity,
  };
}

export function mapPetMarketProductsToPsProducts(items: PetMarketProductDTO[]): PsProduct[] {
  return items.map(mapPetMarketProductToPsProduct);
}
