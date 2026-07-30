import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

export const VALID_OBJECT_ID = "507f1f77bcf86cd799439011";
export const VALID_OBJECT_ID_2 = "507f1f77bcf86cd799439012";

export function projectPath(...segments: string[]): string {
    return resolve(process.cwd(), ...segments);
}

export function assertFileExists(relativePath: string): void {
    assert.equal(
        existsSync(projectPath(relativePath)),
        true,
        `Expected file to exist: ${relativePath}`,
    );
}

export function assertThrows(fn: () => unknown, messageIncludes?: string): void {
    assert.throws(
        fn,
        messageIncludes
            ? (error: unknown) =>
                  error instanceof Error && error.message.includes(messageIncludes)
            : undefined,
    );
}
