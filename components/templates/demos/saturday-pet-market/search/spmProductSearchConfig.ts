import type { SpmProductCategory } from "../saturdayPetMarketData";

import { PET_MARKET_DEFAULT_PAGE_SIZE } from "@/lib/templates/db/pet-market/constants";

export const SPM_SEARCH_DEFAULT_PAGE_SIZE = PET_MARKET_DEFAULT_PAGE_SIZE;

/**
 * Expands common search terms to product categories.
 * Searching "food" also matches treats (parent category); "treats" stays narrow.
 *
 * At scale, mirror this map in the search service or index synonyms config.
 */
export const SPM_CATEGORY_SEARCH_EXPANSION: Partial<Record<string, readonly SpmProductCategory[]>> = {
  food: ["food", "treats"],
  foods: ["food", "treats"],
  treat: ["treats"],
  treats: ["treats"],
  snack: ["treats"],
  snacks: ["treats"],
  biscuit: ["treats"],
  biscuits: ["treats"],
  kibble: ["food"],
  toy: ["toys"],
  toys: ["toys"],
  health: ["health"],
  grooming: ["grooming", "supplies"],
  supplies: ["supplies"],
  supply: ["supplies"],
  leash: ["supplies"],
};
