import { Document, Page, Text, View } from "@react-pdf/renderer";
import { WORKBOOK_CONTENT } from "@/lib/clientDiscoveryWorkbook/content";
import type { WorkbookAnswers, WorkbookField } from "@/lib/clientDiscoveryWorkbook/types";
import { workbookPdfStyles as s } from "./workbookPdfStyles";

const WorkbookHr = () => <View style={s.hr} />;

function SectionHeading({
    number,
    title,
    description,
}: {
    number: number;
    title: string;
    description: string;
}) {
    return (
        <View style={s.sectionHeading} wrap={false}>
            <Text style={s.sectionNumber}>{number}</Text>
            <View style={s.sectionRule} />
            <Text style={s.sectionTitle}>{title}</Text>
            <View style={s.sectionRule} />
            <Text style={s.sectionDescription}>{description}</Text>
        </View>
    );
}

function PdfWritingLines({ count }: { count: number }) {
    return (
        <View>
            {Array.from({ length: count }, (_, i) => (
                <View key={i} style={s.line} />
            ))}
        </View>
    );
}

function PdfField({
    field,
    value,
    blank,
}: {
    field: WorkbookField;
    value: string;
    blank: boolean;
}) {
    const lineCount = field.type === "textarea" ? 5 : 2;
    const showLines = blank || !value.trim();

    return (
        <View style={s.fieldBlock} wrap={false}>
            <Text style={s.question}>
                {field.label}
                {field.required ? " *" : ""}
            </Text>
            {showLines ? (
                <PdfWritingLines count={lineCount} />
            ) : (
                <Text style={s.answer}>{value}</Text>
            )}
        </View>
    );
}

function PageChrome() {
    return (
        <>
            <Text style={s.header} fixed>
                Client Discovery Workbook
            </Text>
            <Text style={s.footer} fixed>
                Information in this workbook is used only to understand your project and
                prepare a proposal. Nice Guy Web Design — Toronto and GTA.
            </Text>
            <Text
                style={s.pageNumber}
                render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
                fixed
            />
        </>
    );
}

export type WorkbookPdfDocumentProps = {
    answers: WorkbookAnswers;
    blank: boolean;
};

export function WorkbookPdfDocument({ answers, blank }: WorkbookPdfDocumentProps) {
    const { page } = WORKBOOK_CONTENT;

    return (
        <Document
            title="Client Discovery Workbook"
            author="Nice Guy Web Design"
            subject="Website project discovery"
            creator="Nice Guy Web Design"
        >
            <Page size="LETTER" style={s.body}>
                <PageChrome />

                <View style={s.titleBlock}>
                    <Text style={s.title}>{page.title}</Text>
                    <WorkbookHr />
                    <Text style={s.subtitle}>{page.subtitle}</Text>
                    <Text style={s.coverMeta}>
                        {blank
                            ? "Blank workbook — print and complete by hand"
                            : "Workbook with your saved answers"}
                    </Text>
                </View>
            </Page>

            <Page size="LETTER" style={s.body}>
                <PageChrome />

                <Text style={s.h2}>How to use this workbook</Text>
                <Text style={s.bodyText}>{page.purpose}</Text>
                {page.completionOptions.map((option) => (
                    <Text key={option} style={s.listItem}>
                        • {option}
                    </Text>
                ))}
                <Text style={s.bodyText}>
                    Required fields are marked with an asterisk (*). Return the completed workbook
                    by email or bring it to your discovery call.
                </Text>
            </Page>

            {WORKBOOK_CONTENT.sections.map((section, index) => (
                <Page key={section.id} size="LETTER" style={s.body} wrap>
                    <PageChrome />

                    <SectionHeading
                        number={index + 1}
                        title={section.title}
                        description={section.description}
                    />
                    {section.fields.map((field) => (
                        <PdfField
                            key={field.name}
                            field={field}
                            value={answers[field.name] ?? ""}
                            blank={blank}
                        />
                    ))}
                </Page>
            ))}
        </Document>
    );
}
