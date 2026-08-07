import { createElement } from "react";
import { Image, Text, View } from "@react-pdf/renderer";
import type { AuditPdfViewModel } from "@/src/services/pdf-reports/build-pdf-view-model";
import { auditPdfStyles as s } from "./auditPdfStyles";
import {
    AccentRule,
    EmptyState,
    FindingCard,
    PriorityBadge,
    SectionHeading,
} from "./shared";
import type { PdfImageSource } from "@/src/services/pdf-reports/fetch-pdf-image";

function ScreenshotBlock({
    label,
    image,
    maxHeight,
}: {
    label: string;
    image: PdfImageSource | null;
    maxHeight: number;
}) {
    return (
        <View style={s.screenshotFrame}>
            {image
                ? createElement(Image, {
                      src: image.src,
                      style: {
                          maxHeight,
                          maxWidth: "100%",
                          objectFit: "contain" as const,
                      },
                  })
                : (
                <View style={s.screenshotMissing}>
                    <Text style={s.mutedNote}>{label} screenshot unavailable</Text>
                </View>
                  )}
            <Text style={s.screenshotCaption}>{label}</Text>
        </View>
    );
}

export function CoverPageContent({ model }: { model: AuditPdfViewModel }) {
    return (
        <View>
            <Text style={s.brandMark}>NICE GUY WEB DESIGN</Text>
            <AccentRule />
            <Text style={s.coverTitle}>{model.title}</Text>
            {model.subtitle ? <Text style={s.coverSubtitle}>{model.subtitle}</Text> : null}

            <View style={s.metaRow}>
                <View style={s.metaChip}>
                    <Text style={s.metaLabel}>Website</Text>
                    <Text style={s.metaValue}>{model.domain}</Text>
                </View>
                <View style={s.metaChip}>
                    <Text style={s.metaLabel}>Audit date</Text>
                    <Text style={s.metaValue}>{model.auditDateLabel}</Text>
                </View>
                <View style={s.metaChip}>
                    <Text style={s.metaLabel}>Prepared for</Text>
                    <Text style={s.metaValue}>{model.businessName}</Text>
                </View>
            </View>

            {model.overallScore != null ? (
                <View style={s.scoreBlock}>
                    <View>
                        <Text style={s.scoreValue}>{Math.round(model.overallScore)}</Text>
                        <Text style={s.scoreLabel}>
                            {model.overallScoreLabel || "Nice Guy overall score"}
                        </Text>
                    </View>
                    <Text style={s.scoreCaption}>
                        Official score from Nice Guy Metrics. AI analysis interprets
                        evidence and does not replace this score.
                    </Text>
                </View>
            ) : null}

            <SectionHeading title="Executive summary" />
            <Text style={s.bodyText}>{model.executiveSummary}</Text>
            {model.businessImpactSummary ? (
                <>
                    <SectionHeading title="Assessment overview" />
                    <Text style={s.bodyText}>{model.businessImpactSummary}</Text>
                </>
            ) : null}
        </View>
    );
}

export function HomepagePreviewContent({ model }: { model: AuditPdfViewModel }) {
    return (
        <View>
            <SectionHeading
                title="Homepage preview"
                intro={`${model.domain} — captured during the audit crawl. Screenshots are existing audit evidence, not re-captured for this PDF.`}
            />
            <View style={s.twoCol}>
                <View style={s.col}>
                    <ScreenshotBlock
                        label="Desktop"
                        image={model.desktopScreenshot}
                        maxHeight={420}
                    />
                </View>
                <View style={[s.col, { maxWidth: 180 }]}>
                    <ScreenshotBlock
                        label="Mobile"
                        image={model.mobileScreenshot}
                        maxHeight={420}
                    />
                </View>
            </View>
        </View>
    );
}

export function HomepageChangesContent({ model }: { model: AuditPdfViewModel }) {
    const changes = model.homepageChanges;
    return (
        <View>
            <SectionHeading
                title="Recommended homepage changes"
                intro={
                    changes?.summary ||
                    "Homepage-specific recommendations were not included in this analysis result."
                }
            />
            {!changes || changes.priorityChanges.length === 0 ? (
                <EmptyState message="No homepage change recommendations were persisted for this report." />
            ) : (
                changes.priorityChanges.map((item, index) => (
                    <View key={`${item.title}-${index}`} style={s.card} wrap={false}>
                        <PriorityBadge priority={item.priority} />
                        <Text style={s.cardMeta}>{item.category}</Text>
                        <Text style={s.cardTitle}>{item.title}</Text>
                        <Text style={s.fieldLabel}>Problem</Text>
                        <Text style={s.bodyText}>{item.problem}</Text>
                        <Text style={s.fieldLabel}>Recommended change</Text>
                        <Text style={s.bodyText}>{item.recommendation}</Text>
                        <Text style={s.fieldLabel}>Expected impact</Text>
                        <Text style={s.bodyText}>{item.expectedImpact}</Text>
                        {item.evidence && item.evidence.length > 0 ? (
                            <>
                                <Text style={s.fieldLabel}>Evidence</Text>
                                <Text style={s.bodyText}>{item.evidence.join(" · ")}</Text>
                            </>
                        ) : null}
                    </View>
                ))
            )}
        </View>
    );
}

