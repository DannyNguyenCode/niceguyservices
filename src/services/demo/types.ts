export type DemoProjectStatus =
    | "draft"
    | "ready"
    | "generating"
    | "review"
    | "approved"
    | "rejected"
    | "archived";

export type DemoGenerationStatus =
    | "queued"
    | "preparing"
    | "generating"
    | "validating"
    | "complete"
    | "failed"
    | "cancelled";

export type DemoDeploymentState = "not-deployed" | "preview-private" | "preview-public" | "archived";

export type DemoPageKey = "home" | "services" | "about" | "contact" | "resources";

export type DemoArchitecture = "single-page" | "multi-page";

export type DemoVisualDirection =
    | "modern-professional"
    | "warm-trustworthy"
    | "bold-conversion"
    | "clean-minimal"
    | "custom";

export type DemoContentMode =
    | "placeholder-only"
    | "approved-facts-only"
    | "approved-facts-with-rewritten-copy";

export type DemoConfiguration = {
    architecture: DemoArchitecture;
    pages: DemoPageKey[];
    visualDirection: DemoVisualDirection;
    devicePriority: "mobile-first" | "balanced" | "desktop-showcase";
    includeAuditComparison: boolean;
    includeDemoBanner: boolean;
    includePlaceholderForms: boolean;
    includePlaceholderContactInfo: boolean;
    useApprovedHeroConcept: boolean;
    useExistingLogo: boolean;
    useExistingImages: boolean;
    customDirectionNotes?: string | null;
};

export type DemoApprovedFacts = {
    businessName: boolean;
    industry: boolean;
    location: boolean;
    services: boolean;
    contactInformation: boolean;
    logo: boolean;
    images: boolean;
    brandColours: boolean;
    existingCopyExcerpts: boolean;
    certifications: boolean;
    licences: boolean;
    insurance: boolean;
    awards: boolean;
    ratings: boolean;
    reviews: boolean;
    yearsInBusiness: boolean;
    emergencyAvailability: boolean;
    guarantees: boolean;
    financing: boolean;
    legalCompliance: boolean;
};

export type DemoContentPolicy = {
    mode: DemoContentMode;
    disclaimerRequired: boolean;
    inventedClaimsForbidden: boolean;
};

export type DemoSpecification = {
    schemaVersion: typeof import("@/src/services/demo/constants").DEMO_SPEC_VERSION;
    project: {
        id: string;
        demoName: string;
        architecture: DemoArchitecture;
        pages: string[];
        visualDirection: string;
        devicePriority: string;
        publicReportRevision: number;
    };
    business: {
        name: string;
        industry?: string | null;
        location?: string | null;
        verifiedFacts: Record<string, unknown>;
        placeholderFields: string[];
    };
    sourceReport: {
        revision: number;
        snapshotChecksum: string;
        overallScore?: number | null;
        strongestCategories: string[];
        weakestCategories: string[];
    };
    opportunities: Array<{
        id: string;
        category: string;
        title: string;
        description: string;
        priority: string;
        evidenceCheckIds: string[];
        demoImplementation: string;
    }>;
    heroConcept?: {
        id: string;
        headline: string;
        supportingCopy: string;
        primaryCta: string;
        secondaryCta?: string | null;
        visualDirection?: string | null;
        rationale?: string | null;
    } | null;
    designSystem: {
        palette: Record<string, string>;
        typography: {
            headingFamily: string;
            bodyFamily: string;
            scale: string;
        };
        spacing: string;
        radius: string;
        elevation: string;
    };
    contentRules: {
        mode: string;
        approvedFactsOnly: boolean;
        placeholdersRequired: boolean;
        inventedClaimsForbidden: boolean;
        demoDisclaimerRequired: boolean;
    };
    assetRules: {
        approvedAssetIds: string[];
        mayUseOriginalLogo: boolean;
        mayUseOriginalImages: boolean;
        generatePlaceholderImages: boolean;
    };
    technicalRequirements: {
        framework: "nextjs";
        language: "typescript";
        styling: "tailwind-daisyui";
        responsive: boolean;
        accessibility: boolean;
        productionFormsForbidden: boolean;
        analyticsForbidden: boolean;
        externalTrackingForbidden: boolean;
    };
    validationRules: {
        requiredPages: string[];
        requiredComponents: string[];
        prohibitedClaims: string[];
        prohibitedIntegrations: string[];
    };
};

