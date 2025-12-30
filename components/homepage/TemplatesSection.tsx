"use client";

import React from "react";

export default function TemplatesSection() {
    const templates = [
        {
            title: "Basic Template",
            desc: "Simple, clean, and fast. Great for small services.",
        },
        {
            title: "Medium Template",
            desc: "More structure, more content, more flexibility.",
        },
        {
            title: "Complex Template",
            desc: "Full layouts, advanced sections, animations, CMS-ready.",
        },
    ];

    return (
        <section className="py-10 md:py-16 px-4 bg-base-200">
            {/* Header */}
            <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-8">
                Website Templates (3 Versions)
            </h2>

            {/* Templates Grid */}
            <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
                {templates.map((t, i) => (
                    <div
                        key={i}
                        className="card bg-base-100 border border-base-300 shadow-lg hover:shadow-xl transition p-6"
                    >
                        <h3 className="text-xl font-bold mb-2">{t.title}</h3>
                        <p className="text-sm text-base-content/70">{t.desc}</p>

                        <div className="mt-4">
                            <button className="btn btn-outline btn-primary w-full">
                                Preview
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
