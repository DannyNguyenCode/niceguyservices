import { DEMO_SPEC_VERSION } from "@/src/services/demo/constants";
import {
    buildDemoDesignSystem,
    resolvePlaceholderFields,
    resolveVerifiedFacts,
} from "@/src/services/demo/build-demo-design-system";
import { mapAuditOpportunities } from "@/src/services/demo/map-audit-opportunities";
import type {
    DemoApprovedFacts,
    DemoConfiguration,
    DemoContentPolicy,
    DemoSpecification,
    SerializableDemoAsset,
    SerializableDemoProject,
} from "@/src/services/demo/types";
import type { SerializablePublicReport } from "@/src/types/public-report";

function resolveHeroConcept(
    report: SerializablePublicReport,
    project: SerializableDemoProject,
): DemoSpecification["heroConcept"] {
    if (!project.configuration.useApprovedHeroConcept) return null;
    const heroId = project.selectedHeroSuggestionId;
    if (!heroId) return null;

    const hero = report.sourceSnapshot.heroSuggestions.find(
        (item) => item.suggestionId === heroId,
    );
    if (!hero) return null;

    const edited = project.editedHeroConcept;
    return {
        id: heroId,
        headline: edited?.headline?.trim() || hero.headline,
        supportingCopy: edited?.supportingCopy?.trim() || hero.supportingCopy,
        primaryCta: edited?.primaryCta?.trim() || hero.primaryCta.label,
        secondaryCta: edited?.secondaryCta?.trim() || hero.secondaryCta?.label || null,
        visualDirection: hero.designDirection.layout,
        rationale: hero.rationale,
    };
}

export function buildDemoSpec(input: {
    project: SerializableDemoProject;
    report: SerializablePublicReport;
    assets: SerializableDemoAsset[];
    businessFacts: {
        phone?: string | null;
        email?: string | null;
        services?: string[] | null;
    };
}): DemoSpecification {
    const { project, report, assets, businessFacts } = input;
    const approvedFacts = project.approvedFacts as DemoApprovedFacts;
    const configuration = project.configuration as DemoConfiguration;
    const contentPolicy = project.contentPolicy as DemoContentPolicy;

    const verifiedFacts = resolveVerifiedFacts(approvedFacts, {
        name: project.business.demoBusinessName,
        industry: project.business.industry,
        location: project.business.location,
        phone: businessFacts.phone,
        email: businessFacts.email,
        services: businessFacts.services,
        domain: project.business.domain,
    });

    const placeholderFields = resolvePlaceholderFields(approvedFacts, {
        name: project.business.demoBusinessName,
        industry: project.business.industry,
        location: project.business.location,
        phone: businessFacts.phone,
        email: businessFacts.email,
        services: businessFacts.services,
    });

    const designSystem = buildDemoDesignSystem({
        visualDirection: configuration.visualDirection,
        approvedBrandColours: approvedFacts.brandColours ? {} : null,
    });

    const categories = report.sourceSnapshot.niceGuy.categories;
    const strongestCategories = [...categories]
        .sort((a, b) => b.score - a.score)
        .slice(0, 2)
        .map((item) => item.name);
    const weakestCategories = [...categories]
        .sort((a, b) => a.score - b.score)
        .slice(0, 2)
        .map((item) => item.name);

    const approvedAssetIds = assets
        .filter((asset) => asset.approvedForDemo && asset.usageMode !== "do-not-use")
        .map((asset) => asset.id);

    return {
        schemaVersion: DEMO_SPEC_VERSION,
        project: {
            id: project.id,
            demoName: project.business.demoBusinessName,
            architecture: configuration.architecture,
            pages: configuration.pages,
            visualDirection: configuration.visualDirection,
            devicePriority: configuration.devicePriority,
            publicReportRevision: project.source.publicReportRevision,
        },
        business: {
            name: project.business.demoBusinessName,
            industry: approvedFacts.industry ? project.business.industry : null,
            location: approvedFacts.location ? project.business.location : null,
            verifiedFacts,
            placeholderFields,
        },
        sourceReport: {
            revision: project.source.publicReportRevision,
            snapshotChecksum: project.source.snapshotChecksum,
            overallScore: report.sourceSnapshot.niceGuy.overallScore,
            strongestCategories,
            weakestCategories,
        },
        opportunities: mapAuditOpportunities(report),
        heroConcept: resolveHeroConcept(report, project),
        designSystem,
        contentRules: {
            mode: contentPolicy.mode,
            approvedFactsOnly: contentPolicy.mode !== "placeholder-only",
            placeholdersRequired: placeholderFields.length > 0,
            inventedClaimsForbidden: contentPolicy.inventedClaimsForbidden,
            demoDisclaimerRequired: contentPolicy.disclaimerRequired,
        },
        assetRules: {
            approvedAssetIds,
            mayUseOriginalLogo: approvedFacts.logo && configuration.useExistingLogo,
            mayUseOriginalImages: approvedFacts.images && configuration.useExistingImages,
            generatePlaceholderImages: !approvedFacts.images,
        },
        technicalRequirements: {
            framework: "nextjs",
            language: "typescript",
            styling: "tailwind-daisyui",
            responsive: true,
            accessibility: true,
            productionFormsForbidden: true,
            analyticsForbidden: true,
            externalTrackingForbidden: true,
        },
        validationRules: {
            requiredPages: configuration.pages,
            requiredComponents: ["DemoBanner", "DemoDisclaimer", "DemoPlaceholder"],
            prohibitedClaims: [
                "guaranteed",
                "licensed and insured",
                "award-winning",
                "five-star",
                "best in",
                "number one",
                "24/7 emergency",
                "years of experience",
                "thousands of customers",
                "financing available",
            ],
            prohibitedIntegrations: [
                "analytics",
                "stripe",
                "mongodb",
                "resend",
                "next-auth",
                "production-forms",
            ],
        },
    };
}
