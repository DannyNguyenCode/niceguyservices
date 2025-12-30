"use client";

import React from "react";

const ConsultCTA: React.FC = () => {
    return (
        <div className="card bg-neutral text-neutral-content p-6 shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-xl font-bold">
                        Not sure which option fits you best?
                    </h3>
                    <p className="text-sm opacity-90 mt-1">
                        Tell me about your business and what’s not working — I’ll recommend
                        the simplest option.
                    </p>
                </div>

                <button
                    className="btn btn-outline btn-accent"
                    onClick={() => (window.location.href = "/contact")}
                >
                    Get a Free Consult
                </button>
            </div>
        </div>
    );
};

export default ConsultCTA;
