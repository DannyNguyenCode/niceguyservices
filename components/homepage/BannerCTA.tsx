"use client";

import React from "react";
import Link from "next/link";

interface BannerCTAProps {
    path: string;
}

const BannerCTA: React.FC<BannerCTAProps> = ({ path }) => {
    return (
        <div className="card bg-base-100 border border-base-300 shadow-lg">
            <div className="card-body flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center justify-between">
                <div className="space-y-2">
                    <h3 className="text-xl md:text-2xl font-extrabold">
                        Ready to build a better website for your small business?
                    </h3>
                    <p className="text-sm md:text-base text-base-content/80 max-w-xl">
                        I’ll walk you through timelines, options, and the simplest way to get
                        a fast, modern, SEO-ready website — without pressure or technical
                        headaches.
                    </p>
                </div>

                <Link
                    href={`/${path}`}
                    aria-label="Book a free website consultation"
                    className="btn btn-outline btn-primary normal-case rounded-full min-w-[180px] self-stretch md:self-auto text-center"
                >
                    Book a free consultation
                </Link>
            </div>
        </div>
    );
};

export default BannerCTA;
