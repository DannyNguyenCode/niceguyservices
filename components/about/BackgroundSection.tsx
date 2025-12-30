"use client";

import React from "react";

const BackgroundSection: React.FC = () => {
    return (
        <div className="grid gap-4 md:grid-cols-2">
            {/* Background / experience */}
            <div className="card bg-base-100 border border-base-300 shadow-md h-full">
                <div className="card-body space-y-3">
                    <h5 className="text-lg font-bold">My Background</h5>

                    <div className="space-y-1">
                        <p className="text-sm font-semibold">Professional Experience</p>
                        <p className="text-sm text-base-content/80">
                            <strong>Junior Frontend Developer @ Shipvista (1 year)</strong> —
                            Built secure UI flows, payment interfaces, real-time shipping
                            updates, and modern React components for a shipping label
                            platform. Collaborated with backend teams and handled code reviews
                            using Azure DevOps.
                        </p>
                        <p className="text-sm text-base-content/80 mt-2">
                            <strong>Customer Service &amp; IT Support (~2 years)</strong> —
                            Including IT Service Desk at Seneca Polytechnic, helping hundreds
                            of students and faculty with tech issues. These roles strengthened
                            my communication, patience, and ability to explain technical
                            concepts clearly over the phone and in person.
                        </p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm font-semibold">Education</p>
                        <p className="text-sm text-base-content/80">
                            Diploma in Computer Programming — Seneca College
                        </p>
                    </div>
                </div>
            </div>

            {/* Socials & portfolio (small duplicate but clear) */}
            <div className="card bg-base-100 border border-base-300 shadow-md h-full">
                <div className="card-body space-y-3">
                    <h5 className="text-lg font-bold">Socials &amp; Portfolio</h5>
                    <p className="text-sm text-base-content/80">
                        Follow along or reach out on any of these platforms:
                    </p>

                    <ul className="space-y-1 text-sm">
                        <li>
                            X / Twitter:{" "}
                            <a
                                href="https://x.com/BaoGiaNguyen"
                                target="_blank"
                                className="link link-primary"
                            >
                                @BaoGiaNguyen
                            </a>
                        </li>
                        <li>
                            LinkedIn:{" "}
                            <a
                                href="https://www.linkedin.com/in/gia-bao-danny-nguyen"
                                target="_blank"
                                className="link link-primary"
                            >
                                Gia Bao (Danny) Nguyen
                            </a>
                        </li>
                        <li>
                            Portfolio:{" "}
                            <a
                                href="https://portfolio-black-two-97.vercel.app"
                                target="_blank"
                                className="link link-primary"
                            >
                                View my work
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default BackgroundSection;
