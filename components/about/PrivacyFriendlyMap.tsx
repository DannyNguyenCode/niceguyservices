"use client";

import React, { useState } from "react";

const PrivacyFriendlyMap: React.FC = () => {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className="mt-2 rounded-xl overflow-hidden border border-base-300 h-56 relative bg-base-200">
            {!loaded ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-center px-4 bg-base-200/90">
                    <h4 className="font-semibold mb-1">
                        Map preview is disabled for privacy
                    </h4>
                    <p className="text-sm text-base-content/70 mb-3 max-w-md">
                        Click below to load an interactive Google Map. This may allow Google
                        to set cookies and collect usage data.
                    </p>
                    <button
                        className="btn btn-primary btn-sm normal-case rounded-full"
                        onClick={() => setLoaded(true)}
                    >
                        Load Google Map
                    </button>
                </div>
            ) : (
                <iframe
                    title="Toronto Meeting Area"
                    src="https://www.google.com/maps?q=Toronto,%20ON&output=embed"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full border-0"
                />
            )}
        </div>
    );
};

export default PrivacyFriendlyMap;
