"use client";

import React from "react";

const ContactIntro: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Heading + intro text */}
            <div className="space-y-3">
                <h2 className="text-xl md:text-2xl font-extrabold">
                    Let&apos;s build something that actually helps your business.
                </h2>
                <p className="text-sm md:text-base text-base-content ">
                    Whether you need your first website, a redesign of something that&apos;s
                    holding you back, or a more scalable setup for a growing business —
                    this is the place to start. I&apos;ll keep the process simple,
                    transparent, and focused on business outcomes, not just code.
                </p>
            </div>

            {/* Trust badges */}
            <div className="grid gap-3 sm:grid-cols-3">
                {/* 24hr response */}
                <div className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition">
                    <div className="card-body p-3 space-y-2">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center text-xs font-bold">
                            ⏱
                        </div>
                        <h3 className="text-xs font-bold uppercase tracking-wide">
                            24hr response
                        </h3>
                        <p className="text-xs text-base-content">
                            I respond to all inquiries within one business day.
                        </p>
                    </div>
                </div>

                {/* No pressure */}
                <div className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition">
                    <div className="card-body p-3 space-y-2">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center text-xs font-bold">
                            🛡
                        </div>
                        <h3 className="text-xs font-bold uppercase tracking-wide">
                            No pressure
                        </h3>
                        <p className="text-xs text-base-content">
                            Free consultation, no obligations or hard sales pitch.
                        </p>
                    </div>
                </div>

                {/* Local support */}
                <div className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition">
                    <div className="card-body p-3 space-y-2">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center text-xs font-bold">
                            📍
                        </div>
                        <h3 className="text-xs font-bold uppercase tracking-wide">
                            Local support
                        </h3>
                        <p className="text-xs text-base-content">
                            Based in Toronto, working with local and remote businesses.
                        </p>
                    </div>
                </div>
            </div>

            {/* Prefer to talk directly */}
            <div className="card bg-base-100 border border-base-300 shadow-md">
                <div className="card-body space-y-4">
                    <div className="space-y-1">
                        <h3 className="text-lg font-extrabold">Prefer to talk directly?</h3>
                        <p className="text-sm text-base-content  max-w-md">
                            I&apos;m here to answer your questions and discuss your project
                            needs in real time.
                        </p>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                        {/* Call */}
                        <a
                            href="tel:+15551234567" // TODO: replace with your real number
                            className="card border border-base-300 bg-base-100 hover:bg-base-200 transition cursor-pointer"
                        >
                            <div className="card-body flex flex-row gap-3 items-center p-3">
                                <div className="w-10 h-10 rounded-xl bg-base-200 flex items-center justify-center text-lg">
                                    📞
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-wide text-base-content/60">
                                        Call or voicemail
                                    </p>
                                    <p className="text-sm font-semibold text-base-content">
                                        +1 (555) 123-4567
                                    </p>
                                </div>
                            </div>
                        </a>

                        {/* Email */}
                        <a
                            href="mailto:hello@example.com" // TODO: replace with your real email
                            className="card border border-base-300 bg-base-100 hover:bg-base-200 transition cursor-pointer"
                        >
                            <div className="card-body flex flex-row gap-3 items-center p-3">
                                <div className="w-10 h-10 rounded-xl bg-base-200 flex items-center justify-center text-lg">
                                    ✉️
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-wide text-base-content/60">
                                        Email
                                    </p>
                                    <p className="text-sm font-semibold text-base-content">
                                        hello@example.com
                                    </p>
                                </div>
                            </div>
                        </a>
                    </div>

                    {/* Business hours */}
                    <div className="pt-3 border-t border-base-300 text-sm space-y-0.5">
                        <p className="font-semibold text-base-content">Business hours</p>
                        <p className="text-base-content ">
                            Monday – Friday: 9:00 AM – 6:00 PM EST
                        </p>
                        <p className="text-base-content ">Weekend: By appointment</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactIntro;