export type SerializableDemoProject = {
    id: string;
    websiteId: string;
    publicReportId: string;
    aiSummaryId: string | null;
    status: DemoProjectStatus;
    deploymentState: DemoDeploymentState;
    demoGenerationVersion: string;
    demoSpecVersion: string;
    previewTokenPrefix: string | null;
    previewPath: string | null;
    source: {
        publicReportVersion: string;
        publicReportRevision: number;
        snapshotChecksum: string;
        heroSuggestionIds: string[];
        screenshotIds: string[];
    };
    business: {
        originalBusinessName: string | null;
        demoBusinessName: string;
        domain: string | null;
        industry: string | null;
        location: string | null;
    };
    configuration: DemoConfiguration;
    approvedFacts: DemoApprovedFacts;
    contentPolicy: DemoContentPolicy;
    selectedHeroSuggestionId: string | null;
    editedHeroConcept: {
        headline: string;
        supportingCopy: string;
        primaryCta: string;
        secondaryCta: string | null;
    } | null;
    currentGenerationId: string | null;
    rejectionReason: string | null;
    rejectionNotes: string | null;
    approvedAt: string | null;
    rejectedAt: string | null;
    archivedAt: string | null;
    createdAt: string;
    updatedAt: string;
};

export type SerializableDemoGeneration = {
    id: string;
    demoProjectId: string;
    websiteId: string;
    publicReportId: string;
    status: DemoGenerationStatus;
    generationVersion: string;
    specVersion: string;
    source: {
        snapshotChecksum: string;
        publicReportRevision: number;
        heroSuggestionIds: string[];
        screenshotIds: string[];
    };
    provider: {
        name: string;
        model: string | null;
        providerRequestId: string | null;
        providerRunUrl: string | null;
    };
    workspace: {
        repository: string | null;
        branch: string | null;
        commitSha: string | null;
        outputPath: string | null;
    };
    output: {
        framework: string | null;
        packageManager: string | null;
        pagesGenerated: string[];
        componentsGenerated: string[];
        filesChanged: string[];
        previewUrl: string | null;
        buildStatus: string | null;
        buildOutput: string | null;
    };
    validation: {
        passed: boolean;
        errors: Array<{ code: string; message: string; filePath?: string | null }>;
        warnings: Array<{ code: string; message: string; filePath?: string | null }>;
    };
    startedAt: string | null;
    completedAt: string | null;
    durationMs: number | null;
    errorCode: string | null;
    errorMessage: string | null;
    createdAt: string;
    updatedAt: string;
};

export type SerializableDemoAsset = {
    id: string;
    demoProjectId: string;
    demoGenerationId: string | null;
    type:
        | "logo"
        | "screenshot"
        | "reference-image"
        | "generated-image"
        | "icon"
        | "font-reference"
        | "content-file";
    source: "audit" | "administrator" | "generated" | "placeholder";
    originalAssetId: string | null;
    provider: string | null;
    secureUrl: string | null;
    publicId: string | null;
    filename: string | null;
    mimeType: string | null;
    bytes: number | null;
    approvedForDemo: boolean;
    usageMode: "reference-only" | "comparison" | "demo-content" | "do-not-use";
    usageNotes: string | null;
    label: string | null;
    pageType: string | null;
    createdAt: string;
    updatedAt: string;
};

export type DemoReadiness = {
    canCreateProject: boolean;
    canGenerate: boolean;
    blockers: Array<{ code: string; message: string }>;
    warnings: Array<{ code: string; message: string }>;
    availableHeroSuggestions: Array<{ id: string; title: string; status: string }>;
    availableScreenshots: Array<{
        id: string;
        label: string;
        pageType: string;
        secureUrl: string;
    }>;
    supportedPages: string[];
    supportedFacts: string[];
};
