import type { PageType } from "@/src/schemas/enums";

const DOWNLOAD_EXTENSIONS = new Set([
    ".pdf",
    ".zip",
    ".rar",
    ".7z",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".ppt",
    ".pptx",
    ".mp4",
    ".mp3",
    ".avi",
    ".mov",
    ".wmv",
    ".webm",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".svg",
    ".ico",
    ".css",
    ".js",
    ".json",
    ".xml",
]);

const BLOCKED_PATH_PATTERNS = [
    /\/wp-admin(?:\/|$)/i,
    /\/admin(?:\/|$)/i,
    /\/login(?:\/|$)/i,
    /\/signin(?:\/|$)/i,
    /\/sign-in(?:\/|$)/i,
    /\/cart(?:\/|$)/i,
    /\/checkout(?:\/|$)/i,
    /\/account(?:\/|$)/i,
    /\/my-account(?:\/|$)/i,
    /\/search(?:\/|$|\?)/i,
    /\/register(?:\/|$)/i,
    /\/signup(?:\/|$)/i,
];

const ABOUT_PATTERNS = [
    /^\/about(?:\/|$)/i,
    /^\/about-us(?:\/|$)/i,
    /^\/company(?:\/|$)/i,
    /^\/who-we-are(?:\/|$)/i,
    /^\/our-story(?:\/|$)/i,
];

const CONTACT_PATTERNS = [
    /^\/contact(?:\/|$)/i,
    /^\/contact-us(?:\/|$)/i,
    /^\/get-in-touch(?:\/|$)/i,
    /^\/reach-us(?:\/|$)/i,
];

const SERVICES_PATTERNS = [
    /^\/services(?:\/|$)/i,
    /^\/our-services(?:\/|$)/i,
    /^\/solutions(?:\/|$)/i,
    /^\/what-we-do(?:\/|$)/i,
];

const PRIVACY_PATTERNS = [/^\/privacy(?:-policy)?(?:\/|$)/i];
const TERMS_PATTERNS = [/^\/terms(?:-of-service|-and-conditions)?(?:\/|$)/i];

export function normalizeCrawlUrl(url: URL, baseDomain: string): string | null {
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (url.username || url.password) return null;

    const hostname = url.hostname.toLowerCase().replace(/\.$/, "");
    const domain = baseDomain.toLowerCase();
    const isSameDomain =
        hostname === domain || hostname === `www.${domain}` || hostname.endsWith(`.${domain}`);

    if (!isSameDomain) return null;

    url.hash = "";
    if (url.pathname !== "/") {
        url.pathname = url.pathname.replace(/\/+$/, "") || "/";
    }

    const searchParams = [...url.searchParams.entries()];
    if (searchParams.length > 0) {
        const hasOnlyBenignParams = searchParams.every(([key]) =>
            ["lang", "locale", "utm_source", "utm_medium", "utm_campaign"].includes(
                key.toLowerCase(),
            ),
        );
        if (!hasOnlyBenignParams) {
            url.search = "";
        }
    }

    return url.toString();
}

export function getUrlPath(urlString: string): string {
    try {
        const parsed = new URL(urlString);
        return parsed.pathname || "/";
    } catch {
        return "/";
    }
}

export function isBlockedCrawlPath(pathname: string): boolean {
    if (!pathname || pathname === "/") return false;
    const lowerPath = pathname.toLowerCase();
    const extension = lowerPath.slice(lowerPath.lastIndexOf("."));
    if (DOWNLOAD_EXTENSIONS.has(extension)) return true;
    return BLOCKED_PATH_PATTERNS.some((pattern) => pattern.test(pathname));
}

export function classifyPageType(input: {
    url: string;
    path?: string;
    title?: string;
    anchorText?: string;
    isHome?: boolean;
}): PageType {
    if (input.isHome) return "home";

    const path = (input.path ?? getUrlPath(input.url)).toLowerCase();
    const title = (input.title ?? "").toLowerCase();
    const anchor = (input.anchorText ?? "").toLowerCase();
    const combined = `${path} ${title} ${anchor}`;

    if (path === "/" || path === "") return "home";
    if (ABOUT_PATTERNS.some((pattern) => pattern.test(path)) || /\babout\b/.test(combined)) {
        return "about";
    }
    if (
        CONTACT_PATTERNS.some((pattern) => pattern.test(path)) ||
        /\bcontact\b/.test(combined)
    ) {
        return "contact";
    }
    if (
        SERVICES_PATTERNS.some((pattern) => pattern.test(path)) ||
        /\bservices\b|\bsolutions\b|\bwhat we do\b/.test(combined)
    ) {
        return path.split("/").filter(Boolean).length > 1 ? "service-detail" : "services";
    }

    if (
        path.startsWith("/services/") ||
        path.startsWith("/our-services/") ||
        path.startsWith("/solutions/")
    ) {
        return "service-detail";
    }

    return "other";
}

