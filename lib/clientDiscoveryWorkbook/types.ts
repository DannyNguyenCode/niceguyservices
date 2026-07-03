export type WorkbookFieldType = "text" | "email" | "textarea" | "select";

export type WorkbookField = {
    name: string;
    label: string;
    type: WorkbookFieldType;
    required?: boolean;
    options?: string[];
};

export type WorkbookSection = {
    id: string;
    title: string;
    description: string;
    fields: WorkbookField[];
};

export type WorkbookPageMeta = {
    title: string;
    subtitle: string;
    purpose: string;
    completionOptions: string[];
};

export type WorkbookContent = {
    page: WorkbookPageMeta;
    sections: WorkbookSection[];
};

export type WorkbookAnswers = Record<string, string>;

export type WorkbookSubmission = {
    answers: WorkbookAnswers;
    submittedAt: string;
};
