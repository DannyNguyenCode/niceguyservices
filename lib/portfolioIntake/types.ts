export type PortfolioIntakeStep = 1 | 2 | 3 | 4;

export type ImpactMetric = {
    id: string;
    label: string;
    value: string;
};

export type WorkEntry = {
    id: string;
    jobTitle: string;
    company: string;
    startMonth: string;
    endMonth: string;
    present: boolean;
    description: string;
    /** Metrics captured from the “Key impacts” panel when this role was added. */
    impacts: ImpactMetric[];
};

export type SkillCategory = {
    id: string;
    name: string;
    description: string;
    tools: string[];
    idiom: string;
};

export type EducationEntry = {
    id: string;
    institution: string;
    degree: string;
    graduationYear: string;
    thesis: string;
    honors: string[];
    curriculum: string[];
};

export type ContactReview = {
    fullName: string;
    professionalTitle: string;
    summary: string;
    location: string;
    availability: string;
    email: string;
    linkedin: string;
    social: string;
};

export type PortfolioIntakeData = {
    experience: {
        entries: WorkEntry[];
        /** Draft key impacts for the role you are about to add (cleared on “Add to timeline”). */
        impacts: ImpactMetric[];
    };
    skills: {
        categories: SkillCategory[];
    };
    education: {
        entries: EducationEntry[];
    };
    contactReview: ContactReview;
};

export const PORTFOLIO_DRAFT_KEY = "ng-portfolio-intake-draft-v1";

function newId(): string {
    return crypto.randomUUID();
}

export const emptyWorkEntry = (): WorkEntry => ({
    id: newId(),
    jobTitle: "",
    company: "",
    startMonth: "",
    endMonth: "",
    present: false,
    description: "",
    impacts: [],
});

export const emptySkillCategory = (): SkillCategory => ({
    id: newId(),
    name: "",
    description: "",
    tools: [],
    idiom: "",
});

export const emptyEducation = (): EducationEntry => ({
    id: newId(),
    institution: "",
    degree: "",
    graduationYear: "",
    thesis: "",
    honors: [],
    curriculum: [],
});

export function defaultPortfolioIntakeData(): PortfolioIntakeData {
    return {
        experience: {
            entries: [],
            impacts: [
            ],
        },
        skills: { categories: [] },
        education: { entries: [emptyEducation()] },
        contactReview: {
            fullName: "",
            professionalTitle: "",
            summary: "",
            location: "Toronto & GTA",
            availability: "Remote / in-person as needed",
            email: "",
            linkedin: "",
            social: "",
        },
    };
}
