import type { SerializablePublicReport } from "@/src/types/public-report";
import { countSupportedDemoOpportunities } from "@/src/services/demo/map-audit-opportunities";
import { isDemoProviderConfigured, getDemoTemplateRepository } from "@/src/services/demo/env";
import { isPublicReportSnapshotComplete } from "@/src/services/pdf-reports/get-pdf-readiness";
import type { DemoReadiness } from "@/src/services/demo/types";

const ALLOWED_STATUSES = new Set(["draft", "published", "unpublished", "archived"]);

const SUPPORTED_PAGES = ["home", "services", "about", "contact", "resources"];
const SUPPORTED_FACTS = [
    "businessName",
    "industry",
    "location",
    "services",
    "contactInformation",
    "logo",
    "images",
    "brandColours",
    "existingCopyExcerpts",
];

export function evaluateDemoReadiness(input: {
    report: SerializablePublicReport | null;
    websiteActive: boolean;
    allowArchived?: boolean;
    selectedPages?: string[];
    contentPolicySelected?: boolean;
    activeGeneration?: boolean;
}): DemoReadiness {
    const blockers: DemoReadiness["blockers"] = [];
    const warnings: DemoReadiness["warnings"] = [];

    if (!input.websiteActive) {
        blockers.push({ code: "WEBSITE_INACTIVE", message: "Website is not active." });
    }

    if (!input.report) {
        blockers.push({ code: "REPORT_NOT_FOUND", message: "Public report not found." });
        return emptyReadiness(blockers, warnings);
    }

    if (input.report.status === "archived" && !input.allowArchived) {
        blockers.push({
            code: "REPORT_ARCHIVED",
            message: "Archived reports require explicit confirmation.",
        });
    } else if (!ALLOWED_STATUSES.has(input.report.status)) {
        blockers.push({
            code: "REPORT_STATUS_INVALID",
            message: "Public report status does not allow demo generation.",
        });
    }

    if (!isPublicReportSnapshotComplete(input.report)) {
        blockers.push({
            code: "SNAPSHOT_INCOMPLETE",
            message: "Public-report snapshot incomplete.",
        });
    }

    const opportunityCount = countSupportedDemoOpportunities(input.report);
    if (opportunityCount === 0) {
        blockers.push({
            code: "NO_SUPPORTED_OPPORTUNITIES",
            message: "No supported design or conversion opportunities are available.",
        });
    }

    if (input.selectedPages && input.selectedPages.length === 0) {
        blockers.push({
            code: "NO_PAGES_SELECTED",
            message: "No pages selected.",
        });
    }

    if (input.contentPolicySelected === false) {
        blockers.push({
            code: "NO_CONTENT_POLICY",
            message: "No content policy selected.",
        });
    }

    if (!isDemoProviderConfigured()) {
        blockers.push({
            code: "PROVIDER_NOT_CONFIGURED",
            message: "Generation provider not configured.",
        });
    }

    const providerName = process.env.DEMO_GENERATION_PROVIDER?.trim() || "local";
    if (providerName === "cursor-cloud-agent" && !getDemoTemplateRepository()) {
        blockers.push({
            code: "WORKSPACE_NOT_CONFIGURED",
            message: "Template repository not configured.",
        });
    }

    if (input.activeGeneration) {
        blockers.push({
            code: "ALREADY_RUNNING",
            message: "Demo generation is already running for this project.",
        });
    }

    const heroes = input.report.sourceSnapshot.heroSuggestions.map((hero) => ({
        id: hero.suggestionId,
        title: hero.conceptName || hero.headline,
        status: "available",
    }));
    if (heroes.length === 0) {
        warnings.push({
            code: "NO_APPROVED_HERO",
            message: "No approved hero concept.",
        });
    }

    const screenshots = input.report.sourceSnapshot.screenshots.map((shot) => ({
        id: shot.screenshotId,
        label: shot.altText || shot.pageType,
        pageType: shot.pageType,
        secureUrl: shot.secureUrl,
    }));
    if (screenshots.length === 0) {
        warnings.push({
            code: "NO_APPROVED_SCREENSHOTS",
            message: "No approved screenshots.",
        });
    }

    if (!input.report.branding.logoUrl) {
        warnings.push({ code: "NO_LOGO", message: "No logo approved." });
    }
    if (!input.report.branding.location) {
        warnings.push({ code: "NO_VERIFIED_LOCATION", message: "No verified location." });
    }

    warnings.push({
        code: "PLACEHOLDERS_LIKELY",
        message: "Demo will use placeholders for unapproved facts.",
    });

    const canCreateProject =
        blockers.filter((item) =>
            ["REPORT_NOT_FOUND", "SNAPSHOT_INCOMPLETE", "WEBSITE_INACTIVE"].includes(item.code),
        ).length === 0 && opportunityCount > 0;

    const canGenerate = blockers.length === 0;

    return {
        canCreateProject,
        canGenerate,
        blockers,
        warnings,
        availableHeroSuggestions: heroes,
        availableScreenshots: screenshots,
        supportedPages: SUPPORTED_PAGES,
        supportedFacts: SUPPORTED_FACTS,
    };
}

function emptyReadiness(
    blockers: DemoReadiness["blockers"],
    warnings: DemoReadiness["warnings"],
): DemoReadiness {
    return {
        canCreateProject: false,
        canGenerate: false,
        blockers,
        warnings,
        availableHeroSuggestions: [],
        availableScreenshots: [],
        supportedPages: SUPPORTED_PAGES,
        supportedFacts: SUPPORTED_FACTS,
    };
}
