export type PetPortrait = {
    src: string;
    alt: string;
    name?: string;
    tagline?: string;
};

export type VitalStat = {
    label: string;
    value: string;
    tone?: string;
};

export type TimelineEntry = {
    period: string;
    title: string;
    org: string;
    description: string;
    active: boolean;
};

export type EducationHighlight = {
    eyebrow: string;
    cardEyebrow?: string;
    title: string;
    org: string;
    description: string;
};

export type WorkingWithMeBodySegment = {
    text: string;
    bold?: boolean;
};

export type WorkingWithMeItem = {
    heading: string;
    bodySegments: WorkingWithMeBodySegment[];
};

export type HeroFocusCard = {
    eyebrow: string;
    title: string;
};

export type HeroCta = {
    label: string;
    href: string;
};

export type IntroImage = {
    src: string;
    alt: string;
};

export type OutsideWork = {
    before: string;
    emphasis: string;
    after: string;
};

export type MeetCard = {
    title: string;
    paragraphs: string[];
};
