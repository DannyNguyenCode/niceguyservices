import "server-only";

import { MongoClient, type Db } from "mongodb";
import { getMongoDbConfig, requireMongoDbConfig } from "./env";

declare global {
  var _templateMongoClientPromise: Promise<MongoClient> | undefined;
}

function createMongoClient(uri: string): MongoClient {
  return new MongoClient(uri, {
    maxPoolSize: 10,
  });
}

function getClientPromise(): Promise<MongoClient> {
  const { uri } = requireMongoDbConfig();

  if (process.env.NODE_ENV === "development") {
    if (!global._templateMongoClientPromise) {
      global._templateMongoClientPromise = createMongoClient(uri).connect();
    }
    return global._templateMongoClientPromise;
  }

  return createMongoClient(uri).connect();
}

export async function getMongoClient(): Promise<MongoClient> {
  return getClientPromise();
}

export async function getTemplateDb(): Promise<Db> {
  const { dbName } = requireMongoDbConfig();
  const client = await getMongoClient();
  return client.db(dbName);
}

/** Ping the database — useful for health checks in route handlers. */
export async function pingTemplateDb(): Promise<boolean> {
  const config = getMongoDbConfig();
  if (!config) return false;

  const db = await getTemplateDb();
  const result = await db.command({ ping: 1 });
  return result.ok === 1;
}
