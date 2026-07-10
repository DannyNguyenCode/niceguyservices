"use client";

import aboutContent from "./aboutContent.json";
import type {
    EducationHighlight,
    PetPortrait,
    TimelineEntry,
    VitalStat,
} from "./aboutBiographyTypes";
import BiographyExperienceSection from "./BiographyExperienceSection";
import BiographyFloatingCta from "./BiographyFloatingCta";
import BiographyHero from "./BiographyHero";
import BiographyHomePackSection from "./BiographyHomePackSection";
import BiographyMeetSection from "./BiographyMeetSection";
import BiographyMethodologySection from "./BiographyMethodologySection";
import BiographyWhoSection from "./BiographyWhoSection";
import ServicesModernCTA from "@/components/services/ServicesModernCTA";

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

    return (
        <div
            className="flex min-h-screen flex-col bg-(--pm-surface) font-pm-body text-(--pm-on-surface)"
            data-about-biography-layout=""
        >
                <main className="min-w-0 w-full flex-1">
                    <BiographyHero
                        eyebrow={bl.heroEyebrow}
                        headlineHighlight={bl.heroHeadlineHighlight}
                        headlinePlain={bl.heroHeadlinePlain}
                        headlineBase={bl.heroHeadlineBase}
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
                </main>

                <ServicesModernCTA
                    title={cta.title}
                    description={cta.description}
                    primaryLabel={cta.buttonLabel}
                    secondaryHref="/services"
                    secondaryLabel="View services"
                />

                <BiographyFloatingCta
                    href={cta.buttonHref}
                    label={bl.floatingCtaLabel}
                />
        </div>
    );
}