export function PerformanceContent({ model }: { model: AuditPdfViewModel }) {
    const strategies = [model.pageSpeed.mobile, model.pageSpeed.desktop];
    return (
        <View>
            <SectionHeading
                title="Performance"
                intro="PageSpeed Insights metrics collected during the audit. Only available values are shown."
            />
            {strategies.map((strategy) => (
                <View key={strategy.label} style={{ marginBottom: 14 }}>
                    <Text style={s.cardTitle}>{strategy.label}</Text>
                    {!strategy.available || strategy.metrics.length === 0 ? (
                        <EmptyState message={`${strategy.label} PageSpeed data unavailable.`} />
                    ) : (
                        <View style={s.metricGrid}>
                            {strategy.metrics.map((metric) => (
                                <View key={metric.label} style={s.metricCell}>
                                    <Text style={s.metricLabel}>{metric.label}</Text>
                                    <Text style={s.metricValue}>{metric.value}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            ))}
        </View>
    );
}

export function UxSectionContent({ model }: { model: AuditPdfViewModel }) {
    return (
        <View>
            <SectionHeading
                title="UX & conversion readiness"
                intro="Nice Guy Metrics category scores and deterministic recommendations from the audit."
            />
            {model.uxCategories.length === 0 ? (
                <EmptyState message="Nice Guy category scores unavailable." />
            ) : (
                <View style={s.card}>
                    {model.uxCategories.map((category) => (
                        <View key={category.name} style={s.categoryRow}>
                            <Text>{category.name}</Text>
                            <Text style={{ fontFamily: "Helvetica-Bold" }}>
                                {Math.round(category.score)} · {category.scoreLabel}
                            </Text>
                        </View>
                    ))}
                </View>
            )}
            {model.uxRecommendations.map((item, index) => (
                <FindingCard
                    key={`${item.title}-${index}`}
                    title={item.title}
                    description={item.description}
                    category={item.categoryName}
                    priority={item.priority}
                />
            ))}
        </View>
    );
}

export function SeoSectionContent({ model }: { model: AuditPdfViewModel }) {
    const seoScores = [
        ...model.pageSpeed.mobile.metrics.filter((m) => m.label === "SEO"),
        ...model.pageSpeed.desktop.metrics.filter((m) => m.label === "SEO"),
    ];
    return (
        <View>
            <SectionHeading
                title="SEO"
                intro="SEO findings from AI analysis and available PageSpeed SEO scores."
            />
            {seoScores.length > 0 ? (
                <View style={s.metricGrid}>
                    {seoScores.map((metric, index) => (
                        <View key={`${metric.label}-${index}`} style={s.metricCell}>
                            <Text style={s.metricLabel}>
                                {index === 0 ? "Mobile SEO" : "Desktop SEO"}
                            </Text>
                            <Text style={s.metricValue}>{metric.value}</Text>
                        </View>
                    ))}
                </View>
            ) : null}
            {model.seoFindings.length === 0 ? (
                <EmptyState message="No dedicated SEO findings were recorded for this report." />
            ) : (
                model.seoFindings.map((item, index) => (
                    <FindingCard
                        key={`${item.title}-${index}`}
                        title={item.title}
                        description={item.description}
                        category={item.category}
                        priority={item.priority}
                    />
                ))
            )}
        </View>
    );
}

export function AccessibilitySectionContent({ model }: { model: AuditPdfViewModel }) {
    const a11yScores = [
        ...model.pageSpeed.mobile.metrics.filter((m) => m.label === "Accessibility"),
        ...model.pageSpeed.desktop.metrics.filter((m) => m.label === "Accessibility"),
    ];
    return (
        <View>
            <SectionHeading
                title="Accessibility"
                intro="Accessibility-related findings and available PageSpeed accessibility scores."
            />
            {a11yScores.length > 0 ? (
                <View style={[s.metricGrid, { marginBottom: 10 }]}>
                    {a11yScores.map((metric, index) => (
                        <View key={`${metric.label}-${index}`} style={s.metricCell}>
                            <Text style={s.metricLabel}>
                                {index === 0 ? "Mobile accessibility" : "Desktop accessibility"}
                            </Text>
                            <Text style={s.metricValue}>{metric.value}</Text>
                        </View>
                    ))}
                </View>
            ) : null}
            {model.accessibilityFindings.length === 0 ? (
                <EmptyState message="No dedicated accessibility findings were recorded for this report." />
            ) : (
                model.accessibilityFindings.map((item, index) => (
                    <FindingCard
                        key={`${item.title}-${index}`}
                        title={item.title}
                        description={item.description}
                        category={item.category}
                        priority={item.priority}
                    />
                ))
            )}
        </View>
    );
}

export function PriorityActionPlanContent({ model }: { model: AuditPdfViewModel }) {
    return (
        <View>
            <SectionHeading
                title="Priority action plan"
                intro="A concise customer-facing plan derived from the persisted analysis — not regenerated during PDF creation."
            />
            {model.priorityPlan.length === 0 ? (
                <EmptyState message="No priority plan items were available." />
            ) : (
                model.priorityPlan.map((item, index) => (
                    <View key={`${item.title}-${index}`} style={s.card} wrap={false}>
                        <PriorityBadge priority={item.priority} />
                        <Text style={s.cardTitle}>
                            {item.rank != null ? `${item.rank}. ` : ""}
                            {item.title}
                        </Text>
                        <Text style={s.bodyText}>{item.reason}</Text>
                    </View>
                ))
            )}

            {model.strengths.length > 0 ? (
                <>
                    <SectionHeading title="Strengths" />
                    {model.strengths.slice(0, 5).map((item, index) => (
                        <FindingCard
                            key={`${item.title}-${index}`}
                            title={item.title}
                            description={item.description}
                            category={item.category}
                        />
                    ))}
                </>
            ) : null}

            {model.disclaimers.length > 0 ? (
                <>
                    <SectionHeading title="Limitations" />
                    {model.disclaimers.map((item, index) => (
                        <Text key={index} style={s.bodyText}>
                            • {item}
                        </Text>
                    ))}
                </>
            ) : null}
        </View>
    );
}
