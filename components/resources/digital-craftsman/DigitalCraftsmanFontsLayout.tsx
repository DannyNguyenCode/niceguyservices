import { DM_Sans, JetBrains_Mono, Newsreader } from "next/font/google";

const dmSans = DM_Sans({
    subsets: ["latin"],
    variable: "--font-ga-body-loaded",
});

const newsreader = Newsreader({
    subsets: ["latin"],
    variable: "--font-ga-display-loaded",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-ga-code-loaded",
});

export default function DigitalCraftsmanFontsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
                rel="stylesheet"
            />
            <div
                className={`${dmSans.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}
            >
                {children}
            </div>
        </>
    );
}
