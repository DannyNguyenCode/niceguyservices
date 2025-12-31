"use client";

import React from "react";
import BannerCTA from "./BannerCTA";
import PageHeader from "../PageHeader";

export default function ExperiencesSectionV2() {
    return (
        <section
            id="experience"
            className="relative overflow-hidden bg-base-200 py-12 md:py-16 px-3 md:px-6"
            aria-labelledby="experience-heading"
        >
            <div className="relative z-10 mx-auto max-w-6xl">
                <PageHeader
                    title="Websites that feel good to use — and easy to look after."
                    subtitle="Modern frontend engineering plus real-world customer support experience. You get a calm, organised build that’s fast, SEO-ready, and simple to maintain."
                />

                {/* LEFT: main experience card + CTA */}
                <div className="space-y-6">
                    <div className="card bg-base-100 shadow-xl border border-base-300">
                        <div className="card-body gap-4">
                            {/* Label */}
                            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-base-content/60">
                                <div className="badge badge-outline badge-sm">Dev + support background</div>
                                <span>Frontend &amp; customer support</span>
                            </div>

                            {/* Title */}
                            <h2 id="experience-heading" className="text-2xl font-extrabold leading-snug">
                                Custom websites that are calm to run, not just nice to look at.
                            </h2>

                            {/* Intro copy */}
                            <p className="text-sm md:text-base text-base-content ">
                                I blend modern frontend development with real customer-facing support work,
                                so what we build is practical, reliable, and comfortable for your team to
                                live with — even when things get busy.
                            </p>

                            {/* Tech / background chips */}
                            <div className="flex flex-wrap gap-2 mt-1">
                                <span className="badge badge-outline badge-sm font-semibold">React</span>
                                <span className="badge badge-outline badge-sm font-semibold">Next.js</span>
                                <span className="badge badge-outline badge-sm font-semibold">Performance-first</span>
                                <span className="badge badge-outline badge-sm font-semibold">Customer support background</span>
                            </div>

                            {/* How I help strip */}
                            <div className="mt-3 rounded-xl border border-dashed border-base-300 bg-base-200/60 px-4 py-3">
                                <div className="space-y-1">
                                    <div className="font-semibold text-sm flex items-center gap-2">
                                        <span className="badge badge-primary badge-xs" />
                                        <span>How I usually help small businesses</span>
                                    </div>
                                    <p className="text-xs md:text-sm text-base-content ">
                                        Understand your business → ship a clean, modern build → iterate together
                                        based on what visitors are actually doing (calls, forms, clicks).
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA banner */}
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
                                    <h4 className="text-sm font-semibold">Frontend development</h4>
                                    <p className="text-xs md:text-sm text-base-content ">
                                        Modern React &amp; Next.js builds with clean structure, fast load times,
                                        and a website that’s easy to extend later.
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <h4 className="text-sm font-semibold">Communication &amp; support</h4>
                                    <p className="text-xs md:text-sm text-base-content ">
                                        Service-desk background — staying calm, clear, and patient when timelines
                                        are tight or questions come up.
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <h4 className="text-sm font-semibold">Foundation &amp; mindset</h4>
                                    <p className="text-xs md:text-sm text-base-content ">
                                        A people-first approach focused on outcomes: clarity, credibility, and
                                        a website that supports long-term growth.
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

                            <p className="text-xs md:text-sm text-base-content ">
                                A calm, collaborative process where you always know what&apos;s happening and
                                why — with decisions made around your business, not just the code.
                            </p>

                            <div className="grid gap-3 md:gap-4 md:grid-cols-2">
                                <div className="space-y-1 rounded-xl border border-base-200  bg-base-200/40 p-3">
                                    <h4 className="text-sm font-semibold">Clear, honest communication</h4>
                                    <p className="text-xs md:text-sm text-base-content ">
                                        You always know what&apos;s happening, why decisions are made, and what&apos;s coming next.
                                    </p>
                                </div>

                                <div className="space-y-1 rounded-xl border border-base-200  bg-base-200/40 p-3">
                                    <h4 className="text-sm font-semibold">Calm and organised delivery</h4>
                                    <p className="text-xs md:text-sm text-base-content ">
                                        Clear steps, realistic timelines, and updates along the way so you never feel left in the dark.
                                    </p>
                                </div>

                                <div className="space-y-1 rounded-xl border border-base-200  bg-base-200/40 p-3">
                                    <h4 className="text-sm font-semibold">Built for the long term</h4>
                                    <p className="text-xs md:text-sm text-base-content ">
                                        Clean architecture and modern practices so your site stays easy to update years from now.
                                    </p>
                                </div>

                                <div className="space-y-1 rounded-xl border border-base-200  bg-base-200/40 p-3">
                                    <h4 className="text-sm font-semibold">Curiosity that moves projects forward</h4>
                                    <p className="text-xs md:text-sm text-base-content ">
                                        If your project needs new tools or integrations, I&apos;ll explore options with you so your site keeps up.
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
