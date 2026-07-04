import type { HTMLAttributes } from "react";

type MIconProps = {
    /** Material Symbol ligature, e.g. "mail", "send". */
    icon: string;
} & Pick<HTMLAttributes<HTMLSpanElement>, "className" | "title" | "style">;

/** Material Symbols Outlined; font is loaded in `app/globals.css`. */
export function MIcon({ icon, className = "", style, ...rest }: MIconProps) {
    return (
        <span
            className={`material-symbols-outlined select-none ${className}`.trim()}
            style={{
                fontFamily: '"Material Symbols Outlined", sans-serif',
                ...style,
            }}
            aria-hidden
            {...rest}
        >
            {icon}
        </span>
    );
}
