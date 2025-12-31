"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

type AboutSectionProps = {
    contentHeight?: number; // optional (not used currently)
};

const AboutSection: React.FC<AboutSectionProps> = () => {
    return (
        <section
            id="aboutSection"
            className="w-full flex justify-center bg-base-200 py-12 md:py-16"
            aria-labelledby="about-heading"
        >
            <div className="w-11/12 max-w-5xl grid gap-8 md:gap-10 md:grid-cols-2 items-start">
                {/* Profile card */}
                <div className="card bg-base-100 shadow-xl border border-base-300">
                    <div className="card-body items-center text-center gap-4">
                        <div className="w-44 h-44 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-primary shadow-lg">
                            <Image
                                src="/profilePicture.jpg"
                                alt="Gia Bao (Danny) Nguyen, web developer in Toronto"
                                width={220}
                                height={220}
                                className="w-full h-full object-cover"
                                priority={false}
                            />
                        </div>

                        <div className="space-y-1">
                            <p className="text-xl font-bold">Gia Bao (Danny) Nguyen</p>
                            <p className="text-sm text-base-content">
                                Web Developer • Frontend &amp; Full-Stack
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-2 mt-1">
                            <span className="badge badge-primary badge-lg font-semibold">
                                Toronto, ON • Local &amp; remote
                            </span>
                            <span className="badge badge-outline badge-lg text-xs md:text-sm">
                                Clear communication • People-focused
                            </span>
                        </div>
                    </div>
                </div>

                {/* About copy */}
                <div className="card bg-base-100 shadow-md border border-base-300 h-full">
                    <div className="card-body gap-4">
                        {/* ✅ Make this the main heading for this section (H2) */}
                        <h2 id="about-heading" className="text-2xl font-bold">
                            About Nice Guy Services
                        </h2>

                        {/* ✅ Subheading (H3) for better hierarchy */}
                        <h3 className="text-lg font-semibold text-base-content ">
                            A developer who builds fast, maintainable websites for small businesses
                        </h3>

                        <div className="space-y-3 text-sm md:text-base text-base-content ">
                            <p>
                                Hi, I&apos;m Danny — a Toronto-based web developer who builds clean, modern
                                websites that are easy to maintain and simple to scale as your business
                                grows. I focus on performance, clarity, and long-term support so your site
                                stays fast and professional over time.
                            </p>

                            <p>
                                I&apos;ve spent time in both customer-facing and technical roles — including
                                IT support at Seneca Polytechnic and frontend development at a shipping
                                platform. That mix means I&apos;m comfortable explaining options in plain
                                language and also digging into the details when needed.
                            </p>

                            <p>
                                My goal is simple: no buzzwords, no pressure — just honest guidance and a
                                website that helps your business look credible, load fast, and convert
                                visitors into real inquiries.
                            </p>
                        </div>

                        <ul className="mt-1 space-y-1 text-sm text-base-content ">
                            <li>• Customer service &amp; IT support background</li>
                            <li>• Frontend &amp; full-stack project experience</li>
                            <li>• Patient, detail-oriented, and easy to work with</li>
                        </ul>

                        <div className="mt-3">
                            {/* ✅ use Link for internal navigation */}
                            <Link
                                href="/about"
                                className="btn btn-outline btn-primary normal-case rounded-full"
                                aria-label="Read the full About page"
                            >
                                Read the full About page
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
