import type { HTMLAttributes } from "react";

type MIconProps = {
    /** Material Symbol ligature, e.g. "mail", "send". */
    icon: string;
} & Pick<HTMLAttributes<HTMLSpanElement>, "className" | "title" | "style">;

/** Material Symbols Outlined; font is loaded in `app/globals.css`. */
export function MIcon({ icon, className = "", ...rest }: MIconProps) {
    return (
        <span
            className={`material-symbols-outlined select-none ${className}`.trim()}
            aria-hidden
            {...rest}
        >
            {icon}
        </span>
    );
}
