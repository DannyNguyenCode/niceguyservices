import type { ObjectId } from "mongodb";

/** Raw product shape stored in the `looney_tunes` collection. */
export interface LooneyTunesProduct {
  product_name: string;
  description: string;
  price: number;
  category: string;
  size: string;
  ingredients: string;
  caffeine_content: number;
  availability_date: string;
  expiration_date: string;
  best_seller?: boolean;
}

export interface LooneyTunesProductDocument extends LooneyTunesProduct {
  _id: ObjectId;
}

export interface LooneyTunesProductDTO extends LooneyTunesProduct {
  _id: string;
}

export type LooneyTunesProductFilter = {
  category?: string | string[];
  size?: string | string[];
  best_seller?: boolean;
  price_min?: number;
  price_max?: number;
};

export type LooneyTunesProductSearchQuery = {
  q?: string;
  filter?: LooneyTunesProductFilter;
  page?: number;
  pageSize?: number;
  sort?: "price-asc" | "price-desc" | "name-asc" | "name-desc" | "newest";
};

export type LooneyTunesProductSearchResult = {
  items: LooneyTunesProductDTO[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export const LOONEY_TUNES_SEARCH_FIELDS = [
  "product_name",
  "category",
  "description",
  "size",
  "ingredients",
] as const satisfies readonly (keyof LooneyTunesProduct)[];
