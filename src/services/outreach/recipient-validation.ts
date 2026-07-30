export function validateRecipientEmail(email: string | null | undefined): boolean {
    if (!email?.trim()) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
