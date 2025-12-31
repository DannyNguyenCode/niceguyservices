"use client";

import React from "react";

const AboutSummaryCard: React.FC = () => {
    return (
        <div className="card bg-base-100 border border-base-300 shadow-md">
            <div className="card-body space-y-3">
                <h4 className="text-xl font-bold">
                    About Me — Professional, Warm, and Client-Focused
                </h4>
                <p className="text-sm md:text-base text-base-content ">
                    I help businesses, nonprofits, and creators transform outdated, slow,
                    or confusing websites into fast, secure, and user-friendly
                    experiences. I specialize in modern frameworks like React, Next.js,
                    Supabase, Python, and Angular — giving you the right balance of speed,
                    flexibility, and long-term reliability.
                </p>
                <p className="text-sm md:text-base text-base-content ">
                    My approach is simple: I build websites that are clean and
                    well-structured so they&apos;re easy to maintain. Your site stays
                    future-proof, readable, and inexpensive to update — whether I keep
                    working with you or you bring in another developer later.
                </p>
            </div>
        </div>
    );
};

export default AboutSummaryCard;
