import "server-only";

import {
    createAdministrator,
    getAdministratorByEmail,
    updateAdministratorPassword,
} from "@/src/data/administrators";
import { assertPasswordUsable, hashPassword, verifyPassword } from "@/src/lib/auth/password";

function readEnvAdministratorConfig(): {
    email: string;
    password: string;
    name: string;
} | null {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD?.trim();
    const name = process.env.ADMIN_NAME?.trim() || "Administrator";

    if (!email || !password) {
        return null;
    }

    try {
        assertPasswordUsable(password);
    } catch {
        return null;
    }

    return { email, password, name };
}

/**
 * Keep the MongoDB administrator record aligned with ADMIN_EMAIL / ADMIN_PASSWORD
 * from the environment when those variables are configured.
 */
export async function ensureEnvAdministrator(): Promise<void> {
    const config = readEnvAdministratorConfig();
    if (!config) {
        return;
    }

    const existing = await getAdministratorByEmail(config.email);
    if (!existing) {
        await createAdministrator({
            email: config.email,
            name: config.name,
            password: config.password,
            role: "owner",
            status: "active",
        });
        return;
    }

    if (!verifyPassword(config.password, existing.passwordHash)) {
        await updateAdministratorPassword(existing._id.toString(), hashPassword(config.password));
    }
}

export function getEnvAdministratorEmailForLoginForm(): string | null {
    return readEnvAdministratorConfig()?.email ?? null;
}
