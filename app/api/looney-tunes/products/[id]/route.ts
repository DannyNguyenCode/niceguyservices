import { findLooneyTunesProductById } from "@/lib/templates/db/looney-tunes";
import { LooneyTunesProductError } from "@/lib/templates/db/looney-tunes/errors";
import { handleLooneyTunesRoute } from "../../_lib/http";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/** GET /api/looney-tunes/products/:id */
export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  return handleLooneyTunesRoute(async () => {
    const product = await findLooneyTunesProductById(id);
    if (!product) {
      throw new LooneyTunesProductError(`Product not found: ${id}`, "NOT_FOUND", 404);
    }
    return product;
  });
}
