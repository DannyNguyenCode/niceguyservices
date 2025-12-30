"use client";

import React from "react";
import Link from "next/link";

const AboutCTA: React.FC = () => {
    return (
        <div className="card bg-base-100 border border-base-300 shadow-md mt-6">
            <div className="card-body flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div>
                    <h4 className="text-lg md:text-xl font-extrabold">
                        Want to talk through your project?
                    </h4>
                    <p className="text-sm md:text-base text-base-content/80 mt-1">
                        Reach out for a free consultation. We can start over email, hop on a
                        call, or — if you&apos;re local to Toronto — set up a quick
                        in-person chat.
                    </p>
                </div>

                <Link href="/contact" className="btn btn-outline btn-primary">
                    Try a Free Consultation
                </Link>
            </div>
        </div>
    );
};

export default AboutCTA;