export function hasAboutPath(path: string): boolean {
    return ABOUT_PATTERNS.some((pattern) => pattern.test(path));
}

export function hasContactPath(path: string): boolean {
    return CONTACT_PATTERNS.some((pattern) => pattern.test(path));
}

export function hasServicesPath(path: string): boolean {
    return SERVICES_PATTERNS.some((pattern) => pattern.test(path));
}

export function hasPrivacyPath(path: string): boolean {
    return PRIVACY_PATTERNS.some((pattern) => pattern.test(path));
}

export function hasTermsPath(path: string): boolean {
    return TERMS_PATTERNS.some((pattern) => pattern.test(path));
}

export function scoreLinkForCrawl(input: {
    url: string;
    anchorText?: string;
}): { pageType: PageType; priority: number } {
    const path = getUrlPath(input.url);
    const pageType = classifyPageType({
        url: input.url,
        path,
        anchorText: input.anchorText,
    });

    const priorityMap: Record<PageType, number> = {
        home: 100,
        about: 90,
        contact: 85,
        services: 80,
        "service-detail": 70,
        other: 10,
    };

    return { pageType, priority: priorityMap[pageType] };
}

export function dedupeStrings(values: string[]): string[] {
    return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

export function truncateVisibleText(text: string, maxLength: number): string {
    const normalized = text.replace(/\s+/g, " ").trim();
    if (normalized.length <= maxLength) return normalized;
    return `${normalized.slice(0, maxLength)}…`;
}

const EMAIL_PATTERN =
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const PHONE_PATTERN =
    /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}\b/g;

const SOCIAL_PATTERNS = [
    /https?:\/\/(?:www\.)?facebook\.com\/[^\s"'<>]+/gi,
    /https?:\/\/(?:www\.)?instagram\.com\/[^\s"'<>]+/gi,
    /https?:\/\/(?:www\.)?linkedin\.com\/[^\s"'<>]+/gi,
    /https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/[^\s"'<>]+/gi,
    /https?:\/\/(?:www\.)?youtube\.com\/[^\s"'<>]+/gi,
    /https?:\/\/(?:www\.)?tiktok\.com\/[^\s"'<>]+/gi,
];

export function extractEmails(text: string, mailtoLinks: string[] = []): string[] {
    const emails = new Set<string>();
    for (const match of text.matchAll(EMAIL_PATTERN)) {
        emails.add(match[0].toLowerCase());
    }
    for (const link of mailtoLinks) {
        const email = link.replace(/^mailto:/i, "").split("?")[0].trim().toLowerCase();
        if (email) emails.add(email);
    }
    return [...emails];
}

export function extractPhoneNumbers(text: string, telLinks: string[] = []): string[] {
    const phones = new Set<string>();
    for (const match of text.matchAll(PHONE_PATTERN)) {
        phones.add(match[0].trim());
    }
    for (const link of telLinks) {
        const phone = link.replace(/^tel:/i, "").split("?")[0].trim();
        if (phone) phones.add(phone);
    }
    return [...phones];
}

export function extractSocialLinks(values: string[]): string[] {
    const links = new Set<string>();
    for (const value of values) {
        for (const pattern of SOCIAL_PATTERNS) {
            for (const match of value.matchAll(pattern)) {
                links.add(match[0]);
            }
        }
    }
    return [...links];
}

export function selectPagesToCrawl(input: {
    homepageUrl: string;
    discoveredLinks: Array<{ url: string; anchorText?: string }>;
    maxPages: number;
}): string[] {
    const selected: string[] = [input.homepageUrl];
    const seen = new Set<string>([input.homepageUrl]);

    const candidates = input.discoveredLinks
        .map((link) => {
            const { pageType, priority } = scoreLinkForCrawl(link);
            return { ...link, pageType, priority };
        })
        .filter((link) => !seen.has(link.url) && !isBlockedCrawlPath(getUrlPath(link.url)))
        .sort((a, b) => b.priority - a.priority);

    const pickByType = (type: PageType) => {
        const match = candidates.find((candidate) => candidate.pageType === type);
        if (!match || seen.has(match.url)) return;
        selected.push(match.url);
        seen.add(match.url);
    };

    pickByType("about");
    pickByType("contact");
    pickByType("services");

    const serviceDetail = candidates.find(
        (candidate) => candidate.pageType === "service-detail",
    );
    if (serviceDetail && !seen.has(serviceDetail.url)) {
        selected.push(serviceDetail.url);
        seen.add(serviceDetail.url);
    }

    for (const candidate of candidates) {
        if (selected.length >= input.maxPages) break;
        if (seen.has(candidate.url)) continue;
        selected.push(candidate.url);
        seen.add(candidate.url);
    }

    return selected.slice(0, input.maxPages);
}
