"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

type AboutSectionProps = {
    contentHeight: number;
};

const AboutSection: React.FC<AboutSectionProps> = ({ contentHeight }) => {
    return (
        <section
            id="aboutSection"
            className="w-full flex justify-center bg-base-200 py-12 md:py-16"

        >
            <div className="w-11/12 max-w-5xl grid gap-8 md:gap-10 md:grid-cols-2 items-start">
                {/* Profile card */}

                <div className="card bg-base-100 shadow-xl border border-base-300">
                    <div className="card-body items-center text-center gap-4">
                        <div className="w-44 h-44 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-primary shadow-lg">
                            <Image
                                src="/profilePicture.jpg"
                                alt="Danny Nguyen, web developer based in Toronto"
                                width={220}
                                height={220}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="space-y-1">
                            <h2 className="text-xl font-bold">
                                Gia Bao (Danny) Nguyen
                            </h2>
                            <p className="text-sm text-base-content/70">
                                Web Developer • Frontend &amp; Full-Stack
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-2 mt-1">
                            <span className="badge badge-primary badge-lg font-semibold">
                                Toronto, ON • Local &amp; remote
                            </span>
                            <span className="badge badge-outline badge-lg text-xs md:text-sm">
                                Strong communication • Curious &amp; people-focused
                            </span>
                        </div>
                    </div>
                </div>


                {/* About copy */}

                <div className="card bg-base-100 shadow-md border border-base-300 h-full">
                    <div className="card-body gap-4">
                        <h2 className="card-title text-2xl font-bold">
                            A Little About Me
                        </h2>

                        <div className="space-y-3 text-sm md:text-base text-base-content/80">
                            <p>
                                Hi, I&apos;m Danny — a Toronto-based web developer who builds
                                clean, modern websites that are easy to maintain and simple to
                                scale as your business grows. Outside of work, I share my home
                                with two cats and a dog, enjoy gaming with friends, and
                                genuinely like meeting new people.
                            </p>

                            <p>
                                I&apos;ve spent time in both customer-facing roles and
                                technical roles — including IT support at Seneca Polytechnic
                                and frontend development at a shipping platform. That mix
                                means I&apos;m just as comfortable explaining options in plain
                                language as I am digging into code. Talking to me is easy: no
                                buzzwords, no pressure, just honest guidance about what will
                                actually help your business.
                            </p>

                            <p>
                                I care a lot about long-term maintainability. I focus on fast
                                load times, modern best practices, and clean architecture so
                                your site stays easy to update — whether you keep working with
                                me or bring in another developer later.
                            </p>
                        </div>

                        <ul className="mt-1 space-y-1 text-sm text-base-content/80">
                            <li>• Customer service &amp; IT support background</li>
                            <li>• Frontend &amp; full-stack project experience</li>
                            <li>• Curious, patient, and detail-oriented</li>
                        </ul>

                        <div className="mt-3">
                            <a
                                href="/about"
                                className="btn btn-outline btn-primary normal-case rounded-full"
                            >
                                Read the full About page
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default AboutSection;
