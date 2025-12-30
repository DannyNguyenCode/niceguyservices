// services/ServiceDetailBlock.tsx
"use client";

import React from "react";

export default function ServiceDetailBlock({ item }: any) {
    return (
        <div className="card bg-base-100 border border-base-300 shadow-md">
            <div className="card-body space-y-4">
                <h3 className="text-xl font-extrabold">{item.title}</h3>

                <p className="text-sm text-base-content/80">{item.details.description}</p>

                <div>
                    <h4 className="text-lg font-bold mb-2">What You Get</h4>
                    <ul className="space-y-1">
                        {item.details.includes.map((x: string, i: number) => (
                            <li key={i} className="flex gap-2 text-sm">
                                <span className="h-2 w-2 bg-primary rounded-full mt-1" />
                                <span>{x}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="text-lg font-bold mb-2">The Process</h4>
                    <ul className="space-y-3">
                        {item.details.process.map((p: any, i: number) => (
                            <li key={i} className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold">
                                    {i + 1}
                                </div>
                                <div>
                                    <p className="font-semibold">{p.step}</p>
                                    <p className="text-sm text-base-content/80">{p.desc}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <a href="#contact" className="btn btn-secondary normal-case mt-2">
                    Request a Free Quote
                </a>
            </div>
        </div>
    );
}
