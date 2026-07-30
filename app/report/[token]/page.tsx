import type { Metadata } from "next";
import PublicReportUnavailable from "@/components/public-report/public-report-unavailable";
import PublicReportView from "@/components/public-report/public-report-view";
import RateLimitAlert from "@/components/websiteAudit/RateLimitAlert";
import {
    getPublishedPublicReportByToken,
    loadPublishedPublicReportByToken,
} from "@/src/services/public-reports/load-published-public-report";
import { enforcePublicReportViewRateLimit } from "@/src/services/rate-limit/enforce-public-rate-limit";
import {
    getPublicRateLimitMessage,
    getRequestFromHeaders,
} from "@/src/services/rate-limit/public-page-rate-limit";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function headers() {
    return {
        "Cache-Control": "private, no-store",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
    };
}

type PageProps = {
    params: Promise<{ token: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { token } = await params;
    const report = await getPublishedPublicReportByToken(token);
    const businessName =
        report?.branding.businessName?.trim() ||
        report?.branding.normalizedDomain ||
        "Website";

    return {
        title: report ? `Website Audit for ${businessName}` : "Report unavailable",
        description:
            "A website performance, clarity, trust, usability, and conversion audit prepared by Nice Guy Web Design.",
        robots: {
            index: false,
            follow: false,
            nocache: true,
        },
    };
}

export default async function PublicReportPage({ params }: PageProps) {
    const { token } = await params;
    const request = await getRequestFromHeaders();

    try {
        await enforcePublicReportViewRateLimit({ request, rawToken: token });
    } catch (error) {
        const message = getPublicRateLimitMessage(error);
        if (message) {
            return (
                <main className="mx-auto grid max-w-3xl grid-cols-1 gap-6 px-4 py-10">
                    <RateLimitAlert message={message} />
                    <PublicReportUnavailable />
                </main>
            );
        }
        throw error;
    }

    const report = await loadPublishedPublicReportByToken(token);

    if (!report) {
        return <PublicReportUnavailable />;
    }

    return (
        <main>
            <PublicReportView report={report} mode="public" />
        </main>
    );
}
