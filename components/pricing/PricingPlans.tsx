"use client";

import React from "react";

const goToContact = () => {
    window.location.href = "/contact";
};

const PricingPlans: React.FC = () => {
    return (
        <div className="grid md:grid-cols-2 gap-6">
            {/* One-time Build */}
            <div className="card bg-base-100 border border-base-300 shadow-lg relative">
                <div className="badge badge-outline absolute top-4 right-4">
                    One-time • Full build
                </div>

                <div className="card-body space-y-3">
                    <h3 className="text-xl font-extrabold">Pay once, own the site.</h3>
                    <p className="text-sm opacity-70">
                        Best when you want a clear up-front investment to get your site
                        designed, built, and launched — with no long-term contract.
                    </p>

                    <p className="text-2xl font-bold">$2,000 – $5,000 one-time</p>

                    <div>
                        <h4 className="text-lg font-semibold mb-1">Includes</h4>
                        <ul className="list-disc ml-5 text-sm opacity-80 space-y-1">
                            <li>Full website (up to 5 pages)</li>
                            <li>Responsive, modern design</li>
                            <li>Deployment, DNS, and SSL setup</li>
                            <li>Clean, documented codebase</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-1">Does not include</h4>
                        <ul className="list-disc ml-5 text-sm opacity-80 space-y-1">
                            <li>Ongoing support or maintenance</li>
                            <li>Additional pages or features</li>
                            <li>Security monitoring</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-1">Future changes</h4>
                        <p className="text-sm opacity-80">$40/hr (2 hour minimum)</p>
                    </div>

                    <div className="bg-base-200 p-3 rounded-lg">
                        <h4 className="text-sm font-bold mb-1">Perfect if you:</h4>
                        <ul className="list-disc ml-5 text-sm opacity-80 space-y-1">
                            <li>Prefer a one-time project cost</li>
                            <li>Have technical help for future updates</li>
                            <li>Want a strong, modern foundation</li>
                        </ul>
                    </div>

                    <button className="btn btn-primary w-full mt-2" onClick={goToContact}>
                        Request A Free Quote
                    </button>
                </div>
            </div>

            {/* Subscription Plan */}
            <div className="card bg-base-100 border-2 border-primary shadow-xl relative">
                <div className="badge badge-primary absolute top-4 right-4">
                    Most Popular
                </div>

                <div className="card-body space-y-3">
                    <h3 className="text-xl font-extrabold">
                        Monthly care & improvements.
                    </h3>
                    <p className="text-sm opacity-70">
                        Best when you don't want to worry about hosting, updates, security,
                        or small changes.
                    </p>

                    <p className="text-2xl font-bold text-primary">From $150 / month</p>

                    <div>
                        <h4 className="text-lg font-semibold mb-1">Includes</h4>
                        <ul className="list-disc ml-5 text-sm opacity-80 space-y-1">
                            <li>Full website build, no upfront fee</li>
                            <li>Unlimited small updates</li>
                            <li>Backups, security patches, monitoring</li>
                            <li>Ongoing maintenance & priority support</li>
                        </ul>
                    </div>

                    <div className="bg-base-200 p-3 rounded-lg">
                        <h4 className="text-sm font-bold mb-1">Perfect if you:</h4>
                        <ul className="list-disc ml-5 text-sm opacity-80 space-y-1">
                            <li>Want a long-term partner</li>
                            <li>Never want to touch the tech side</li>
                            <li>Prefer predictable monthly costs</li>
                        </ul>
                    </div>

                    <button className="btn btn-primary w-full mt-2" onClick={goToContact}>
                        Request A Free Quote
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PricingPlans;
