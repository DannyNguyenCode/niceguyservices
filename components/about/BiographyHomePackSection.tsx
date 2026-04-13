"use client";

import { HeartIcon, PuzzlePieceIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import type { OutsideWork, PetPortrait } from "./aboutBiographyTypes";

type BiographyHomePackSectionProps = {
    sectionTitle: string;
    outsideWork: OutsideWork;
    petPortraits: PetPortrait[];
};

export default function BiographyHomePackSection({
    sectionTitle,
    outsideWork,
    petPortraits,
}: BiographyHomePackSectionProps) {
    return (
        <section className="overflow-hidden py-24">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
                <div className="mb-16 flex flex-col items-end justify-between gap-6 md:flex-row">
                    <div className="max-w-2xl">
                        <h2 className="font-pm-headline mb-4 text-4xl font-bold tracking-tight">
                            {sectionTitle}
                        </h2>
                        <p className="text-lg text-(--pm-on-surface-variant)">
                            {outsideWork.before}
                            <span className="font-bold text-primary">
                                {outsideWork.emphasis}
                            </span>
                            {outsideWork.after}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <div className="bg-(--pm-surface-highest) flex h-12 w-12 items-center justify-center rounded-full">
                            <PuzzlePieceIcon
                                className="h-6 w-6 text-(--pm-on-surface)"
                                aria-hidden
                            />
                        </div>
                        <div className="bg-(--pm-surface-highest) flex h-12 w-12 items-center justify-center rounded-full">
                            <HeartIcon
                                className="h-6 w-6 text-(--pm-on-surface)"
                                aria-hidden
                            />
                        </div>
                    </div>
                </div>
                {petPortraits.length > 0 ? (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {petPortraits.map((pet, i) => (
                            <div
                                key={pet.src}
                                className={`group relative overflow-hidden rounded-3xl border border-(--pm-outline-variant)/15 bg-(--pm-white) p-4 transition-all duration-500 hover:shadow-2xl dark:bg-base-100 ${
                                    i === 1 ? "mt-8 md:mt-16" : ""
                                } ${i === 2 ? "mt-16 md:mt-32" : ""}`}
                            >
                                <Image
                                    src={pet.src}
                                    alt={pet.alt}
                                    width={600}
                                    height={600}
                                    className="mb-6 aspect-square w-full rounded-2xl object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="px-4 pb-4">
                                    <h3 className="font-pm-headline text-2xl font-bold">
                                        {pet.name ?? pet.alt}
                                    </h3>
                                    <p className="text-(--pm-on-surface-variant)">
                                        {pet.tagline ?? ""}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>
        </section>
    );
}
