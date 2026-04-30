export type IntakeStep = 1 | 2 | 3;

export type ScopePricingModel = "flat" | "hourly" | "range" | "square-footage";

export type ScopeLine = {
    id: string;
    name: string;
    description: string;
    pricingModel: ScopePricingModel;
    rate: string;
};

export type VisualStyle = "modern" | "professional" | "creative" | "";

export type BusinessIntakeData = {
    company: {
        businessName: string;
        industry: string;
        yearsInOperation: string;
        location: string;
    };
    scopeLines: ScopeLine[];
    goals: {
        seo: boolean;
        leads: boolean;
        brand: boolean;
        performance: boolean;
    };
    visualStyle: VisualStyle;
    additionalPages: string[];
};

export const DRAFT_KEY = "ng-business-intake-draft-v1";

export function newScopeLine(overrides?: Partial<ScopeLine>): ScopeLine {
    return {
        id: crypto.randomUUID(),
        name: "",
        description: "",
        pricingModel: "flat",
        rate: "",
        ...overrides,
    };
}

export function defaultIntakeData(): BusinessIntakeData {
    return {
        company: {
            businessName: "",
            industry: "",
            yearsInOperation: "",
            location: "",
        },
        scopeLines: [newScopeLine(), newScopeLine({ pricingModel: "hourly" })],
        goals: {
            seo: false,
            leads: false,
            brand: false,
            performance: false,
        },
        visualStyle: "professional",
        additionalPages: [],
    };
}
