import { Text, View } from "@react-pdf/renderer";
import { auditPdfStyles as s, pdfColors } from "./auditPdfStyles";
import type { PdfPriority } from "@/src/services/pdf-reports/build-pdf-view-model";

export function PdfPageChrome({ domain }: { domain: string }) {
    return (
        <>
            <Text style={s.header} fixed>
                Nice Guy Web Design · Website Audit Report · {domain}
            </Text>
            <View style={s.footer} fixed>
                <Text>Prepared by Nice Guy Web Design</Text>
                <Text
                    render={({ pageNumber, totalPages }) =>
                        `Page ${pageNumber} of ${totalPages}`
                    }
                />
            </View>
        </>
    );
}

export function PriorityBadge({ priority }: { priority: PdfPriority }) {
    const style =
        priority === "high"
            ? s.priorityHigh
            : priority === "medium"
              ? s.priorityMedium
              : s.priorityLow;
    return <Text style={[s.priorityBadge, style]}>{priority}</Text>;
}

export function SectionHeading({
    title,
    intro,
}: {
    title: string;
    intro?: string;
}) {
    return (
        <View wrap={false}>
            <Text style={s.sectionTitle}>{title}</Text>
            {intro ? <Text style={s.sectionIntro}>{intro}</Text> : null}
        </View>
    );
}

export function FindingCard({
    title,
    description,
    category,
    priority,
}: {
    title: string;
    description: string;
    category?: string | null;
    priority?: PdfPriority;
}) {
    return (
        <View style={s.card} wrap={false}>
            {priority ? <PriorityBadge priority={priority} /> : null}
            {category ? <Text style={s.cardMeta}>{category}</Text> : null}
            <Text style={s.cardTitle}>{title}</Text>
            <Text style={s.bodyText}>{description}</Text>
        </View>
    );
}

export function EmptyState({ message }: { message: string }) {
    return <Text style={s.mutedNote}>{message}</Text>;
}

export function AccentRule() {
    return (
        <View
            style={{
                height: 3,
                width: 48,
                backgroundColor: pdfColors.sky,
                marginBottom: 16,
            }}
        />
    );
}
