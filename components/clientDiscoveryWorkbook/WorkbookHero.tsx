"use client";

import type { WorkbookPageMeta } from "@/lib/clientDiscoveryWorkbook/types";
import { getSiteLogoForTheme } from "@/lib/siteConfig";
import { useTheme } from "@/components/theme/ThemeProvider";
import Image from "next/image";
import { workbookContentClass } from "./workbookLayoutConstants";

export function WorkbookHero({ page }: { page: WorkbookPageMeta }) {
    const { theme } = useTheme();
    const logoSrc = getSiteLogoForTheme(theme);

    return (
        <header className="workbook-no-print border-b border-base-300/60 bg-(--pm-surface)">
            <div className={`${workbookContentClass} flex flex-col gap-4 py-10 md:py-14`}>
                <Image
                    src={logoSrc}
                    width={160}
                    height={160}
                    alt="Nice Guy Web Design"
                    className="h-14 w-auto max-w-[180px] object-contain object-left md:h-16"
                    priority
                />
                <h1 className="font-pm-headline text-lg font-bold text-(--pm-on-surface) md:text-lg">
                    {page.title}
                </h1>
                <p className="max-w-3xl text-base leading-relaxed text-(--pm-on-surface-variant) md:text-lg">
                    {page.subtitle}
                </p>
                <p className="max-w-3xl text-base leading-relaxed text-(--pm-on-surface)">
                    {page.purpose}
                </p>
                <ul className="flex flex-col gap-2 text-sm text-(--pm-on-surface-variant) md:flex-row md:flex-wrap md:gap-4">
                    {page.completionOptions.map((option) => (
                        <li key={option} className="flex items-center gap-2">
                            <span
                                className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                                aria-hidden
                            />
                            {option}
                        </li>
                    ))}
                </ul>
            </div>
        </header>
    );
}
