import { formatWebsiteDate } from "@/lib/websiteAudit/format";
import type { SerializableWebsite } from "@/src/data/websites";

export type WebsiteListItemViewModel = {
    id: string;
    businessLabel: string;
    businessName: string | null;
    normalizedDomain: string;
    originalUrl: string;
    businessEmail: string | null;
    auditStatus: SerializableWebsite["auditStatus"];
    demoStatus: SerializableWebsite["demoStatus"];
    outreachStatus: SerializableWebsite["outreachStatus"];
    updatedAtLabel: string;
};

export function toWebsiteListViewModel(website: SerializableWebsite): WebsiteListItemViewModel {
    return {
        id: website.id,
        businessLabel: website.businessName?.trim() || website.normalizedDomain,
        businessName: website.businessName,
        normalizedDomain: website.normalizedDomain,
        originalUrl: website.originalUrl,
        businessEmail: website.businessEmail,
        auditStatus: website.auditStatus,
        demoStatus: website.demoStatus,
        outreachStatus: website.outreachStatus,
        updatedAtLabel: formatWebsiteDate(website.updatedAt),
    };
}

export function toWebsiteListViewModels(
    websites: SerializableWebsite[],
): WebsiteListItemViewModel[] {
    return websites.map(toWebsiteListViewModel);
}
