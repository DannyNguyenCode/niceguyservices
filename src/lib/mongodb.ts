import "server-only";

import mongoose from "mongoose";
import { resolveAuditDatabaseName } from "@/src/config/mongodb-databases";
import { logError, logInfo } from "@/src/lib/safe-log";

declare global {
    var _mongooseConnectionPromise: Promise<typeof mongoose> | undefined;
}

function requireMongoUri(): string {
    const uri = process.env.MONGODB_URI?.trim();
    if (!uri) {
        throw new Error(
            "MONGODB_URI is missing. Set it in the deployment environment before using the Website Audit platform.",
        );
    }
    return uri;
}

function maskMongoHost(uri: string): string {
    try {
        const parsed = new URL(uri);
        return `${parsed.protocol}//${parsed.hostname}`;
    } catch {
        return "mongodb";
    }
}

/**
 * Cached Mongoose connection for Next.js (dev hot reload + serverless).
 * Reuses an in-flight promise and clears it if the connection fails.
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
    if (mongoose.connection.readyState === 1) {
        return mongoose;
    }

    if (global._mongooseConnectionPromise) {
        return global._mongooseConnectionPromise;
    }

    const uri = requireMongoUri();
    const dbName = resolveAuditDatabaseName();

    mongoose.set("bufferCommands", false);

    const connectionPromise = mongoose
        .connect(uri, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 10_000,
            dbName,
        })
        .then((connection) => {
            logInfo("mongodb.connected", {
                host: maskMongoHost(uri),
                database: dbName ?? connection.connection.db?.databaseName ?? "default",
            });
            return connection;
        })
        .catch((error) => {
            global._mongooseConnectionPromise = undefined;
            logError("mongodb.connection_failed", {
                host: maskMongoHost(uri),
                message: error instanceof Error ? error.message.slice(0, 200) : "unknown",
            });
            throw new Error("Unable to connect to MongoDB.");
        });

    global._mongooseConnectionPromise = connectionPromise;
    return connectionPromise;
}

export async function pingDatabase(): Promise<boolean> {
    const connection = await connectToDatabase();
    await connection.connection.db?.admin().ping();
    return true;
}
