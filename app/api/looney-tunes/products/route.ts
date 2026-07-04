import { findLooneyTunesProducts } from "@/lib/templates/db/looney-tunes";
import { handleLooneyTunesRoute } from "../_lib/http";
import { buildLooneyTunesProductsQueryFromUrl } from "../_lib/products-query";

/** GET /api/looney-tunes/products?q=&category=&size=&best_seller=&page=&pageSize=&sort= */
export async function GET(request: Request) {
  const query = buildLooneyTunesProductsQueryFromUrl(request.url);
  return handleLooneyTunesRoute(() => findLooneyTunesProducts(query));
}
