"use client";

import React from "react";

const WorkingWithMeCard: React.FC = () => {
    return (
        <div className="card bg-base-100 border border-base-300 shadow-md">
            <div className="card-body space-y-4">
                <h4 className="text-xl font-bold">What Working With Me Is Like</h4>

                <div className="space-y-1">
                    <h5 className="text-sm md:text-base font-semibold">
                        I’m easy to work with &amp; communicate clearly
                    </h5>
                    <p className="text-sm text-base-content/80">
                        I have around <strong>2 years of customer service experience</strong>
                        , both front-facing and over the phone, as well as time spent
                        supporting students and faculty at Seneca Polytechnic. That taught
                        me how to listen, stay calm under pressure, and explain technical
                        concepts in plain language. You’ll always know what’s happening, why
                        decisions are being made, and what to expect next.
                    </p>
                </div>

                <div className="space-y-1">
                    <h5 className="text-sm md:text-base font-semibold">
                        I turn complex requirements into simple, user-friendly solutions
                    </h5>
                    <p className="text-sm text-base-content/80">
                        Whether it was secure payment flows at Shipvista — a shipping
                        company providing labels and real-time rates — or real-time gameplay
                        logic in my Pokémon project, I’m comfortable solving hard problems
                        and turning them into experiences your customers actually enjoy
                        using.
                    </p>
                </div>

                <div className="space-y-1">
                    <h5 className="text-sm md:text-base font-semibold">
                        I care about long-term maintainability
                    </h5>
                    <p className="text-sm text-base-content/80">
                        I don’t just build something that “works for now.” I focus on fast
                        load times, modern best practices, clean architecture, and patterns
                        that stay easy to maintain years from now — even if another
                        developer takes over.
                    </p>
                </div>

                <div className="space-y-1">
                    <h5 className="text-sm md:text-base font-semibold">
                        Curiosity drives how I work
                    </h5>
                    <p className="text-sm text-base-content/80">
                        I like to learn. When your project needs something I haven&apos;t
                        seen before — a new tool, API, or workflow — I get genuinely excited
                        to dig in, understand it, and implement it properly. That curiosity
                        helps your business benefit from modern solutions, not just the
                        “safe old way” of doing things.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WorkingWithMeCard;
