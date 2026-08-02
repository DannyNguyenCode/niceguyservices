import { spawnSync } from "node:child_process";

process.env.PLAYWRIGHT_BROWSERS_PATH = "0";

const command = process.platform === "win32" ? "npx.cmd" : "npx";
const result = spawnSync(command, ["playwright", "install", "chromium"], {
    stdio: "inherit",
    env: process.env,
    shell: process.platform === "win32",
});

process.exit(result.status ?? 1);
