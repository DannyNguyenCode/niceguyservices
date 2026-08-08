import "server-only";

import mongoose from "mongoose";
import type { CrawlStatus } from "@/src/schemas/enums";
import { connectToDatabase } from "@/src/lib/mongodb";
import { CrawlData, type CrawlDataLean } from "@/src/models/CrawlData";
import type { CrawlPageResult } from "@/src/schemas/crawl-data";

export type SerializableCrawl = {
    id: string;
    websiteId: string;
    auditRunId?: string | null;
    status: CrawlStatus;
    startedAt: string | null;
    completedAt: string | null;
    requestedUrl: string;
    finalUrl: string;
    homepageTitle: string;
    metaDescription: string;
    language: string;
    pagesDiscovered: number;
    pagesCrawled: number;
    internalLinks: string[];
    externalLinks: string[];
    emailsFound: string[];
    phoneNumbersFound: string[];
    socialLinks: string[];
    hasAboutPage: boolean;
    hasContactPage: boolean;
    hasServicesPage: boolean;
    hasPrivacyPolicy: boolean;
    hasTerms: boolean;
    pageResults: CrawlPageResult[];
    crawlDurationMs: number;
    errorMessage: string | null;
    createdAt: string;
    updatedAt: string;
};

export class CrawlDataError extends Error {
    readonly code: "invalid-id" | "not-found" | "duplicate" | "database";

    constructor(code: CrawlDataError["code"], message: string) {
        super(message);
        this.name = "CrawlDataError";
        this.code = code;
    }
}

function assertObjectId(id: string, message = "Invalid ID."): mongoose.Types.ObjectId {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new CrawlDataError("invalid-id", message);
    }
    return new mongoose.Types.ObjectId(id);
}

function toSerializable(doc: CrawlDataLean): SerializableCrawl {
    return {
        id: String(doc._id),
        websiteId: String(doc.websiteId),
        auditRunId: (doc as CrawlDataLean).auditRunId
            ? String((doc as CrawlDataLean).auditRunId)
            : null,
        status: doc.status,
        startedAt: doc.startedAt ? new Date(doc.startedAt).toISOString() : null,
        completedAt: doc.completedAt
            ? new Date(doc.completedAt).toISOString()
            : null,
        requestedUrl: doc.requestedUrl || "",
        finalUrl: doc.finalUrl || "",
        homepageTitle: doc.homepageTitle || "",
        metaDescription: doc.metaDescription || "",
        language: doc.language || "",
        pagesDiscovered: doc.pagesDiscovered ?? 0,
        pagesCrawled: doc.pagesCrawled ?? 0,
        internalLinks: doc.internalLinks ?? [],
        externalLinks: doc.externalLinks ?? [],
        emailsFound: doc.emailsFound ?? [],
        phoneNumbersFound: doc.phoneNumbersFound ?? [],
        socialLinks: doc.socialLinks ?? [],
        hasAboutPage: doc.hasAboutPage ?? false,
        hasContactPage: doc.hasContactPage ?? false,
        hasServicesPage: doc.hasServicesPage ?? false,
        hasPrivacyPolicy: doc.hasPrivacyPolicy ?? false,
        hasTerms: doc.hasTerms ?? false,
        pageResults: doc.pageResults ?? [],
        crawlDurationMs: doc.crawlDurationMs ?? 0,
        errorMessage: doc.errorMessage ?? null,
        createdAt: new Date(doc.createdAt).toISOString(),
        updatedAt: new Date(doc.updatedAt).toISOString(),
    };
}

function mapLean(doc: CrawlDataLean & { _id: unknown; websiteId: unknown }): CrawlDataLean {
    return {
        ...doc,
        _id: String(doc._id),
        websiteId: String(doc.websiteId),
    };
}

export async function hasActiveCrawlForWebsite(websiteId: string): Promise<boolean> {
    await connectToDatabase();
    const objectId = assertObjectId(websiteId);
    const existing = await CrawlData.findOne({
        websiteId: objectId,
        status: { $in: ["queued", "processing"] },
    })
        .select("_id")
        .lean();
    return Boolean(existing);
}

