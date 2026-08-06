import "server-only";

import {
    listPublishedReportsForBusinessEmail,
    type CustomerLookupReport,
} from "@/src/data/report-lookup-reports";
import {
    readReportLookupSessionFromCookies,
    type ReportLookupSession,
} from "@/src/services/report-lookup/lookup-session";

export type ListLookupReportsResult = {
    reports: CustomerLookupReport[];
    session: ReportLookupSession;
};

export class ReportLookupUnauthorizedError extends Error {
    readonly status = 401;

    constructor(message = "Please verify your email to view your reports.") {
        super(message);
        this.name = "ReportLookupUnauthorizedError";
    }
}

/**
 * List published reports for the authenticated lookup session identity.
 * Does not accept a client-supplied email — session email is authoritative.
 */
export async function listAuthenticatedLookupReports(deps?: {
    readSession?: typeof readReportLookupSessionFromCookies;
    listReports?: typeof listPublishedReportsForBusinessEmail;
}): Promise<ListLookupReportsResult> {
    const readSession = deps?.readSession ?? readReportLookupSessionFromCookies;
    const listReports = deps?.listReports ?? listPublishedReportsForBusinessEmail;

    const session = await readSession();
    if (!session) {
        throw new ReportLookupUnauthorizedError();
    }

    const reports = await listReports(session.normalizedEmail);
    return { reports, session };
}
