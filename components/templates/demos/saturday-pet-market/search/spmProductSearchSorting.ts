import type { SpmProduct } from "../saturdayPetMarketData";
import type { SpmProductSort } from "./spmProductSearchTypes";

export function sortSpmProducts(products: SpmProduct[], sort: SpmProductSort = "relevant"): SpmProduct[] {
  const list = [...products];
  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
    case "price-desc":
      return list.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
    case "newest":
      return list.reverse();
    default:
      return list;
  }
}