export async function createCrawlRecord(input: {
    websiteId: string;
    requestedUrl: string;
    status?: CrawlStatus;
    auditRunId?: string | null;
    idempotencyKey?: string;
}): Promise<{ crawl: SerializableCrawl; created: boolean }> {
    await connectToDatabase();
    const websiteObjectId = assertObjectId(input.websiteId);
    const idempotencyKey =
        input.idempotencyKey ?? `crawl:${input.websiteId}:active`;

    const { acquireOrReuseActiveJob } = await import("@/src/services/audit-jobs/stage-job");
    const result = await acquireOrReuseActiveJob({
        idempotencyKey,
        findActive: async () =>
            CrawlData.findOne({
                websiteId: websiteObjectId,
                status: { $in: ["queued", "processing"] },
            }).lean<CrawlDataLean | null>(),
        createDocument: async () => {
            const created = await CrawlData.create({
                websiteId: websiteObjectId,
                auditRunId: input.auditRunId ? assertObjectId(input.auditRunId) : null,
                status: input.status ?? "queued",
                idempotencyKey,
                attempt: 1,
                requestedUrl: input.requestedUrl,
                startedAt: null,
                completedAt: null,
                heartbeatAt: null,
                finalUrl: "",
                homepageTitle: "",
                metaDescription: "",
                language: "",
                pagesDiscovered: 0,
                pagesCrawled: 0,
                internalLinks: [],
                externalLinks: [],
                emailsFound: [],
                phoneNumbersFound: [],
                socialLinks: [],
                hasAboutPage: false,
                hasContactPage: false,
                hasServicesPage: false,
                hasPrivacyPolicy: false,
                hasTerms: false,
                pageResults: [],
                crawlDurationMs: 0,
                errorMessage: null,
            });
            return created.toObject() as { _id: unknown };
        },
        serialize: (doc) => ({ id: String(doc._id) }),
    });

    const crawl = await getCrawlById(result.record.id);
    if (!crawl) {
        throw new CrawlDataError("database", "Unable to create crawl record.");
    }
    return { crawl, created: result.created };
}

export async function getLatestCrawlForWebsite(
    websiteId: string,
): Promise<SerializableCrawl | null> {
    await connectToDatabase();
    let objectId: mongoose.Types.ObjectId;
    try {
        objectId = assertObjectId(websiteId);
    } catch {
        return null;
    }

    const doc = await CrawlData.findOne({ websiteId: objectId })
        .sort({ createdAt: -1 })
        .lean<CrawlDataLean | null>();

    if (!doc) return null;
    return toSerializable(mapLean(doc as CrawlDataLean & { _id: unknown; websiteId: unknown }));
}

export async function getCrawlsForWebsite(websiteId: string): Promise<SerializableCrawl[]> {
    await connectToDatabase();
    let objectId: mongoose.Types.ObjectId;
    try {
        objectId = assertObjectId(websiteId);
    } catch {
        return [];
    }

    const docs = await CrawlData.find({ websiteId: objectId })
        .sort({ createdAt: -1 })
        .lean<CrawlDataLean[]>();

    return docs.map((doc) =>
        toSerializable(mapLean(doc as CrawlDataLean & { _id: unknown; websiteId: unknown })),
    );
}

export async function getCrawlById(crawlId: string): Promise<SerializableCrawl | null> {
    await connectToDatabase();
    let objectId: mongoose.Types.ObjectId;
    try {
        objectId = assertObjectId(crawlId);
    } catch {
        return null;
    }

    const doc = await CrawlData.findById(objectId).lean<CrawlDataLean | null>();
    if (!doc) return null;
    return toSerializable(mapLean(doc as CrawlDataLean & { _id: unknown; websiteId: unknown }));
}

