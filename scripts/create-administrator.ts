/**
 * Create or update a Website Audit administrator account.
 *
 * Usage:
 *   npm run admin:create -- --email you@example.com --name "Your Name" --password "secret"
 *
 * Environment:
 *   AUTH_SECRET must be configured.
 *   ADMIN_PASSWORD may be used instead of --password (never logged).
 */

import { createAdministrator, getAdministratorByEmail } from "../src/data/administrators";
import { isAuthConfigured } from "../src/lib/auth/config";
import { assertPasswordUsable } from "../src/lib/auth/password";
import { AuthValidationError } from "../src/lib/errors/audit-platform-error";
function readArg(flag: string): string | undefined {
    const index = process.argv.indexOf(flag);
    if (index === -1) return undefined;
    return process.argv[index + 1]?.trim();
}

async function main() {
    if (!isAuthConfigured()) {
        console.error("FAIL authentication: AUTH_SECRET is not configured.");
        process.exit(1);
    }

    const email = readArg("--email") ?? process.env.ADMIN_EMAIL?.trim();
    const name = readArg("--name") ?? process.env.ADMIN_NAME?.trim();
    const password = readArg("--password") ?? process.env.ADMIN_PASSWORD?.trim();
    const role = (readArg("--role") ?? process.env.ADMIN_ROLE?.trim() ?? "owner") as
        | "owner"
        | "admin";
    const status = (readArg("--status") ?? process.env.ADMIN_STATUS?.trim() ?? "active") as
        | "active"
        | "inactive";

    if (!email || !name || !password) {
        console.error(
            "Usage: npm run admin:create -- --email EMAIL --name NAME --password PASSWORD [--role owner|admin]",
        );
        process.exit(1);
    }

    try {
        assertPasswordUsable(password);
    } catch (error) {
        console.error(
            "FAIL password:",
            error instanceof AuthValidationError ? error.message : "Invalid password.",
        );
        process.exit(1);
    }

    const existing = await getAdministratorByEmail(email);
    if (existing) {
        console.log("OK  administrator already exists");
        console.log(`ID ${String(existing._id)}`);
        console.log(`EMAIL ${existing.email}`);
        console.log(`ROLE ${existing.role}`);
        console.log(`STATUS ${existing.status}`);
        return;
    }

    const created = await createAdministrator({
        email,
        name,
        password,
        role,
        status,
    });

    console.log("OK  administrator created");
    console.log(`ID ${created.id}`);
    console.log(`EMAIL ${created.email}`);
    console.log(`ROLE ${created.role}`);
    console.log(`STATUS ${created.status}`);
}

main().catch((error) => {
    if (error instanceof Error && error.message === "ADMINISTRATOR_ALREADY_EXISTS") {
        console.log("OK  administrator already exists");
        process.exit(0);
    }
    console.error("FAIL administrator creation:", error instanceof Error ? error.message : String(error));
    process.exit(1);
});
