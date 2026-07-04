import { parsePetMarketProductsQuery } from "./parse-query";
import type { PetMarketProductSearchQuery } from "@/lib/templates/db/pet-market";

/** Builds the product search query from a request URL (same as GET /api/pet-market/products). */
export function buildPetMarketProductsQueryFromUrl(url: string): PetMarketProductSearchQuery {
  const { searchParams } = new URL(url);
  return parsePetMarketProductsQuery(searchParams);
}
