export function getOutreachSenderProfile(): {
    senderName: string;
    businessName: string;
    websiteUrl: string | null;
    phone: string | null;
    signatureText: string | null;
} {
    const senderName = process.env.OUTREACH_SENDER_NAME?.trim() || "[Your Name]";
    const businessName = process.env.OUTREACH_SENDER_BUSINESS?.trim() || "Nice Guy Web Design";
    const websiteUrl =
        process.env.OUTREACH_SENDER_WEBSITE_URL?.trim() ||
        process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
        null;
    const phone = process.env.OUTREACH_SENDER_PHONE?.trim() || null;
    const signatureText = process.env.OUTREACH_SENDER_SIGNATURE?.trim() || null;

    return {
        senderName,
        businessName,
        websiteUrl,
        phone,
        signatureText,
    };
}
