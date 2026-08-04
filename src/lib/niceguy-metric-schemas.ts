import { Schema } from "mongoose";
import type {
    CategoryRecommendation,
    CategoryScore,
    MetricCheck,
    MetricEvidence,
} from "@/src/services/niceguy-scoring/types";

export const MetricEvidenceSchema = new Schema<MetricEvidence>(
    {
        type: {
            type: String,
            enum: [
                "crawl",
                "pagespeed",
                "page",
                "content",
                "contact",
                "form",
                "image",
                "link",
                "derived",
            ],
            required: true,
        },
        label: { type: String, required: true },
        value: { type: Schema.Types.Mixed, default: null },
        pageUrl: { type: String, default: null },
    },
    { _id: false },
);

export const MetricCheckSchema = new Schema<MetricCheck>(
    {
        id: { type: String, required: true },
        label: { type: String, required: true },
        description: { type: String, required: true },
        status: {
            type: String,
            enum: [
                "passed",
                "failed",
                "partial",
                "unavailable",
                "not_detected",
                "not_applicable",
            ],
            required: true,
        },
        weight: { type: Number, required: true, min: 0 },
        pointsAwarded: { type: Number, required: true, min: 0 },
        maximumPoints: { type: Number, required: true, min: 0 },
        evidence: { type: [MetricEvidenceSchema], default: [] },
        missing: { type: [String], default: [] },
        recommendation: { type: String, default: null },
        priority: {
            type: String,
            enum: ["high", "medium", "low", null],
            default: null,
        },
    },
    { _id: false },
);

export const CategoryRecommendationSchema = new Schema<CategoryRecommendation>(
    {
        checkId: { type: String, required: true },
        priority: {
            type: String,
            enum: ["high", "medium", "low"],
            required: true,
        },
        title: { type: String, required: true },
        description: { type: String, required: true },
    },
    { _id: false },
);

export const CategoryScoreSchema = new Schema<CategoryScore>(
    {
        score: { type: Number, required: true, min: 0, max: 100 },
        maximumScore: { type: Number, required: true, min: 0, max: 100, default: 100 },
        confidence: { type: Number, required: true, min: 0, max: 100 },
        checks: { type: [MetricCheckSchema], default: [] },
        strengths: { type: [String], default: [] },
        issues: { type: [String], default: [] },
        recommendations: { type: [CategoryRecommendationSchema], default: [] },
        evidenceCoverage: { type: Number, min: 0, max: 100 },
        qualityScore: { type: Number, min: 0, max: 100 },
        configuredWeight: { type: Number, min: 0, max: 1 },
        effectiveWeight: { type: Number, min: 0, max: 1 },
        limitations: { type: [String], default: [] },
    },
    { _id: false },
);

export const NiceGuySummarySchema = new Schema(
    {
        strongestCategory: { type: String, default: null },
        weakestCategory: { type: String, default: null },
        highPriorityIssueCount: { type: Number, default: 0, min: 0 },
        mediumPriorityIssueCount: { type: Number, default: 0, min: 0 },
        lowPriorityIssueCount: { type: Number, default: 0, min: 0 },
        checksPassed: { type: Number, default: 0, min: 0 },
        checksFailed: { type: Number, default: 0, min: 0 },
        checksUnavailable: { type: Number, default: 0, min: 0 },
    },
    { _id: false },
);

export function emptyCategoryScore(): CategoryScore {
    return {
        score: 0,
        maximumScore: 100,
        confidence: 0,
        checks: [],
        strengths: [],
        issues: [],
        recommendations: [],
    };
}
