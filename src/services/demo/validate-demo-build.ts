import { DEMO_BANNER_TEXT, DEMO_DISCLAIMER_TEXT, DEMO_FORM_MESSAGE } from "@/src/services/demo/constants";
import { scanDemoSource } from "@/src/services/demo/scan-demo-source";

export type DemoBuildValidationResult = {
    passed: boolean;
    errors: Array<{ code: string; message: string; filePath?: string | null }>;
    warnings: Array<{ code: string; message: string; filePath?: string | null }>;
    buildStatus: "skipped" | "passed" | "failed";
    buildOutput: string | null;
};

function requiredRouteForPage(page: string): string | null {
    switch (page) {
        case "home":
            return "app/page.tsx";
        case "services":
            return "app/services/page.tsx";
        case "about":
            return "app/about/page.tsx";
        case "contact":
            return "app/contact/page.tsx";
        case "resources":
            return "app/resources/page.tsx";
        default:
            return null;
    }
}

export function validateDemoBuild(input: {
    files: Array<{ path: string; content: string }>;
    requiredPages: string[];
    approvedFactWhitelist?: string[];
}): DemoBuildValidationResult {
    const errors: DemoBuildValidationResult["errors"] = [];
    const warnings: DemoBuildValidationResult["warnings"] = [];
    const fileMap = new Map(input.files.map((file) => [file.path.replace(/\\/g, "/"), file.content]));
    const allContent = input.files.map((file) => file.content).join("\n");

    for (const page of input.requiredPages) {
        const route = requiredRouteForPage(page);
        if (!route) continue;
        if (!fileMap.has(route)) {
            errors.push({
                code: "DEMO_OUTPUT_MISSING",
                message: `Required route file missing: ${route}`,
                filePath: route,
            });
        }
    }

    const requiredComponents = [
        "components/DemoBanner.tsx",
        "components/DemoDisclaimer.tsx",
        "components/DemoPlaceholder.tsx",
    ];
    for (const componentPath of requiredComponents) {
        if (!fileMap.has(componentPath)) {
            errors.push({
                code: "DEMO_OUTPUT_MISSING",
                message: `Required component missing: ${componentPath}`,
                filePath: componentPath,
            });
        }
    }

    if (!allContent.includes(DEMO_BANNER_TEXT)) {
        errors.push({
            code: "DEMO_BANNER_MISSING",
            message: "Demo banner text is missing from generated source.",
        });
    }

    if (!allContent.includes(DEMO_DISCLAIMER_TEXT)) {
        errors.push({
            code: "DEMO_DISCLAIMER_MISSING",
            message: "Demo disclaimer text is missing from generated source.",
        });
    }

    if (!allContent.includes(DEMO_FORM_MESSAGE)) {
        warnings.push({
            code: "DEMO_FORM_MESSAGE_MISSING",
            message: "Demo form message was not found in generated source.",
        });
    }

    const scan = scanDemoSource({
        files: input.files,
        approvedFactWhitelist: input.approvedFactWhitelist,
    });
    errors.push(...scan.errors);
    warnings.push(...scan.warnings);

    return {
        passed: errors.length === 0,
        errors,
        warnings,
        buildStatus: "skipped",
        buildOutput: null,
    };
}
