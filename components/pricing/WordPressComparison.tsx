"use client";

import React from "react";

interface WordpressComparisonProps {
    onOpenBreakdown: () => void;
}

const WordpressComparison: React.FC<WordpressComparisonProps> = ({
    onOpenBreakdown,
}) => {
    return (
        <div className="card bg-base-100 border border-base-300 p-6 shadow-md space-y-6">
            <div>
                <h3 className="text-2xl font-bold">
                    WordPress Template vs Modern Custom Build
                </h3>
                <p className="text-sm opacity-70 mt-1">
                    Why a $50 template often becomes $1,000–$2,000+ after setup.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* WordPress Side */}
                <div className="card border border-base-300 p-5 bg-base-100 shadow-inner">
                    <h4 className="font-bold uppercase text-xs opacity-70">Option A</h4>
                    <h3 className="text-lg font-semibold mb-2">
                        WordPress Template Setup
                    </h3>

                    <ul className="space-y-1 text-sm opacity-80">
                        <li>Template: ~$50</li>
                        <li>Developer setup: $600–$1,600</li>
                        <li>Hosting & plugins: $20–$60/month</li>
                    </ul>

                    <p className="text-sm opacity-70 mt-3">
                        Templates still need custom work, plugins, updates, and constant
                        maintenance.
                    </p>
                </div>

                {/* Modern Stack */}
                <div className="card border border-base-300 p-5 bg-base-100 shadow-inner">
                    <h4 className="font-bold uppercase text-xs opacity-70">Option B</h4>
                    <h3 className="text-lg font-semibold mb-2">Custom Modern Build</h3>

                    <ul className="space-y-1 text-sm opacity-80">
                        <li>One-time build: $1,600 (up to 5 pages)</li>
                        <li>Next.js, React, modern tech stack</li>
                        <li>Hosting usually $20–$30/month</li>
                    </ul>

                    <p className="text-sm opacity-70 mt-3">
                        Clean code, fast performance, secure, scalable, and easier for
                        future developers.
                    </p>
                </div>
            </div>

            <button
                className="btn btn-outline btn-primary mt-4"
                onClick={onOpenBreakdown}
            >
                View Full Cost Breakdown
            </button>
        </div>
    );
};

export default WordpressComparison;