export async function getCrawlByAuditRunId(
    auditRunId: string,
): Promise<SerializableCrawl | null> {
    await connectToDatabase();
    let objectId: mongoose.Types.ObjectId;
    try {
        objectId = assertObjectId(auditRunId);
    } catch {
        return null;
    }

    const doc = await CrawlData.findOne({ auditRunId: objectId })
        .sort({ createdAt: -1 })
        .lean<CrawlDataLean | null>();
    if (!doc) return null;
    return toSerializable(mapLean(doc as CrawlDataLean & { _id: unknown; websiteId: unknown }));
}

export async function updateCrawlStatus(
    crawlId: string,
    status: CrawlStatus,
    extra: Partial<{
        startedAt: Date | null;
        completedAt: Date | null;
        heartbeatAt: Date | null;
        errorMessage: string | null;
        idempotencyKey: string | null;
    }> = {},
): Promise<SerializableCrawl> {
    await connectToDatabase();
    const objectId = assertObjectId(crawlId, "Invalid crawl ID.");

    const updated = await CrawlData.findByIdAndUpdate(
        objectId,
        {
            $set: {
                status,
                ...extra,
            },
        },
        { new: true, runValidators: true },
    ).lean<CrawlDataLean | null>();

    if (!updated) {
        throw new CrawlDataError("not-found", "Crawl record not found.");
    }

    return toSerializable(
        mapLean(updated as CrawlDataLean & { _id: unknown; websiteId: unknown }),
    );
}

export async function completeCrawl(
    crawlId: string,
    payload: Omit<
        SerializableCrawl,
        | "id"
        | "websiteId"
        | "status"
        | "startedAt"
        | "completedAt"
        | "createdAt"
        | "updatedAt"
    >,
): Promise<SerializableCrawl> {
    await connectToDatabase();
    const objectId = assertObjectId(crawlId, "Invalid crawl ID.");

    const updated = await CrawlData.findByIdAndUpdate(
        objectId,
        {
            $set: {
                status: "complete",
                completedAt: new Date(),
                heartbeatAt: new Date(),
                idempotencyKey: null,
                requestedUrl: payload.requestedUrl,
                finalUrl: payload.finalUrl,
                homepageTitle: payload.homepageTitle,
                metaDescription: payload.metaDescription,
                language: payload.language,
                pagesDiscovered: payload.pagesDiscovered,
                pagesCrawled: payload.pagesCrawled,
                internalLinks: payload.internalLinks,
                externalLinks: payload.externalLinks,
                emailsFound: payload.emailsFound,
                phoneNumbersFound: payload.phoneNumbersFound,
                socialLinks: payload.socialLinks,
                hasAboutPage: payload.hasAboutPage,
                hasContactPage: payload.hasContactPage,
                hasServicesPage: payload.hasServicesPage,
                hasPrivacyPolicy: payload.hasPrivacyPolicy,
                hasTerms: payload.hasTerms,
                pageResults: payload.pageResults,
                crawlDurationMs: payload.crawlDurationMs,
                errorMessage: payload.errorMessage,
            },
        },
        { new: true, runValidators: true },
    ).lean<CrawlDataLean | null>();

    if (!updated) {
        throw new CrawlDataError("not-found", "Crawl record not found.");
    }

    return toSerializable(
        mapLean(updated as CrawlDataLean & { _id: unknown; websiteId: unknown }),
    );
}

export async function failCrawl(
    crawlId: string,
    errorMessage: string,
): Promise<SerializableCrawl> {
    return updateCrawlStatus(crawlId, "failed", {
        completedAt: new Date(),
        heartbeatAt: new Date(),
        idempotencyKey: null,
        errorMessage,
    });
}

export async function touchCrawlHeartbeat(crawlId: string): Promise<void> {
    await connectToDatabase();
    await CrawlData.findByIdAndUpdate(assertObjectId(crawlId, "Invalid crawl ID."), {
        $set: { heartbeatAt: new Date() },
    });
}
