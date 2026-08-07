/** Default MongoDB database for the Website Audit platform (Mongoose). */
export const DEFAULT_AUDIT_DATABASE_NAME = "audit_website";

/** Default MongoDB database for demo templates (native driver). */
export const DEFAULT_TEMPLATE_DATABASE_NAME = "template_database";

export function resolveAuditDatabaseName(): string {
    return (
        process.env.MONGODB_DB_NAME?.trim() ||
        process.env.MONGODB_AUDIT_DB_NAME?.trim() ||
        DEFAULT_AUDIT_DATABASE_NAME
    );
}

export function resolveTemplateDatabaseName(): string {
    return process.env.MONGODB_TEMPLATE_DB_NAME?.trim() || DEFAULT_TEMPLATE_DATABASE_NAME;
}
