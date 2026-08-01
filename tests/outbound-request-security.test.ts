import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
    isPrivateOrReservedIp,
    OutboundRequestSecurityError,
    parseAllowedHttpUrl,
    validateOutboundHttpUrl,
} from "@/src/services/outbound-request-security";

describe("outbound request security", () => {
    it("allows public IPv4 hostnames", async () => {
        const parsed = await validateOutboundHttpUrl("https://example.com");
        assert.equal(parsed.hostname, "example.com");
    });

    it("rejects loopback IPv4 literals", () => {
        assert.equal(isPrivateOrReservedIp("127.0.0.1"), true);
        assert.equal(isPrivateOrReservedIp("10.0.0.1"), true);
        assert.equal(isPrivateOrReservedIp("192.168.1.1"), true);
        assert.equal(isPrivateOrReservedIp("169.254.169.254"), true);
    });

    it("rejects loopback and private IPv6 literals", () => {
        assert.equal(isPrivateOrReservedIp("::1"), true);
        assert.equal(isPrivateOrReservedIp("fe80::1"), true);
        assert.equal(isPrivateOrReservedIp("fd12::1"), true);
        assert.equal(isPrivateOrReservedIp("fe80::a9fe:a9fe"), true);
    });

    it("treats IPv4-mapped IPv6 loopback as private", () => {
        assert.equal(isPrivateOrReservedIp("::ffff:127.0.0.1"), true);
    });

    it("allows public IPv6 literals", () => {
        assert.equal(isPrivateOrReservedIp("2001:4860:4860::8888"), false);
    });

    it("rejects unsupported protocols and embedded credentials", () => {
        assert.throws(
            () => parseAllowedHttpUrl("file:///etc/passwd"),
            OutboundRequestSecurityError,
        );
        assert.throws(
            () => parseAllowedHttpUrl("https://user:pass@example.com"),
            OutboundRequestSecurityError,
        );
    });

    it("rejects localhost hostnames", async () => {
        await assert.rejects(
            () => validateOutboundHttpUrl("http://localhost"),
            OutboundRequestSecurityError,
        );
        await assert.rejects(
            () => validateOutboundHttpUrl("http://app.localhost"),
            OutboundRequestSecurityError,
        );
    });
});
