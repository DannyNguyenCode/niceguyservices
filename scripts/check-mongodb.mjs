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
const auditDbName =
    env.MONGODB_DB_NAME?.trim() ||
    env.MONGODB_AUDIT_DB_NAME?.trim() ||
    "audit_website";
const templateDbName = env.MONGODB_TEMPLATE_DB_NAME?.trim() || "template_database";

if (!uri) {
    console.log("STATUS: missing MONGODB_URI");
    process.exit(1);
}

async function pingDatabase(dbName) {
    await mongoose.connect(uri, {
        dbName,
        serverSelectionTimeoutMS: 10000,
    });

    const ping = await mongoose.connection.db.admin().ping();
    const database = mongoose.connection.db.databaseName;
    await mongoose.disconnect();
    return { database, ping };
}

try {
    const audit = await pingDatabase(auditDbName);
    console.log("AUDIT_STATUS: connected");
    console.log("AUDIT_DATABASE:", audit.database);
    console.log("AUDIT_PING:", JSON.stringify(audit.ping));

    const template = await pingDatabase(templateDbName);
    console.log("TEMPLATE_STATUS: connected");
    console.log("TEMPLATE_DATABASE:", template.database);
    console.log("TEMPLATE_PING:", JSON.stringify(template.ping));
} catch (error) {
    console.log("STATUS: failed");
    console.log("ERROR:", error instanceof Error ? error.message : String(error));
    process.exit(1);
}
