export type MongoDbConfig = {
  uri: string;
  dbName: string;
};

const DEFAULT_DB_NAME = "template_database";

export function isMongoDbConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI?.trim());
}

export function getMongoDbConfig(): MongoDbConfig | null {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) return null;

  const dbName = process.env.MONGODB_DB_NAME?.trim() || DEFAULT_DB_NAME;
  return { uri, dbName };
}

export function requireMongoDbConfig(): MongoDbConfig {
  const config = getMongoDbConfig();
  if (!config) {
    throw new Error(
      "MongoDB is not configured. Set MONGODB_URI (and optionally MONGODB_DB_NAME) in .env.local.",
    );
  }
  return config;
}
