import { listLooneyTunesCategories } from "@/lib/templates/db/looney-tunes";
import { handleLooneyTunesRoute } from "../_lib/http";

/** GET /api/looney-tunes/categories */
export async function GET() {
  return handleLooneyTunesRoute(async () => ({
    categories: await listLooneyTunesCategories(),
  }));
}
