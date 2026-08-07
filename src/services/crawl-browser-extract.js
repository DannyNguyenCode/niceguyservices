/**
 * Browser-side crawl extraction. Plain JavaScript only — must not be transpiled
 * (tsx/esbuild injects __name helpers that break Playwright page.evaluate).
 */
function extractPageDataInBrowser() {
    function isVisible(element) {
        const style = window.getComputedStyle(element);
        if (style.display === "none" || style.visibility === "hidden") return false;
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
    }

    const headings = Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6"))
        .filter(isVisible)
        .map(function (element) {
            return {
                level: Number.parseInt(element.tagName.slice(1), 10),
                text: (element.textContent || "").replace(/\s+/g, " ").trim(),
            };
        })
        .filter(function (heading) {
            return heading.text.length > 0;
        });

    const buttons = Array.from(
        document.querySelectorAll("button, [role='button'], a.btn, a.button"),
    )
        .filter(isVisible)
        .map(function (element) {
            return {
                text: (element.textContent || "").replace(/\s+/g, " ").trim(),
                href:
                    element instanceof HTMLAnchorElement
                        ? element.href || undefined
                        : undefined,
            };
        })
        .filter(function (button) {
            return button.text.length > 0;
        })
        .slice(0, 50);

    const forms = Array.from(document.querySelectorAll("form"))
        .filter(isVisible)
        .map(function (form) {
            const fields = Array.from(form.querySelectorAll("input, textarea, select"))
                .filter(isVisible)
                .map(function (field) {
                    const input = field;
                    const labelElement = input.id
                        ? document.querySelector("label[for='" + input.id + "']")
                        : field.closest("label");
                    return {
                        type: input.type || field.tagName.toLowerCase(),
                        name: input.name || undefined,
                        label:
                            (labelElement &&
                                (labelElement.textContent || "").replace(/\s+/g, " ").trim()) ||
                            input.getAttribute("aria-label") ||
                            undefined,
                        required: Boolean(input.required),
                    };
                });

            return {
                action: form.getAttribute("action") || undefined,
                method: form.getAttribute("method") || undefined,
                fields: fields,
            };
        })
        .slice(0, 10);

    const images = Array.from(document.querySelectorAll("img"))
        .filter(isVisible)
        .map(function (image) {
            return {
                src: image.getAttribute("src") || image.getAttribute("data-src") || undefined,
                alt: image.getAttribute("alt") || undefined,
            };
        })
        .slice(0, 100);

    const anchors = Array.from(document.querySelectorAll("a[href]"));
    const linkUrls = [];
    const mailtoLinks = [];
    const telLinks = [];

    for (let i = 0; i < anchors.length; i += 1) {
        const anchor = anchors[i];
        const href = (anchor.getAttribute("href") || "").trim();
        if (!href) continue;
        if (href.indexOf("mailto:") === 0) {
            mailtoLinks.push(href);
            continue;
        }
        if (href.indexOf("tel:") === 0) {
            telLinks.push(href);
            continue;
        }
        try {
            const resolved = new URL(href, window.location.href);
            if (resolved.protocol !== "http:" && resolved.protocol !== "https:") {
                continue;
            }
            linkUrls.push(resolved.toString());
        } catch (_error) {
            // Ignore invalid URLs.
        }
    }

    const clone = document.body.cloneNode(true);
    const removable = clone.querySelectorAll(
        "script, style, noscript, svg, nav, header, footer",
    );
    for (let i = 0; i < removable.length; i += 1) {
        removable[i].remove();
    }

    const visibleText = (clone.textContent || "").replace(/\s+/g, " ").trim();

    return {
        title: (document.title || "").trim(),
        metaDescription:
            (
                document.querySelector("meta[name='description']")?.getAttribute("content") || ""
            ).trim(),
        language: (document.documentElement.lang || "").trim(),
        headings: headings,
        buttons: buttons,
        forms: forms,
        images: images,
        linkUrls: linkUrls,
        mailtoLinks: mailtoLinks,
        telLinks: telLinks,
        visibleText: visibleText,
    };
}

function discoverLinksInBrowser() {
    return Array.from(document.querySelectorAll("a[href]")).map(function (anchor) {
        return {
            href: anchor.getAttribute("href") || "",
            text: (anchor.textContent || "").replace(/\s+/g, " ").trim(),
        };
    });
}
