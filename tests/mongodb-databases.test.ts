import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import {
    DEFAULT_AUDIT_DATABASE_NAME,
    DEFAULT_TEMPLATE_DATABASE_NAME,
    resolveAuditDatabaseName,
    resolveTemplateDatabaseName,
} from "@/src/config/mongodb-databases";

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
});

afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
});

describe("mongodb database env resolution", () => {
    it("uses separate defaults for audit and template databases", () => {
        delete process.env.MONGODB_DB_NAME;
        delete process.env.MONGODB_AUDIT_DB_NAME;
        delete process.env.MONGODB_TEMPLATE_DB_NAME;

        assert.equal(resolveAuditDatabaseName(), DEFAULT_AUDIT_DATABASE_NAME);
        assert.equal(resolveTemplateDatabaseName(), DEFAULT_TEMPLATE_DATABASE_NAME);
        assert.notEqual(resolveAuditDatabaseName(), resolveTemplateDatabaseName());
    });

    it("routes audit data to MONGODB_DB_NAME without affecting templates", () => {
        process.env.MONGODB_DB_NAME = "audit_website";
        delete process.env.MONGODB_TEMPLATE_DB_NAME;

        assert.equal(resolveAuditDatabaseName(), "audit_website");
        assert.equal(resolveTemplateDatabaseName(), DEFAULT_TEMPLATE_DATABASE_NAME);
    });

    it("routes template data to MONGODB_TEMPLATE_DB_NAME", () => {
        process.env.MONGODB_DB_NAME = "audit_website";
        process.env.MONGODB_TEMPLATE_DB_NAME = "template_database";

        assert.equal(resolveAuditDatabaseName(), "audit_website");
        assert.equal(resolveTemplateDatabaseName(), "template_database");
    });

    it("supports MONGODB_AUDIT_DB_NAME as an audit alias", () => {
        delete process.env.MONGODB_DB_NAME;
        process.env.MONGODB_AUDIT_DB_NAME = "niceguy_audit_preview";

        assert.equal(resolveAuditDatabaseName(), "niceguy_audit_preview");
    });
});
