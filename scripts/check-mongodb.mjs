import mongoose from "mongoose";
import { readFileSync } from "fs";

const lines = readFileSync(".env", "utf8").split(/\r?\n/);
const env = {};

for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    env[trimmed.slice(0, index).trim()] = trimmed.slice(index + 1).trim();
}

const uri = env.MONGODB_URI;
const dbName = env.MONGODB_DB_NAME;

if (!uri) {
    console.log("STATUS: missing MONGODB_URI");
    process.exit(1);
}

try {
    await mongoose.connect(uri, {
        ...(dbName ? { dbName } : {}),
        serverSelectionTimeoutMS: 10000,
    });

    const ping = await mongoose.connection.db.admin().ping();
    console.log("STATUS: connected");
    console.log("DATABASE:", mongoose.connection.db.databaseName);
    console.log("PING:", JSON.stringify(ping));
    await mongoose.disconnect();
} catch (error) {
    console.log("STATUS: failed");
    console.log("ERROR:", error instanceof Error ? error.message : String(error));
    process.exit(1);
}
