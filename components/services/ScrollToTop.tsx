// services/ScrollToTop.tsx
"use client";

import React from "react";

export default function ScrollToTop() {
    return (
        <button
            className="btn btn-primary btn-circle fixed bottom-6 right-6 shadow-lg"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
            ↑
        </button>
    );
}
