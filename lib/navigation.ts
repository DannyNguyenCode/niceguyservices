export type NavLink = {
    title: string;
    href: string;
};

export type NavItem =
    | { type: "link"; title: string; href: string }
    | { type: "dropdown"; title: string; href: string; children: NavLink[] };

export const PRIMARY_CTA_LABEL = "Start a project";

export const mainNavigation: NavItem[] = [
    { type: "link", title: "Home", href: "/" },
    { type: "link", title: "Services", href: "/services" },
    {
        type: "dropdown",
        title: "Work",
        href: "/work",
        children: [
            { title: "Featured Work", href: "/work" },
            { title: "Website Inspirations", href: "/inspiration" },
        ],
    },
    { type: "link", title: "Pricing", href: "/pricing" },
    { type: "link", title: "Resources", href: "/resources" },
    { type: "link", title: "About", href: "/about" },
    { type: "link", title: "Contact", href: "/contact" },
];

export function isNavPathActive(pathname: string, href: string): boolean {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
}

export function isNavItemActive(pathname: string, item: NavItem): boolean {
    if (item.type === "link") return isNavPathActive(pathname, item.href);
    return (
        isNavPathActive(pathname, item.href) ||
        item.children.some((child) => isNavPathActive(pathname, child.href))
    );
}
