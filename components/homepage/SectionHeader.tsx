"use client";

import React from "react";
import Link from "next/link";
import {
    BoltIcon,
    WrenchScrewdriverIcon,
    ChartBarIcon,
    ArrowRightIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
export default function SectionHeader({ contentHeight }: { contentHeight: number }) {
    return (
        <section className="bg-base-100">
            {/* ROW 1 – Background image with title + subtitle */}
            <div className="relative w-full min-h-80 md:min-h-[420px] lg:min-h-[480px] overflow-hidden">
                {/* Background image */}
                <div
                    className="absolute inset-0"

                >
                    <Image
                        src="/images/imageheader.png"
                        alt="Custom web development services by Nice Guy Services"
                        fill
                        priority
                        fetchPriority="high"
                        sizes="100vw"
                        className="object-cover object-center"
                    />
                </div>

                {/* Gradient overlay for readability */}
                <div
                    className="absolute inset-0 bg-linear-to-r from-base-300/80 via-base-100/70 to-transparent"
                    aria-hidden="true"
                />

                {/* Text content */}
                <div className="relative max-w-6xl mx-auto px-4 py-12 md:py-16 flex flex-col justify-center">
                    <div className="badge badge-outline bg-base-100/80 backdrop-blur mb-4 w-fit">
                        Built for busy small business owners
                    </div>

                    {/* H1 should describe what you do + who it's for + where (local SEO) */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-primary-content drop-shadow-sm">
                        Custom Websites for Small Businesses in Toronto
                    </h1>

                    {/* Brand as supporting text (still visible, but not the H1) */}
                    <p className="mt-3 text-xl md:text-2xl font-semibold text-primary-content drop-shadow-sm">
                        <span className="text-accent">Nice Guy Services</span> — Web Development & Ongoing Support
                    </p>

                    <p className="mt-4 max-w-xl text-base md:text-lg text-primary-content/90 drop-shadow-sm">
                        I build fast, clean, SEO-ready websites and handle reliable updates and long-term care —
                        so your website stays professional while you stay focused on running your business.
                    </p>
                </div>
            </div>

            {/* ROW 2 – Remaining content (value cards + buttons) */}
            <div className="bg-base-100 border-t border-base-300 shadow-[0_-10px_35px_rgba(0,0,0,0.12)]">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:py-6">
                        {/* Card 1 */}
                        <div className="group border border-base-300 bg-base-200/70 rounded-xl p-6 flex flex-col items-center text-center transition hover:-translate-y-1 hover:shadow-lg hover:border-primary">
                            <BoltIcon className="w-6 h-6 mb-3 opacity-70 group-hover:text-primary transition" />
                            <h2 className="font-semibold text-base mb-1">No more website headaches</h2>
                            <p className="text-sm text-base-content/70">
                                I’ll handle bugs, hosting, and tech so it stops living in your head.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="group border border-base-300 bg-base-200/70 rounded-xl p-6 flex flex-col items-center text-center transition hover:-translate-y-1 hover:shadow-lg hover:border-primary">
                            <WrenchScrewdriverIcon className="w-6 h-6 mb-3 opacity-70 group-hover:text-primary transition" />
                            <h2 className="font-semibold text-base mb-1">Done-for-you updates</h2>
                            <p className="text-sm text-base-content/70">
                                Send changes, get them done. No logins, no drag-and-drop stress.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="group border border-base-300 bg-base-200/70 rounded-xl p-6 flex flex-col items-center text-center transition hover:-translate-y-1 hover:shadow-lg hover:border-primary">
                            <ChartBarIcon className="w-6 h-6 mb-3 opacity-70 group-hover:text-primary transition" />
                            <h2 className="font-semibold text-base mb-1">Built to grow with you</h2>
                            <p className="text-sm text-base-content/70">
                                Clean, future-proof foundations ready for new services and offers.
                            </p>
                        </div>
                    </div>

                    {/* Primary CTAs  */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
                        <Link
                            href="/contact"
                            className="btn btn-primary btn-lg w-full justify-between md:justify-center gap-3"
                            aria-label="Book a free consultation"
                        >
                            <span>Book a free consultation</span>
                            <ArrowRightIcon className="w-5 h-5" />
                        </Link>

                        <Link
                            href="/pricing"
                            className="btn btn-outline btn-lg w-full"
                            aria-label="View pricing options"
                        >
                            See pricing options
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
