"use client";

import React from "react";
import PageHeader from "./PageHeader";
import AboutIntroCard from "./about/AboutIntroCard";
import AboutSummaryCard from "./about/AboutSummaryCard";
import WorkingWithMeCard from "./about/WorkingWithMeCard";
import TeamAndMeetSection from "./about/TeamAndMeetSection";
import BackgroundSection from "./about/BackgroundSection";
import AboutCTA from "./about/AboutCTA";

const About: React.FC = () => {
    return (
        <section className="bg-base-200 py-12 md:py-16 px-4">
            <div className="max-w-6xl mx-auto space-y-8 md:space-y-10">
                <PageHeader
                    title="About Us"
                    subtitle="Professional, warm, and focused on building clean, modern websites that are easy to maintain and scale."
                />

                <div className="space-y-6">
                    <AboutIntroCard />
                    <AboutSummaryCard />
                    <WorkingWithMeCard />
                    <TeamAndMeetSection />
                    <BackgroundSection />
                    <AboutCTA />
                </div>
            </div>
        </section>
    );
};

export default About;
