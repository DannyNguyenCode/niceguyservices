import { createHash } from "crypto";
import type { SerializablePublicReport } from "@/src/types/public-report";

function stableSerialize(value: unknown): string {
    if (value === null || value === undefined) {
        return "null";
    }
    if (Array.isArray(value)) {
        return `[${value.map((item) => stableSerialize(item)).join(",")}]`;
    }
    if (typeof value === "object") {
        const record = value as Record<string, unknown>;
        const keys = Object.keys(record).sort();
        return `{${keys.map((key) => `${JSON.stringify(key)}:${stableSerialize(record[key])}`).join(",")}}`;
    }
    return JSON.stringify(value);
}

export function getPdfChecksumInput(report: SerializablePublicReport) {
    return {
        reportVersion: report.reportVersion,
        revisionNumber: report.revisionNumber,
        title: report.title,
        subtitle: report.subtitle,
        settings: report.settings,
        branding: report.branding,
        sourceSnapshot: report.sourceSnapshot,
    };
}

export function calculateSnapshotChecksum(report: SerializablePublicReport): string {
    const payload = stableSerialize(getPdfChecksumInput(report));
    return createHash("sha256").update(payload).digest("hex");
}
