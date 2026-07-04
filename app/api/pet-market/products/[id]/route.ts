import {
  deletePetMarketProduct,
  findPetMarketProductById,
  parsePetMarketProductPatch,
  updatePetMarketProduct,
} from "@/lib/templates/db/pet-market";
import { PetMarketInventoryError } from "@/lib/templates/db/pet-market/errors";
import { handlePetMarketMutationRoute, handlePetMarketRoute, readJsonBody } from "../../_lib/http";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/** GET /api/pet-market/products/:id */
export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  return handlePetMarketRoute(async () => {
    const product = await findPetMarketProductById(id);
    if (!product) {
      throw new PetMarketInventoryError(`Product not found: ${id}`, "NOT_FOUND", 404);
    }
    return product;
  });
}

/** PATCH /api/pet-market/products/:id — update product fields or quantity */
export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;

  return handlePetMarketMutationRoute(async () => {
    const body = await readJsonBody(request);
    const patch = parsePetMarketProductPatch(body);
    const product = await updatePetMarketProduct(id, patch);
    if (!product) {
      throw new PetMarketInventoryError(`Product not found: ${id}`, "NOT_FOUND", 404);
    }
    return { product };
  });
}

/** DELETE /api/pet-market/products/:id — remove from store inventory */
export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  return handlePetMarketMutationRoute(async () => {
    const deleted = await deletePetMarketProduct(id);
    if (!deleted) {
      throw new PetMarketInventoryError(`Product not found: ${id}`, "NOT_FOUND", 404);
    }
    return { deleted: true, id };
  });
}
