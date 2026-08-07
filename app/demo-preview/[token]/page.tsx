import { notFound } from "next/navigation";
import { DemoDisclaimerFooter } from "@/components/websiteAudit/DemoPlaceholder";
import RateLimitAlert from "@/components/websiteAudit/RateLimitAlert";
import { getDemoGenerationsForProject } from "@/src/data/demo-generations";
import { getDemoProjectByPreviewTokenHash } from "@/src/data/demo-projects";
import { getPublicReportById } from "@/src/data/public-reports";
import {
    DEMO_BANNER_TEXT,
    DEMO_DISCLAIMER_TEXT,
} from "@/src/services/demo/constants";
import {
    hashDemoPreviewToken,
    isValidDemoPreviewTokenFormat,
} from "@/src/services/demo/hash-demo-preview-token";
import { enforcePublicDemoViewRateLimit } from "@/src/services/rate-limit/enforce-public-rate-limit";
import {
    getPublicRateLimitMessage,
    getRequestFromHeaders,
} from "@/src/services/rate-limit/public-page-rate-limit";

export const dynamic = "force-dynamic";

export const metadata = {
    robots: { index: false, follow: false },
};

export default async function DemoPreviewPage({
    params,
}: {
    params: Promise<{ token: string }>;
}) {
    const { token } = await params;

    try {
        const request = await getRequestFromHeaders();
        await enforcePublicDemoViewRateLimit({ request, rawToken: token });
    } catch (error) {
        const message = getPublicRateLimitMessage(error);
        if (message) {
            return (
                <div className="min-h-screen bg-base-100 px-4 py-10">
                    <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6">
                        <RateLimitAlert message={message} />
                        <p className="text-sm text-base-content/70">Demonstration preview unavailable.</p>
                    </div>
                </div>
            );
        }
        throw error;
    }

    if (!isValidDemoPreviewTokenFormat(token)) {
        notFound();
    }

    const project = await getDemoProjectByPreviewTokenHash(hashDemoPreviewToken(token));
    if (!project || project.deploymentState === "archived") {
        notFound();
    }

    const [report, generations] = await Promise.all([
        getPublicReportById(project.publicReportId),
        getDemoGenerationsForProject(project.id),
    ]);
    const generation = generations.find((item) => item.status === "complete") ?? generations[0];

    return (
        <div className="min-h-screen bg-base-100 text-base-content">
            <div className="sticky top-0 z-50 border-b border-base-300 bg-warning/20 px-4 py-3">
                <p className="font-medium">{DEMO_BANNER_TEXT}</p>
                <p className="text-sm opacity-80">
                    Generated from Website Audit Revision {project.source.publicReportRevision}
                </p>
            </div>

            <main className="mx-auto grid max-w-4xl grid-cols-1 gap-8 px-4 py-10">
                <header>
                    <p className="text-sm text-base-content/70">Demonstration preview</p>
                    <h1 className="text-3xl font-semibold">{project.business.demoBusinessName}</h1>
                    <p className="mt-3 text-base text-base-content/75">
                        This is a private demonstration concept. It is not the prospect&apos;s live
                        website.
                    </p>
                </header>

                <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <article className="rounded-xl bg-base-200 p-4 shadow-sm">
                        <h2 className="text-sm font-medium">Configuration</h2>
                        <p className="mt-2 text-sm">Architecture: {project.configuration.architecture}</p>
                        <p className="text-sm">
                            Pages: {project.configuration.pages.join(", ")}
                        </p>
                        <p className="text-sm">
                            Visual direction: {project.configuration.visualDirection}
                        </p>
                    </article>
                    <article className="rounded-xl bg-base-200 p-4 shadow-sm">
                        <h2 className="text-sm font-medium">Generation</h2>
                        <p className="mt-2 text-sm">
                            Status: {generation?.status ?? project.status}
                        </p>
                        <p className="text-sm">Provider: {generation?.provider.name ?? "—"}</p>
                        <p className="text-sm">
                            Build: {generation?.output.buildStatus ?? "pending"}
                        </p>
                    </article>
                </section>

                {report ? (
                    <section className="rounded-xl bg-base-200 p-4 shadow-sm">
                        <h2 className="text-sm font-medium">Audit source</h2>
                        <p className="mt-2 text-sm">
                            Overall score: {report.sourceSnapshot.niceGuy.overallScore}
                        </p>
                        <p className="text-sm">
                            Snapshot checksum prefix: {project.source.snapshotChecksum.slice(0, 12)}
                        </p>
                    </section>
                ) : null}

                <DemoDisclaimerFooter />
                <p className="text-xs text-base-content/60">{DEMO_DISCLAIMER_TEXT}</p>
            </main>
        </div>
    );
}
