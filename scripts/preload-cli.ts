import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import Module from "node:module";

const originalLoad = (Module as unknown as { _load: Function })._load;
(Module as unknown as { _load: Function })._load = function (
    request: string,
    parent: unknown,
    isMain: boolean,
) {
    if (request === "server-only") {
        return {};
    }
    return originalLoad.call(this, request, parent, isMain);
};

function loadEnvFile(filename: string): void {
    const filePath = resolve(process.cwd(), filename);
    if (!existsSync(filePath)) {
        return;
    }

    const lines = readFileSync(filePath, "utf8").split(/\r?\n/);
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const index = trimmed.indexOf("=");
        if (index === -1) continue;
        const key = trimmed.slice(0, index).trim();
        let value = trimmed.slice(index + 1).trim();
        if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
        ) {
            value = value.slice(1, -1);
        }
        if (!(key in process.env) || !process.env[key]?.trim()) {
            process.env[key] = value;
        }
    }
}

loadEnvFile(".env");
loadEnvFile(".env.local");
