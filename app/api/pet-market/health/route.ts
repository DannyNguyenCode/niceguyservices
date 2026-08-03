import { getTemplateDatabaseName, isMongoDbConfigured, pingTemplateDb } from "@/lib/templates/db";
import { DATABASE_UNAVAILABLE_CODE, isDatabaseConnectionError } from "@/lib/templates/db/errors";
import { jsonOk } from "../_lib/http";

/** GET /api/pet-market/health */
export async function GET() {
  const database = getTemplateDatabaseName();
  const configured = isMongoDbConfigured();
  if (!configured) {
    return jsonOk({ ok: false, configured: false, database });
  }

  try {
    const connected = await pingTemplateDb();
    return jsonOk({
      ok: connected,
      configured: true,
      database,
      collection: "pet_market",
      ...(connected ? {} : { code: DATABASE_UNAVAILABLE_CODE, error: "Cannot connect to database." }),
    });
  } catch (error) {
    return jsonOk({
      ok: false,
      configured: true,
      database,
      collection: "pet_market",
      code: DATABASE_UNAVAILABLE_CODE,
      error: isDatabaseConnectionError(error)
        ? "Cannot connect to database."
        : error instanceof Error
          ? error.message
          : "Cannot connect to database.",
    });
  }
}
