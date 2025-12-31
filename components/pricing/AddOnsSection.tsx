"use client";

import React from "react";

const AddOnsSection: React.FC = () => {
    return (
        <div className="card bg-base-100 border border-base-300 p-6 shadow-md space-y-6">
            <h3 className="text-2xl font-bold">Add-Ons</h3>
            <p className="text-sm  ">
                Typical price ranges depending on complexity.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="card border border-base-300 p-4">
                    <h4 className="font-semibold">Extra Pages</h4>
                    <ul className="text-sm   mt-2 space-y-1">
                        <li>Standard page: $80–$120</li>
                        <li>Feature page: $150–$300</li>
                        <li>Dynamic page: $300–$600</li>
                    </ul>
                </div>

                <div className="card border border-base-300 p-4">
                    <h4 className="font-semibold">Design & Campaigns</h4>
                    <ul className="text-sm   mt-2 space-y-1">
                        <li>Theme variations: $100–$250</li>
                        <li>Landing pages: $250–$600</li>
                    </ul>
                </div>

                <div className="card border border-base-300 p-4">
                    <h4 className="font-semibold">E-Commerce Add-ons</h4>
                    <ul className="text-sm   mt-2 space-y-1">
                        <li>Basic catalog: $300–$500</li>
                        <li>Full checkout: $600–$1,200</li>
                    </ul>
                </div>
            </div>

            <button
                className="btn btn-primary w-fit"
                onClick={() => (window.location.href = "/contact")}
            >
                Request A Free Quote
            </button>
        </div>
    );
};

export default AddOnsSection;
