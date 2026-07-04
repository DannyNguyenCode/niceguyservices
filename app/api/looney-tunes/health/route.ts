import { isMongoDbConfigured, pingTemplateDb } from "@/lib/templates/db";
import { DATABASE_UNAVAILABLE_CODE, isDatabaseConnectionError } from "@/lib/templates/db/errors";
import { jsonOk } from "../_lib/http";

/** GET /api/looney-tunes/health */
export async function GET() {
  const configured = isMongoDbConfigured();
  if (!configured) {
    return jsonOk({ ok: false, configured: false, database: "template_database" });
  }

  try {
    const connected = await pingTemplateDb();
    return jsonOk({
      ok: connected,
      configured: true,
      database: "template_database",
      collection: "looney_tunes",
      ...(connected ? {} : { code: DATABASE_UNAVAILABLE_CODE, error: "Cannot connect to database." }),
    });
  } catch (error) {
    return jsonOk({
      ok: false,
      configured: true,
      database: "template_database",
      collection: "looney_tunes",
      code: DATABASE_UNAVAILABLE_CODE,
      error: isDatabaseConnectionError(error)
        ? "Cannot connect to database."
        : error instanceof Error
          ? error.message
          : "Cannot connect to database.",
    });
  }
}
