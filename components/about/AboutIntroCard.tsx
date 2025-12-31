"use client";

import React from "react";
import Image from "next/image";

const AboutIntroCard: React.FC = () => {
    return (
        <div className="card bg-base-100 border border-base-300 shadow-md">
            <div className="card-body grid gap-6 md:grid-cols-[auto,1fr] items-center">
                {/* Photo */}
                <div className="flex justify-center">
                    <div className="w-44 h-44 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-primary shadow-xl">
                        <Image
                            src="/profilePicture.jpg"
                            alt="Danny Nguyen, web developer based in Toronto"
                            width={220}
                            height={220}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Text */}
                <div className="space-y-3">
                    <h4 className="text-xl font-extrabold">
                        Who you&apos;ll be working with
                    </h4>

                    <p className="text-sm md:text-base text-base-content ">
                        Hi, I&apos;m Danny — a Toronto-based web developer who builds clean,
                        modern websites that are easy to maintain and simple to scale as
                        your business grows.
                    </p>

                    <p className="text-sm md:text-base text-base-content ">
                        Outside of work, I&apos;m a big animal lover — I share my home with{" "}
                        <strong>two cats and a dog</strong> that I care for and love. I
                        enjoy playing games with friends and genuinely like talking to
                        people. If there&apos;s something I don&apos;t know much about, I
                        tend to lean in rather than back away — learning new things is
                        something that immediately engages me.
                    </p>

                    <p className="text-sm md:text-base text-base-content ">
                        I&apos;ve spent years in both customer-facing roles and technical
                        roles, which means I&apos;m just as comfortable explaining options
                        in plain language as I am digging into code. Talking to me is easy —
                        no buzzwords, no pressure, just honest guidance about what will
                        actually help your business.
                    </p>

                    <div className="flex flex-wrap gap-2 mt-2">
                        <span className="badge badge-primary badge-lg px-3 py-2 text-xs md:text-sm">
                            Toronto, ON • Local &amp; remote
                        </span>
                        <span className="badge badge-outline px-3 py-2 text-xs md:text-sm">
                            Strong communication • Curious &amp; people-focused
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutIntroCard;
