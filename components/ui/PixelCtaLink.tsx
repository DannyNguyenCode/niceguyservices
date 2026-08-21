import Link from "next/link";
import type { CSSProperties, MouseEvent, ReactNode } from "react";

type PixelCtaLinkProps = {
    href: string;
    children: ReactNode;
    className?: string;
    color?: string;
    fill?: string;
    textColor?: string;
    /** @deprecated CTAs are outline by default and fill on hover. Kept for call-site compat. */
    filled?: boolean;
    /** When false, skips hover fill (e.g. website audit). Default true. */
    hoverFill?: boolean;
    /** Keep accent label color on dark surfaces (skips light-theme navy outline text). */
    onDark?: boolean;
    pill?: boolean;
    xl?: boolean;
    block?: boolean;
    lg?: boolean;
    target?: string;
    rel?: string;
    onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

export default function PixelCtaLink({
    href,
    children,
    className = "",
    color = "var(--ng-btn-accent)",
    fill,
    textColor,
    filled: _filled = false,
    hoverFill = true,
    onDark = false,
    pill = true,
    xl = false,
    block = false,
    lg = false,
    target,
    rel,
    onClick,
}: PixelCtaLinkProps) {
    void _filled;
    const classes = [
        "pixel-btn-neon",
        !hoverFill && "pixel-btn-neon--no-hover-fill",
        onDark && "pixel-btn-neon--on-dark",
        pill && "pixel-btn-neon--pill",
        xl && "pixel-btn-neon--xl",
        block && "pixel-btn-neon--block",
        lg && "pixel-btn-neon--lg",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    const style = {
        "--pixel-btn-color": color,
        ...(fill ? { "--pixel-btn-fill": fill } : {}),
        ...(textColor ? { "--pixel-btn-text": textColor } : {}),
    } as CSSProperties;

    return (
        <Link href={href} className={classes} style={style} onClick={onClick} target={target} rel={rel}>
            {children}
        </Link>
    );
}
