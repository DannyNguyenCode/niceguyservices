"use client";

import React from "react";

const WhySubscription: React.FC = () => {
    return (
        <div className="card bg-base-100 border border-base-300 p-6 shadow-md space-y-6">
            <h3 className="text-2xl font-bold">
                Why Clients Choose the Subscription Model
            </h3>

            <div className="grid md:grid-cols-3 gap-4">
                <div className="card border border-base-300 p-4">
                    <h4 className="font-bold mb-1">Easier on Cash Flow</h4>
                    <p className="text-sm opacity-70">
                        Instead of paying thousands up front, pay a predictable monthly fee.
                    </p>
                </div>
                <div className="card border border-base-300 p-4">
                    <h4 className="font-bold mb-1">Everything Managed for You</h4>
                    <p className="text-sm opacity-70">
                        No plugins, no updates, no stress. I handle it all.
                    </p>
                </div>
                <div className="card border border-base-300 p-4">
                    <h4 className="font-bold mb-1">Built for Long-Term Growth</h4>
                    <p className="text-sm opacity-70">
                        Ranking in Google takes time — the subscription model supports
                        long-term success.
                    </p>
                </div>
            </div>

            <button
                className="btn btn-primary mt-2 w-fit"
                onClick={() => (window.location.href = "/contact")}
            >
                See If the Monthly Plan Fits You
            </button>
        </div>
    );
};

export default WhySubscription;
