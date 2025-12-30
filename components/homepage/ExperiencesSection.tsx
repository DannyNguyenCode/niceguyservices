"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import BannerCTA from "./BannerCTA";
import PageHeader from "../PageHeader";

const containerVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: "easeOut",
            when: "beforeChildren",
            staggerChildren: 0.08,
        },
    },
};



const MotionDiv = motion.div;

export default function ExperiencesSectionV2() {
    return (
        <section
            id="experience"
            className="relative overflow-hidden bg-base-200 py-12 md:py-16 px-3 md:px-6"
        >

            <div className="relative z-10 mx-auto max-w-6xl">
                <PageHeader
                    title="Websites that feel good to use — and easy to look after."
                    subtitle="Real-world customer support background plus modern frontend engineering. You get a calm, organised build that your team can actually live with."
                />


                {/* LEFT: main experience card + CTA */}
                <div className="space-y-6">

                    <div className="card bg-base-100 shadow-xl border border-base-300">
                        <div className="card-body gap-4">
                            {/* Label */}
                            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-base-content/60">
                                <div className="badge badge-outline badge-sm">
                                    Dev + support background
                                </div>
                                <span>Frontend &amp; customer support</span>
                            </div>

                            {/* Title */}
                            <h2 className="text-2xl font-extrabold leading-snug">
                                Websites that are calm to run, not just nice to look at.
                            </h2>

                            {/* Intro copy */}
                            <p className="text-sm md:text-base text-base-content/80">
                                I blend frontend engineering with real customer-facing
                                support work, so what we build is practical, reliable, and
                                comfortable for your team to live with — even when things
                                get busy.
                            </p>

                            {/* Tech / background chips */}
                            <div className="flex flex-wrap gap-2 mt-1">
                                <span className="badge badge-outline badge-sm font-semibold">
                                    React
                                </span>
                                <span className="badge badge-outline badge-sm font-semibold">
                                    Next.js
                                </span>
                                <span className="badge badge-outline badge-sm font-semibold">
                                    Real-time UIs
                                </span>
                                <span className="badge badge-outline badge-sm font-semibold">
                                    Customer support background
                                </span>
                            </div>

                            {/* How I help strip */}
                            <div className="mt-3 rounded-xl border border-dashed border-base-300 bg-base-200/60 px-4 py-3">
                                <div className="space-y-1">
                                    <div className="font-semibold text-sm flex items-center gap-2">
                                        <span className="badge badge-primary badge-xs" />
                                        <span>How I usually help</span>
                                    </div>
                                    <p className="text-xs md:text-sm text-base-content/80">
                                        Understand your business → ship a clean, modern build →
                                        iterate together based on what&apos;s actually happening
                                        with your visitors.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* CTA banner (still using your existing BannerCTA component) */}
                    <div className="mt-4">
                        <BannerCTA path="contact" />
                    </div>
                </div>

                {/* RIGHT: strengths + process */}
                <div className="space-y-4 md:space-y-5">
                    {/* What I bring to your project */}

                    <div className="card bg-base-100 shadow-md border border-base-300">
                        <div className="card-body gap-4">
                            <div className="flex items-center justify-between gap-3">
                                <h3 className="text-xs font-extrabold uppercase tracking-[0.16em] text-base-content">
                                    What I bring to your project
                                </h3>
                                <span className="badge badge-outline badge-sm font-semibold tracking-wide uppercase">
                                    Project foundation
                                </span>
                            </div>

                            <div className="divider my-0" />

                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <h4 className="text-sm font-semibold">
                                        Frontend development
                                    </h4>
                                    <p className="text-xs md:text-sm text-base-content/80">
                                        Modern React &amp; Next.js builds, including secure
                                        flows and real-time interfaces.
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <h4 className="text-sm font-semibold">
                                        Communication &amp; support
                                    </h4>
                                    <p className="text-xs md:text-sm text-base-content/80">
                                        Service-desk background — staying calm, clear, and
                                        patient when things get busy.
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <h4 className="text-sm font-semibold">
                                        Foundation &amp; mindset
                                    </h4>
                                    <p className="text-xs md:text-sm text-base-content/80">
                                        Programming background plus a people-first approach to
                                        collaboration.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* What it's like to work with me */}

                    <div className="card bg-base-100 shadow-md border border-base-300">
                        <div className="card-body gap-4">
                            <div className="flex items-center gap-2">
                                <span className="badge badge-outline badge-sm" />
                                <h3 className="text-xs font-extrabold uppercase tracking-[0.16em]">
                                    What it&apos;s like to work with me
                                </h3>
                            </div>

                            <p className="text-xs md:text-sm text-base-content/80">
                                A calm, collaborative process where you always know what&apos;s
                                happening and why — with decisions made around your
                                business, not just the code.
                            </p>

                            <div className="grid gap-3 md:gap-4 md:grid-cols-2">
                                <div className="space-y-1 rounded-xl border border-base-200/80 bg-base-200/40 p-3">
                                    <h4 className="text-sm font-semibold">
                                        Clear, honest communication
                                    </h4>
                                    <p className="text-xs md:text-sm text-base-content/80">
                                        You always know what&apos;s happening, why decisions are
                                        made, and what&apos;s coming next — no guesswork.
                                    </p>
                                </div>

                                <div className="space-y-1 rounded-xl border border-base-200/80 bg-base-200/40 p-3">
                                    <h4 className="text-sm font-semibold">
                                        Calm and organised delivery
                                    </h4>
                                    <p className="text-xs md:text-sm text-base-content/80">
                                        Clear steps, realistic timelines, and updates along the
                                        way so you never feel left in the dark.
                                    </p>
                                </div>

                                <div className="space-y-1 rounded-xl border border-base-200/80 bg-base-200/40 p-3">
                                    <h4 className="text-sm font-semibold">
                                        Built for the long term
                                    </h4>
                                    <p className="text-xs md:text-sm text-base-content/80">
                                        Clean architecture and modern practices so your site
                                        stays easy to update years from now.
                                    </p>
                                </div>

                                <div className="space-y-1 rounded-xl border border-base-200/80 bg-base-200/40 p-3">
                                    <h4 className="text-sm font-semibold">
                                        Curiosity that moves projects forward
                                    </h4>
                                    <p className="text-xs md:text-sm text-base-content/80">
                                        If your project needs new tools or APIs, I&apos;ll
                                        explore them with you so your solution keeps up instead
                                        of falling behind.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}
