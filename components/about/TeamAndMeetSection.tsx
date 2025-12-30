"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import PrivacyFriendlyMap from "./PrivacyFriendlyMap";

const TeamAndMeetSection: React.FC = () => {
    return (
        <div className="grid gap-4 md:grid-cols-[7fr,5fr]">
            {/* Team / profile card */}
            <div className="card bg-base-100 border border-base-300 shadow-md h-full">
                <div className="card-body space-y-4">
                    <h5 className="text-lg font-bold">Who&apos;s on the team?</h5>
                    <p className="text-sm text-base-content/80">
                        Right now, you&apos;ll be working directly with me — no account
                        managers, no hand-offs, no getting lost in a big agency pipeline. As
                        the work grows, the process and codebase are set up so additional
                        developers or designers can be brought in smoothly.
                    </p>

                    <div className="card border border-base-300 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                        <div className="w-18 h-18 rounded-full overflow-hidden border-2 border-primary flex-shrink-0">
                            <Image
                                src="/profilePicture.jpg"
                                alt="Danny Nguyen profile"
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="space-y-1 text-sm">
                            <p className="font-semibold">Gia Bao (Danny) Nguyen</p>
                            <p className="text-base-content/80">
                                Web Developer • Frontend &amp; Full-Stack
                            </p>
                            <p className="text-base-content/80">
                                Diploma in Computer Programming from Seneca College. Experience
                                in customer service, IT support, and front-end development for a
                                shipping platform.
                            </p>
                            <p className="text-base-content/80">
                                Loves: two cats, one dog, gaming with friends, learning new
                                tech, and meeting new people.
                            </p>

                            <div className="flex flex-wrap gap-3 pt-2">
                                <Link
                                    href="https://x.com/BaoGiaNguyen"
                                    target="_blank"
                                    className="link link-primary text-xs md:text-sm"
                                >
                                    X / Twitter
                                </Link>
                                <Link
                                    href="https://www.linkedin.com/in/gia-bao-danny-nguyen"
                                    target="_blank"
                                    className="link link-primary text-xs md:text-sm"
                                >
                                    LinkedIn
                                </Link>
                                <Link
                                    href="https://portfolio-black-two-97.vercel.app"
                                    target="_blank"
                                    className="link link-primary text-xs md:text-sm"
                                >
                                    Portfolio
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Meet in person card */}
            <div className="card bg-base-100 border border-base-300 shadow-md h-full">
                <div className="card-body space-y-3">
                    <h5 className="text-lg font-bold">Meet in person (Toronto)</h5>
                    <p className="text-sm text-base-content/80">
                        If you&apos;re local to the GTA, I&apos;m happy to meet in person
                        for a project kickoff or strategy session. We can pick a convenient
                        café or public workspace in Toronto and walk through your goals
                        together.
                    </p>
                    <p className="text-sm text-base-content/80">
                        Just mention that you&apos;d like to meet in person when you contact
                        me, and I&apos;ll suggest a few options and times.
                    </p>

                    <PrivacyFriendlyMap />
                </div>
            </div>
        </div>
    );
};

export default TeamAndMeetSection;
