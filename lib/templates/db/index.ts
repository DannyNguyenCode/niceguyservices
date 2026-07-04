/**
 * Server-only MongoDB access for experience templates.
 *
 * Use from Server Components, Route Handlers, or Server Actions — never import in client components.
 *
 * @example
 * ```ts
 * import { getTemplateCollection, TEMPLATE_DB_COLLECTIONS } from "@/lib/templates/db";
 *
 * export async function getShopProducts() {
 *   const products = await getTemplateCollection(TEMPLATE_DB_COLLECTIONS.products);
 *   return products.find({ templateSlug: "saturday-pet-market" }).limit(24).toArray();
 * }
 * ```
 */

export { getMongoDbConfig, isMongoDbConfigured, requireMongoDbConfig, type MongoDbConfig } from "./env";
export { getMongoClient, getTemplateDb, pingTemplateDb } from "./mongodb";
export { getTemplateCollection, TEMPLATE_DB_COLLECTIONS, type TemplateDbCollection } from "./collections";
export { isTemplateDatabaseAvailable } from "./availability";
export {
  DATABASE_UNAVAILABLE_CODE,
  databaseUnavailablePayload,
  isDatabaseConnectionError,
  type DatabaseUnavailablePayload,
} from "./errors";
export * from "./pet-market";
export * from "./looney-tunes";
