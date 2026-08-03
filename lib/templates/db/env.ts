import {
  DEFAULT_TEMPLATE_DATABASE_NAME,
  resolveTemplateDatabaseName,
} from "@/src/config/mongodb-databases";

export type MongoDbConfig = {
  uri: string;
  dbName: string;
};

export function isMongoDbConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI?.trim());
}

export function getTemplateDatabaseName(): string {
  return resolveTemplateDatabaseName();
}

export function getMongoDbConfig(): MongoDbConfig | null {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) return null;

  return {
    uri,
    dbName: getTemplateDatabaseName(),
  };
}

export function requireMongoDbConfig(): MongoDbConfig {
  const config = getMongoDbConfig();
  if (!config) {
    throw new Error(
      "MongoDB is not configured. Set MONGODB_URI (and optionally MONGODB_TEMPLATE_DB_NAME) in .env.local.",
    );
  }
  return config;
}

export { DEFAULT_TEMPLATE_DATABASE_NAME };
