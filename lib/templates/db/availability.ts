import "server-only";

import { isMongoDbConfigured } from "./env";
import { pingTemplateDb } from "./mongodb";

/**
 * When MongoDB env vars are set, verify we can reach the database.
 * If URI is unset, demos may continue with static/local data.
 */
export async function isTemplateDatabaseAvailable(): Promise<boolean> {
  if (!isMongoDbConfigured()) return true;

  try {
    return await pingTemplateDb();
  } catch {
    return false;
  }
}
