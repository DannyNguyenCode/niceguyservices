import type { LooneyTunesProductDTO } from "@/lib/templates/db/looney-tunes";
import type { LtMenuBadge, LtMenuProduct } from "./looneytoonsCafeData";
import { LT_CAFE_IMAGES } from "./looneytoonsCafeImages";

function pickMenuImage(product: LooneyTunesProductDTO): string {
  const haystack = `${product.product_name} ${product.category} ${product.description}`.toLowerCase();

  if (haystack.includes("matcha") && haystack.includes("mango")) return LT_CAFE_IMAGES.menuMangoMatcha;
  if (haystack.includes("matcha") && haystack.includes("banana")) return LT_CAFE_IMAGES.menuBananaMatcha;
  if (haystack.includes("matcha")) return LT_CAFE_IMAGES.menuMatcha;
  if (haystack.includes("latte")) return LT_CAFE_IMAGES.menuFlatWhite;
  if (haystack.includes("cappuccino")) return LT_CAFE_IMAGES.menuCappuccino;
  if (haystack.includes("cold brew")) return LT_CAFE_IMAGES.coldBrew;
  if (haystack.includes("mocha")) return LT_CAFE_IMAGES.mocha;
  if (haystack.includes("turkey") || haystack.includes("sandwich")) return LT_CAFE_IMAGES.menuTurkey;
  if (product.category.toLowerCase() === "tea") return LT_CAFE_IMAGES.menuMatcha;

  return LT_CAFE_IMAGES.menuCappuccino;
}

function buildBestSellerBadge(): LtMenuBadge {
  return {
    text: "BEST SELLER",
    className: "bg-[#ba1a1a] text-white",
    rotate: "rotate-[5deg]",
    side: "right",
  };
}

export function mapLooneyTunesToLtMenuProduct(product: LooneyTunesProductDTO): LtMenuProduct {
  const image = pickMenuImage(product);

  return {
    id: product._id,
    name: product.product_name,
    price: product.price,
    description: product.description,
    image,
    alt: product.product_name,
    ...(product.best_seller ? { badge: buildBestSellerBadge() } : {}),
  };
}

export function mapLooneyTunesProductsToLtMenuProducts(
  products: LooneyTunesProductDTO[],
): LtMenuProduct[] {
  return products.map(mapLooneyTunesToLtMenuProduct);
}
