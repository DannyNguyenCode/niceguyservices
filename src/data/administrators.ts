import "server-only";

import { connectToDatabase } from "@/src/lib/mongodb";
import { hashPassword } from "@/src/lib/auth/password";
import { Administrator, type AdministratorLean } from "@/src/models/Administrator";

export type SerializableAdministrator = {
    id: string;
    name: string;
    email: string;
    role: AdministratorLean["role"];
    status: AdministratorLean["status"];
    sessionVersion: number;
    lastLoginAt: string | null;
    createdAt: string;
    updatedAt: string;
};

function toSerializable(doc: AdministratorLean): SerializableAdministrator {
    return {
        id: String(doc._id),
        name: doc.name,
        email: doc.email,
        role: doc.role,
        status: doc.status,
        sessionVersion: Number(doc.sessionVersion ?? 1),
        lastLoginAt: doc.lastLoginAt ? new Date(doc.lastLoginAt).toISOString() : null,
        createdAt: new Date(doc.createdAt).toISOString(),
        updatedAt: new Date(doc.updatedAt).toISOString(),
    };
}

export async function getAdministratorByEmail(
    email: string,
): Promise<(AdministratorLean & { passwordHash: string }) | null> {
    await connectToDatabase();
    const normalized = email.trim().toLowerCase();
    return Administrator.findOne({ email: normalized })
        .select("+passwordHash")
        .lean<(AdministratorLean & { passwordHash: string }) | null>();
}

export async function getAdministratorById(id: string): Promise<SerializableAdministrator | null> {
    await connectToDatabase();
    const doc = await Administrator.findById(id).lean<AdministratorLean | null>();
    return doc ? toSerializable(doc) : null;
}

export async function createAdministrator(input: {
    name: string;
    email: string;
    password: string;
    role?: AdministratorLean["role"];
    status?: AdministratorLean["status"];
}): Promise<SerializableAdministrator> {
    await connectToDatabase();
    const email = input.email.trim().toLowerCase();

    const existing = await Administrator.findOne({ email }).select("_id").lean();
    if (existing) {
        throw new Error("ADMINISTRATOR_ALREADY_EXISTS");
    }

    const created = await Administrator.create({
        name: input.name.trim(),
        email,
        passwordHash: hashPassword(input.password),
        role: input.role ?? "admin",
        status: input.status ?? "active",
        lastLoginAt: null,
    });

    return toSerializable(created.toObject() as AdministratorLean);
}

export async function updateAdministratorLastLogin(id: string): Promise<void> {
    await connectToDatabase();
    await Administrator.findByIdAndUpdate(id, { $set: { lastLoginAt: new Date() } });
}

export async function getAdministratorSessionVersion(id: string): Promise<number | null> {
    await connectToDatabase();
    const doc = await Administrator.findById(id).select("sessionVersion status").lean<{
        sessionVersion?: number;
        status?: string;
    } | null>();
    if (!doc || doc.status !== "active") {
        return null;
    }
    return Number(doc.sessionVersion ?? 1);
}

export async function incrementAdministratorSessionVersion(id: string): Promise<number> {
    await connectToDatabase();
    const updated = await Administrator.findByIdAndUpdate(
        id,
        { $inc: { sessionVersion: 1 } },
        { new: true },
    )
        .select("sessionVersion")
        .lean<{ sessionVersion?: number } | null>();
    return Number(updated?.sessionVersion ?? 1);
}

export async function revokeAllAdministratorSessions(id: string): Promise<number> {
    return incrementAdministratorSessionVersion(id);
}

export async function updateAdministratorPassword(
    id: string,
    passwordHash: string,
): Promise<void> {
    await connectToDatabase();
    await Administrator.findByIdAndUpdate(id, {
        $set: { passwordHash },
        $inc: { sessionVersion: 1 },
    });
}

export async function deactivateAdministrator(id: string): Promise<void> {
    await connectToDatabase();
    await Administrator.findByIdAndUpdate(id, {
        $set: { status: "inactive" },
        $inc: { sessionVersion: 1 },
    });
}

export async function updateAdministratorRole(
    id: string,
    role: AdministratorLean["role"],
): Promise<void> {
    await connectToDatabase();
    await Administrator.findByIdAndUpdate(id, {
        $set: { role },
        $inc: { sessionVersion: 1 },
    });
}
