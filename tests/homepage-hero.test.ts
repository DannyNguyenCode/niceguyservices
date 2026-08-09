import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
    HOME_HERO_EXPECTATION,
    HOME_HERO_HEADING,
    HOME_HERO_PRIMARY_CTA,
    HOME_HERO_SECONDARY_CTA,
} from "@/components/homepage/homepageHeroContent";
import { PRIMARY_CTA_LABEL, mainNavigation } from "@/lib/navigation";
import homepageContent from "@/components/homepage/homepageContent.json";

describe("homepage hero copy and CTAs", () => {
    it("exposes a correctly spaced H1 phrase", () => {
        assert.equal(HOME_HERO_HEADING, "We Build Websites That Grow Businesses");
        assert.match(HOME_HERO_HEADING, /Websites That/);
        assert.doesNotMatch(HOME_HERO_HEADING, /WebsitesThat/);
    });

    it("uses real destinations for primary and secondary hero CTAs", () => {
        assert.equal(HOME_HERO_PRIMARY_CTA.label, "Start your project");
        assert.equal(HOME_HERO_PRIMARY_CTA.href, "/contact");
        assert.equal(HOME_HERO_SECONDARY_CTA.label, "See our work");
        assert.equal(HOME_HERO_SECONDARY_CTA.href, "/work");
        assert.notEqual(HOME_HERO_PRIMARY_CTA.href, "");
        assert.notEqual(HOME_HERO_PRIMARY_CTA.href, "#");
        assert.notEqual(HOME_HERO_SECONDARY_CTA.href, "");
        assert.notEqual(HOME_HERO_SECONDARY_CTA.href, "#");
    });

    it("keeps CTA intent consistent with contact teaser and nav label", () => {
        assert.equal(PRIMARY_CTA_LABEL, "Start your project");
        assert.equal(homepageContent.contactTeaser.primaryCtaLabel, "Start your project");
        assert.match(HOME_HERO_EXPECTATION, /one business day/i);
        assert.match(homepageContent.contactTeaser.responseNote, /one business day/i);
    });

    it("defines Work as a dropdown with a /work destination and labeled children", () => {
        const work = mainNavigation.find((item) => item.title === "Work");
        assert.ok(work);
        assert.equal(work?.type, "dropdown");
        if (work?.type === "dropdown") {
            assert.equal(work.href, "/work");
            assert.ok(work.children.some((child) => child.href === "/work"));
            assert.ok(work.children.every((child) => child.href.length > 1 && child.href !== "#"));
        }
    });
});
