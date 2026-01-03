"use client";

import React from "react";
import BannerCTA from "./BannerCTA";
import PageHeader from "../PageHeader";

export default function ExperiencesSectionV2() {
    return (
        <section
            id="experience"
            className="relative overflow-hidden py-12 md:py-16 px-3 md:px-6"
            aria-labelledby="experience-heading"
        >
            <div className="relative z-10 mx-auto max-w-6xl">
                <PageHeader
                    title="Websites that feel good to use — and easy to look after."
                    subtitle="Modern frontend engineering plus real-world customer support experience. You get a calm, organised build that’s fast, SEO-ready, and simple to maintain."
                />

                {/* GRID: 12-column */}
                <div className="grid grid-cols-12 items-start">
                    {/* FIRST CARD: span 12 */}
                    <div className="col-span-12">
                        <div className="card shadow-xl border">
                            <div className="card-body">
                                <div className="flex flex-wrap items-center text-xs uppercase">
                                    <div className="badge badge-primary badge-sm mr-2 mb-1">
                                        Dev + support background
                                    </div>
                                    <span className="leading-tight">
                                        Frontend &amp; customer support
                                    </span>
                                </div>


                                <h2
                                    id="experience-heading"
                                    className="text-2xl font-extrabold leading-snug mt-4"
                                >
                                    Custom websites that are calm to run, not just nice to look at.
                                </h2>

                                <p className="text-sm md:text-base mt-3">
                                    I blend modern frontend development with real customer-facing support work,
                                    so what we build is practical, reliable, and comfortable for your team to
                                    live with — even when things get busy.
                                </p>

                                <div className="flex flex-wrap mt-4">
                                    <span className="badge badge-outline badge-sm font-semibold mr-2 mb-2">React</span>
                                    <span className="badge badge-outline badge-sm font-semibold mr-2 mb-2">Next.js</span>
                                    <span className="badge badge-outline badge-sm font-semibold mr-2 mb-2">Performance-first</span>
                                    <span className="badge badge-outline badge-sm font-semibold mb-2">
                                        Customer support background
                                    </span>
                                </div>

                                <div className="rounded-xl border border-dashed px-4 py-3 mt-4">
                                    <div className="font-semibold text-sm flex items-center">
                                        <span className="badge badge-primary badge-xs mr-2" />
                                        <span>How I usually help small businesses</span>
                                    </div>
                                    <p className="text-xs md:text-sm mt-1">
                                        Understand your business → ship a clean, modern build → iterate together
                                        based on what visitors are actually doing (calls, forms, clicks).
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECOND + THIRD ROW */}
                    <div className="col-span-12 grid grid-cols-12 md:grid-cols-6 gap-6 items-start mt-6">
                        {/* SECOND CARD */}
                        <div className="col-span-12 md:col-span-3">
                            <div className="card shadow-md border h-full">
                                <div className="card-body">
                                    <div className="flex flex-wrap items-center text-xs uppercase">
                                        <h3 className="font-extrabold tracking-[0.16em] mr-2">
                                            What I bring to your project
                                        </h3>
                                        <span className="badge badge-outline badge-sm font-semibold tracking-wide uppercase mb-1">
                                            Project foundation
                                        </span>
                                    </div>


                                    <div className="divider my-2" />

                                    <h4 className="text-sm font-semibold">
                                        Frontend development
                                    </h4>
                                    <p className="text-xs md:text-sm mt-1">
                                        Modern React &amp; Next.js builds with clean structure, fast load times,
                                        and a website that’s easy to extend later.
                                    </p>

                                    <h4 className="text-sm font-semibold mt-3">
                                        Communication &amp; support
                                    </h4>
                                    <p className="text-xs md:text-sm mt-1">
                                        Service-desk background — staying calm, clear, and patient when timelines
                                        are tight or questions come up.
                                    </p>

                                    <h4 className="text-sm font-semibold mt-3">
                                        Foundation &amp; mindset
                                    </h4>
                                    <p className="text-xs md:text-sm mt-1">
                                        A people-first approach focused on outcomes: clarity, credibility, and
                                        a website that supports long-term growth.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* THIRD CARD */}
                        <div className="col-span-12 md:col-span-3 mt-6 md:mt-0">
                            <div className="card shadow-md border h-full">
                                <div className="card-body">
                                    <div className="flex items-center">
                                        <span className="badge badge-outline badge-sm mr-2" />
                                        <h3 className="text-xs font-extrabold uppercase tracking-[0.16em]">
                                            What it&apos;s like to work with me
                                        </h3>
                                    </div>

                                    <p className="text-xs md:text-sm mt-3">
                                        A calm, collaborative process where you always know what&apos;s happening and
                                        why — with decisions made around your business, not just the code.
                                    </p>

                                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                                        <div className="rounded-xl border p-3">
                                            <h4 className="text-sm font-semibold">Clear, honest communication</h4>
                                            <p className="text-xs md:text-sm mt-1">
                                                You always know what&apos;s happening, why decisions are made, and what&apos;s coming next.
                                            </p>
                                        </div>

                                        <div className="rounded-xl border p-3 mt-3 md:mt-0">
                                            <h4 className="text-sm font-semibold">Calm and organised delivery</h4>
                                            <p className="text-xs md:text-sm mt-1">
                                                Clear steps, realistic timelines, and updates along the way so you never feel left in the dark.
                                            </p>
                                        </div>

                                        <div className="rounded-xl border p-3 mt-3">
                                            <h4 className="text-sm font-semibold">Built for the long term</h4>
                                            <p className="text-xs md:text-sm mt-1">
                                                Clean architecture and modern practices so your site stays easy to update years from now.
                                            </p>
                                        </div>

                                        <div className="rounded-xl border p-3 mt-3">
                                            <h4 className="text-sm font-semibold">Curiosity that moves projects forward</h4>
                                            <p className="text-xs md:text-sm mt-1">
                                                If your project needs new tools or integrations, I&apos;ll explore options with you so your site keeps up.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <BannerCTA path="contact" />
            </div>
        </section>
    );
}
