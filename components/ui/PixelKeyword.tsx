import type { ReactNode } from "react";

type PixelKeywordProps = {
    children: ReactNode;
    variant?: "highlight" | "base";
    className?: string;
};

export default function PixelKeyword({
    children,
    variant = "highlight",
    className = "",
}: PixelKeywordProps) {
    const variantClass =
        variant === "base" ? "ng-pixel-word-base" : "ng-pixel-word-highlight";

    return (
        <span
            className={["pixel-word", variantClass, className]
                .filter(Boolean)
                .join(" ")}
        >
            {children}
        </span>
    );
}
