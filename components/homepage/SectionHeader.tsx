"use client";

import React from "react";
import Image from "next/image";
import { BoltIcon, WrenchScrewdriverIcon, ChartBarIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

const benefits = [
    "No more website headaches",
    "Done-for-you updates",
    "Built to grow with you",
];

export default function SectionHeader({
    contentHeight,
}: {
    contentHeight: number;
}) {
    return (
        <section className="bg-base-100">
            {/* ROW 1 – Background image with title + subtitle */}
            <div className="relative w-full min-h-80 md:min-h-[420px] lg:min-h-[480px] overflow-hidden">
                {/* Background image */}
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/images/imageHeader.png')" }} // ← update path
                />

                {/* Gradient overlay for readability */}
                <div className="absolute inset-0 bg-linear-to-r from-base-300/80 via-base-100/70 to-transparent" />

                {/* Text content */}
                <div className="relative max-w-6xl mx-auto px-4 py-12 md:py-16 flex flex-col justify-center">
                    <div className="badge badge-outline bg-base-100/80 backdrop-blur mb-4 w-fit">
                        Built for busy business owners
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-primary-content drop-shadow-sm">
                        Nice Guy Services
                    </h1>

                    <p className="mt-3 text-xl md:text-2xl font-semibold text-primary-content drop-shadow-sm">
                        <span className="text-accent">A WEB DEVELOPMENT</span> COMPANY
                    </p>

                    <p className="mt-4 max-w-xl text-base md:text-lg text-primary-content/90 drop-shadow-sm">
                        I handle the technical side with clean code, reliable updates, and
                        long-term care — giving you peace of mind and more time to focus on
                        your business goals.
                    </p>
                </div>
            </div>

            {/* ROW 2 – Remaining content (chips + buttons) */}
            {/* INTERACTIVE CTA STRIP */}
            <section className="bg-base-100 border-t border-base-300 shadow-[0_-10px_35px_rgba(0,0,0,0.12)]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:p-6 justify-around">
                    {/* Card 1 */}
                    <div
                        className="
      group
      border border-base-300
      bg-base-200/70
      rounded-xl
      p-6
      flex flex-col items-center text-center
      transition
      hover:-translate-y-1
      hover:shadow-lg
      hover:border-primary
      
    "
                    >
                        <BoltIcon className="w-6 h-6 mb-3 opacity-70 group-hover:text-primary transition" />
                        <h3 className="font-semibold text-base mb-1">
                            No more website headaches
                        </h3>
                        <p className="text-sm text-base-content/70">
                            I’ll handle bugs, hosting, and tech so it stops living in your head.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div
                        className="
      group
      border border-base-300
      bg-base-200/70
      rounded-xl
      p-6
      h-full
      flex flex-col items-center text-center
      transition
      hover:-translate-y-1
      hover:shadow-lg
      hover:border-primary
    "
                    >
                        <WrenchScrewdriverIcon className="w-6 h-6 mb-3 opacity-70 group-hover:text-primary transition" />
                        <h3 className="font-semibold text-base mb-1">
                            Done-for-you updates
                        </h3>
                        <p className="text-sm text-base-content/70">
                            Send changes, get them done. No logins, no drag-and-drop stress.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div
                        className="
      group
      border border-base-300
      bg-base-200/70
      rounded-xl
      p-6
      h-full
      flex flex-col items-center text-center
      transition
      hover:-translate-y-1
      hover:shadow-lg
      hover:border-primary
    "
                    >
                        <ChartBarIcon className="w-6 h-6 mb-3 opacity-70 group-hover:text-primary transition" />
                        <h3 className="font-semibold text-base mb-1">
                            Built to grow with you
                        </h3>
                        <p className="text-sm text-base-content/70">
                            Clean, future-proof foundations ready for new services and offers.
                        </p>
                    </div>
                </div>

                {/* Primary CTAs */}
                <div className="grid grid-cols-2 md:grid-cols-[2fr,1.2fr] gap-4 pt-2 mx-6 mb-6">
                    <button
                        type="button"
                        className="btn btn-primary btn-lg w-full justify-between md:justify-center gap-3"
                    >
                        <span>Book a free consultation</span>
                        <ArrowRightIcon className="w-5 h-5" />
                    </button>

                    <button
                        type="button"
                        className="btn btn-outline btn-lg w-full"
                    >
                        See pricing options
                    </button>
                </div>


            </section>


        </section >
    );
}
