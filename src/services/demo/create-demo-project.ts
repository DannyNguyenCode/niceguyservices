import "server-only";

import { createActivityLog } from "@/src/data/activity-logs";
import { registerAuditReference } from "@/src/services/audit-history/register-audit-reference";
import { createDemoProject, getDemoProjectsForWebsite } from "@/src/data/demo-projects";
import { seedDemoAssetsFromReport } from "@/src/data/demo-assets";
import { getPublicReportById } from "@/src/data/public-reports";
import { getWebsiteById, updateWebsiteDemoProjectSummary } from "@/src/data/websites";
import { calculateSnapshotChecksum } from "@/src/services/pdf-reports/calculate-snapshot-checksum";
import { resolveDefaultContentMode } from "@/src/services/demo/build-demo-design-system";
import { evaluateDemoReadiness } from "@/src/services/demo/get-demo-readiness";
import { generateDemoPreviewToken } from "@/src/services/demo/hash-demo-preview-token";
import type {
    DemoApprovedFacts,
    DemoConfiguration,
    DemoContentPolicy,
    SerializableDemoProject,
} from "@/src/services/demo/types";

export type CreateDemoProjectResult =
    | { success: true; project: SerializableDemoProject; previewToken: string }
    | { success: false; error: { code: string; message: string } };

export async function createDemoProjectFromReport(input: {
    publicReportId: string;
    configuration?: Partial<DemoConfiguration>;
    approvedFacts?: Partial<DemoApprovedFacts>;
    contentPolicy?: Partial<DemoContentPolicy>;
    selectedHeroSuggestionId?: string | null;
    editedHeroConcept?: {
        headline: string;
        supportingCopy: string;
        primaryCta: string;
        secondaryCta?: string | null;
    } | null;
    demoBusinessName?: string | null;
}): Promise<CreateDemoProjectResult> {
    const report = await getPublicReportById(input.publicReportId);
    if (!report) {
        return {
            success: false,
            error: { code: "DEMO_REPORT_NOT_FOUND", message: "Public report not found." },
        };
    }

    const website = await getWebsiteById(report.websiteId);
    if (!website || website.deletedAt) {
        return {
            success: false,
            error: { code: "DEMO_WEBSITE_NOT_FOUND", message: "Website not found." },
        };
    }

    const readiness = evaluateDemoReadiness({
        report,
        websiteActive: !website.deletedAt,
        selectedPages: input.configuration?.pages,
        contentPolicySelected: true,
    });

    if (!readiness.canCreateProject) {
        return {
            success: false,
            error: {
                code: readiness.blockers[0]?.code ?? "DEMO_SOURCE_INCOMPLETE",
                message: readiness.blockers[0]?.message ?? "Demo project cannot be created.",
            },
        };
    }

    const checksum = calculateSnapshotChecksum(report);
    const preview = generateDemoPreviewToken();
    const businessName =
        input.demoBusinessName?.trim() ||
        report.branding.businessName?.trim() ||
        website.businessName?.trim() ||
        report.branding.normalizedDomain ||
        "[Business Name]";

    const approvedFacts = {
        businessName: true,
        industry: Boolean(report.branding.industry),
        location: Boolean(report.branding.location),
        ...input.approvedFacts,
    } as Partial<DemoApprovedFacts>;

    const verifiedFacts = {
        businessName: approvedFacts.businessName ? businessName : undefined,
        industry: approvedFacts.industry ? report.branding.industry : undefined,
        location: approvedFacts.location ? report.branding.location : undefined,
    };

    const contentPolicy: Partial<DemoContentPolicy> = {
        mode:
            input.contentPolicy?.mode ??
            resolveDefaultContentMode(approvedFacts as DemoApprovedFacts, verifiedFacts),
        ...input.contentPolicy,
    };

    const project = await createDemoProject({
        websiteId: report.websiteId,
        publicReportId: report.id,
        aiSummaryId: report.aiSummaryId,
        sourceAuditRunId: report.sourceAuditRunId ?? report.auditRunId,
        sourceAuditNumber: report.sourceAuditNumber,
        previewTokenHash: preview.tokenHash,
        previewTokenPrefix: preview.tokenPrefix,
        previewPath: `/demo-preview/${preview.rawToken}`,
        source: {
            publicReportVersion: report.reportVersion,
            publicReportRevision: report.revisionNumber,
            snapshotChecksum: checksum,
            heroSuggestionIds: input.selectedHeroSuggestionId ? [input.selectedHeroSuggestionId] : [],
            screenshotIds: report.sourceSnapshot.screenshots.map((shot) => shot.screenshotId),
        },
        business: {
            originalBusinessName: report.branding.businessName,
            demoBusinessName: businessName,
            domain: report.branding.normalizedDomain,
            industry: report.branding.industry,
            location: report.branding.location,
        },
        configuration: input.configuration,
        approvedFacts,
        contentPolicy,
        selectedHeroSuggestionId: input.selectedHeroSuggestionId ?? null,
        editedHeroConcept: input.editedHeroConcept
            ? {
                  ...input.editedHeroConcept,
                  secondaryCta: input.editedHeroConcept.secondaryCta ?? null,
              }
            : null,
    });

    const sourceAuditRunId = report.sourceAuditRunId ?? report.auditRunId;
    if (sourceAuditRunId) {
        await registerAuditReference({
            auditRunId: sourceAuditRunId,
            resourceType: "demo-project",
            resourceId: project.id,
        });
    }

    await seedDemoAssetsFromReport({
        demoProjectId: project.id,
        screenshots: report.sourceSnapshot.screenshots.map((shot) => ({
            screenshotId: shot.screenshotId,
            secureUrl: shot.secureUrl,
            pageType: shot.pageType,
            altText: shot.altText,
        })),
        logoUrl: report.branding.logoUrl,
    });

    await updateWebsiteDemoProjectSummary(report.websiteId, "draft", new Date());

    await createActivityLog({
        websiteId: report.websiteId,
        type: "demo-project-created",
        description: `Demo project created from public report revision ${report.revisionNumber}.`,
        metadata: {
            demoProjectId: project.id,
            publicReportId: report.id,
            publicReportRevision: report.revisionNumber,
            generationVersion: project.demoGenerationVersion,
            specVersion: project.demoSpecVersion,
        },
    });

    const existing = await getDemoProjectsForWebsite(report.websiteId);
    if (existing.length === 1) {
        // first project only
    }

    return { success: true, project, previewToken: preview.rawToken };
}
