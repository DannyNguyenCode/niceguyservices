import "server-only";

import type { Collection, Document } from "mongodb";
import { getTemplateDb } from "./mongodb";

/** Shared collection names — add per-template collections here as needed. */
export const TEMPLATE_DB_COLLECTIONS = {
  products: "products",
  templates: "templates",
  sessions: "sessions",
  petMarket: "pet_market",
  looneyTunes: "looney_tunes",
} as const;

export type TemplateDbCollection = (typeof TEMPLATE_DB_COLLECTIONS)[keyof typeof TEMPLATE_DB_COLLECTIONS];

export async function getTemplateCollection<TSchema extends Document = Document>(
  name: TemplateDbCollection | string,
): Promise<Collection<TSchema>> {
  const db = await getTemplateDb();
  return db.collection<TSchema>(name);
}
