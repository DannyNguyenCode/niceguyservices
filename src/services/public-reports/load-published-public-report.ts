import "server-only";

import { getPublicReportByTokenHash, incrementPublicReportView } from "@/src/data/public-reports";
import { hashReportToken, isValidReportTokenFormat } from "@/src/services/public-reports/hash-report-token";
import {
    isPublicReportAccessible,
} from "@/src/services/public-reports/validate-public-report-sources";
import type { SerializablePublicReport } from "@/src/types/public-report";

export async function getPublishedPublicReportByToken(
    rawToken: string,
): Promise<SerializablePublicReport | null> {
    if (!isValidReportTokenFormat(rawToken)) {
        return null;
    }

    const tokenHash = hashReportToken(rawToken);
    const report = await getPublicReportByTokenHash(tokenHash);
    if (!report || !isPublicReportAccessible(report)) {
        return null;
    }

    return report;
}

export async function loadPublishedPublicReportByToken(
    rawToken: string,
): Promise<SerializablePublicReport | null> {
    const report = await getPublishedPublicReportByToken(rawToken);
    if (!report) {
        return null;
    }

    try {
        await incrementPublicReportView(report.id);
    } catch (error) {
        console.warn("Public report view tracking failed:", error);
    }

    return report;
}
