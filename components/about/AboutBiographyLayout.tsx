"use client";

import aboutContent from "./aboutContent.json";
import type {
    EducationHighlight,
    PetPortrait,
    TimelineEntry,
    VitalStat,
} from "./aboutBiographyTypes";
import BiographyExperienceSection from "./BiographyExperienceSection";
import BiographyFinalCtaSection from "./BiographyFinalCtaSection";
import BiographyFloatingCta from "./BiographyFloatingCta";
import BiographyHero from "./BiographyHero";
import BiographyHomePackSection from "./BiographyHomePackSection";
import BiographyMeetSection from "./BiographyMeetSection";
import BiographyMethodologySection from "./BiographyMethodologySection";
import BiographyWhoSection from "./BiographyWhoSection";

export default function AboutBiographyLayout() {
    const {
        page,
        intro,
        summary,
        workingWithMe,
        teamAndMeet,
        cta,
        biographyLayout,
    } = aboutContent;

    const { teamCard, meetCard } = teamAndMeet;
    const bl = biographyLayout as typeof biographyLayout & {
        vitalStats: VitalStat[];
        heroPrimaryCta: { label: string; href: string };
        heroSecondaryCta: { label: string; href: string };
        heroFocusCard: { eyebrow: string; title: string };
        methodologySectionTitle: string;
        methodologySectionIntro: string;
        petPortraits: PetPortrait[];
    };

    const bgExt = aboutContent.background as typeof aboutContent.background & {
        experienceTimeline: TimelineEntry[];
        educationHighlight: EducationHighlight;
    };

    const locationEyebrow =
        intro.badges[0] ?? "Toronto, ON • Local & remote";

    return (
        <div
            className="selection:bg-(--pm-primary-container) selection:text-(--pm-on-primary)"
            data-about-biography-layout=""
        >
            <div className="flex min-h-screen flex-col bg-(--pm-surface) font-pm-body text-(--pm-on-surface)">
                <main className="min-w-0 w-full flex-1">
                    <BiographyHero
                        locationEyebrow={locationEyebrow}
                        headlineLine1={bl.heroHeadlineLine1}
                        headlineAccent={bl.heroHeadlineAccent}
                        subtitle={page.subtitle}
                        primaryCta={bl.heroPrimaryCta}
                        secondaryCta={bl.heroSecondaryCta}
                        focusCard={bl.heroFocusCard}
                        portrait={intro.image}
                    />
                    <BiographyWhoSection
                        heading={intro.heading}
                        summaryParagraphs={summary.paragraphs}
                        teamIntro={teamCard.intro}
                        vitalStats={bl.vitalStats}
                    />
                    <BiographyHomePackSection
                        sectionTitle={bl.homePackCardTitle}
                        outsideWork={intro.outsideWork}
                        petPortraits={bl.petPortraits}
                    />
                    <BiographyExperienceSection
                        experienceTimeline={bgExt.experienceTimeline}
                        educationHighlight={bgExt.educationHighlight}
                    />
                    <BiographyMethodologySection
                        sectionTitle={bl.methodologySectionTitle}
                        sectionIntro={bl.methodologySectionIntro}
                        items={workingWithMe.items}
                    />
                    <BiographyMeetSection
                        eyebrow={bl.meetModuleEyebrow}
                        meetCard={meetCard}
                    />
                    <BiographyFinalCtaSection
                        title={cta.title}
                        description={cta.description}
                        buttonLabel={cta.buttonLabel}
                        buttonHref={cta.buttonHref}
                    />
                </main>

                <BiographyFloatingCta
                    href={cta.buttonHref}
                    label={bl.floatingCtaLabel}
                />
            </div>
        </div>
    );
}
