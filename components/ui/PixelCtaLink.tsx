import Link from "next/link";
import type { CSSProperties, MouseEvent, ReactNode } from "react";

type PixelCtaLinkProps = {
    href: string;
    children: ReactNode;
    className?: string;
    color?: string;
    fill?: string;
    textColor?: string;
    filled?: boolean;
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
    filled = false,
    pill = false,
    xl = false,
    block = false,
    lg = false,
    target,
    rel,
    onClick,
}: PixelCtaLinkProps) {
    const classes = [
        "pixel-btn-neon",
        filled && "pixel-btn-neon--filled",
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
