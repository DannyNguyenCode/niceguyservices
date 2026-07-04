import {
  createPetMarketProduct,
  findPetMarketProducts,
  parsePetMarketProductInput,
} from "@/lib/templates/db/pet-market";
import { handlePetMarketMutationRoute, handlePetMarketRoute, readJsonBody } from "../_lib/http";
import { buildPetMarketProductsQueryFromUrl } from "../_lib/products-query";

/** GET /api/pet-market/products?q=&category=&pet_type=&brand=&veterinarian_approved=&page=&pageSize=&sort= */
export async function GET(request: Request) {
  const query = buildPetMarketProductsQueryFromUrl(request.url);

  return handlePetMarketRoute(() => findPetMarketProducts(query));
}

/** POST /api/pet-market/products — add inventory item */
export async function POST(request: Request) {
  return handlePetMarketMutationRoute(async () => {
    const body = await readJsonBody(request);
    const input = parsePetMarketProductInput(body);
    const product = await createPetMarketProduct(input);
    return { product };
  });
}
