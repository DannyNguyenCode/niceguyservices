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
                        Ready to start your project?
                    </h3>
                    <p className="text-sm md:text-base text-base-content/80 max-w-xl">
                        I’ll walk you through everything — timelines, options, and the
                        simplest way to get a clean, modern website built.
                    </p>
                </div>

                <Link
                    href={`/${path}`}
                    className="btn btn-outline btn-primary normal-case rounded-full min-w-[180px] self-stretch md:self-auto text-center"
                >
                    Free Consult
                </Link>
            </div>
        </div>
    );
};

export default BannerCTA;
